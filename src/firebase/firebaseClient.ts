import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  collection,
  addDoc,
  setDoc,
  increment,
  writeBatch,
} from "firebase/firestore";
import firebaseConfig from "./config";
import { Order } from "../app/entities/order";

class FirebaseClient {
  auth: any;
  storage: any;
  db: any;
  app: any;
  constructor() {
    const currentApps = getApps();
    if (currentApps.length > 0) {
      this.app = currentApps[0];
    } else {
      this.app = initializeApp(firebaseConfig);
    }

    this.storage = getStorage(this.app);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  // AUTH ACTIONS ------------

  createAccount = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(this.auth, email, password);

  signInWithGoogle = () => this.auth.signInWithPopup(new GoogleAuthProvider());

  signInWithFacebook = () =>
    this.auth.signInWithPopup(new FacebookAuthProvider());

  signInWithGithub = () => this.auth.signInWithPopup(new GithubAuthProvider());

  signInWithPhoneNumber = (phone: string, appVerifier: any) =>
    signInWithPhoneNumber(this.auth, phone, appVerifier);

  signOut = () => this.auth.signOut();

  passwordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

  addUser = (id: string, user: any) =>
    this.db.collection("users").doc(id).set(user);

  getUser = (id: string) => getDoc(doc(this.db, "users", id));

  passwordUpdate = (password: string) =>
    this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword: string, newPassword: string) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updatePassword(newPassword)
            .then(() => {
              resolve("Password updated successfully!");
            })
            .catch((error: any) => reject(error));
        })
        .catch((error: any) => reject(error));
    });

  reauthenticate = (currentPassword: string) => {
    const user = this.auth.currentUser;
    const cred = this.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    return user.reauthenticateWithCredential(cred);
  };

  updateEmail = (currentPassword: string, newEmail: string) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updateEmail(newEmail)
            .then(() => {
              resolve("Email Successfully updated");
            })
            .catch((error: any) => reject(error));
        })
        .catch((error: any) => reject(error));
    });

  updateProfile = (id: string, updates: any) =>
    this.db.collection("users").doc(id).update(updates);

  /*onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user: any) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
        }
      });
    });*/

  saveBasketItems = (items: any, userId: string) =>
    this.db.collection("users").doc(userId).update({ basket: items });

  setAuthPersistence = () =>
    this.auth.setPersistence(this.auth.Auth.Persistence.LOCAL);

  // // PRODUCT ACTIONS --------------

  getSingleProduct = (id: string) => getDoc(doc(this.db, "products", id));

  getProducts = (lastRefKey: string) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        if (lastRefKey) {
          try {
            const query = this.db
              .collection("products")
              .orderBy(this.db.FieldPath.documentId())
              .startAfter(lastRefKey)
              .limit(12);

            const snapshot = await query.get();
            const products: any[] = [];
            snapshot.forEach((doc: any) =>
              products.push({ id: doc.id, ...doc.data() })
            );
            const lastKey = snapshot.docs[snapshot.docs.length - 1];

            resolve({ products, lastKey });
          } catch (e: any) {
            reject(e?.message || ":( Failed to fetch products.");
          }
        } else {
          const timeout = setTimeout(() => {
            didTimeout = true;
            reject(new Error("Request timeout, please try again"));
          }, 15000);

          try {
            const totalQuery = await this.db.collection("products").get();
            const total = totalQuery.docs.length;
            const query = this.db
              .collection("products")
              .orderBy(this.db.FieldPath.documentId())
              .limit(12);
            const snapshot = await query.get();

            clearTimeout(timeout);
            if (!didTimeout) {
              const products: any[] = [];
              snapshot.forEach((doc: any) =>
                products.push({ id: doc.id, ...doc.data() })
              );
              const lastKey = snapshot.docs[snapshot.docs.length - 1];

              resolve({ products, lastKey, total });
            }
          } catch (e: any) {
            if (didTimeout) return;
            reject(e?.message || ":( Failed to fetch products.");
          }
        }
      })();
    });
  };

  searchProducts = (searchKey: string) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        const productsRef = this.db.collection("products");

        const timeout = setTimeout(() => {
          didTimeout = true;
          reject(new Error("Request timeout, please try again"));
        }, 15000);

        try {
          const searchedNameRef = productsRef
            .orderBy("name_lower")
            .where("name_lower", ">=", searchKey)
            .where("name_lower", "<=", `${searchKey}\uf8ff`)
            .limit(12);
          const searchedKeywordsRef = productsRef
            .orderBy("dateAdded", "desc")
            .where("keywords", "array-contains-any", searchKey.split(" "))
            .limit(12);

          // const totalResult = await totalQueryRef.get();
          const nameSnaps = await searchedNameRef.get();
          const keywordsSnaps = await searchedKeywordsRef.get();
          // const total = totalResult.docs.length;

          clearTimeout(timeout);
          if (!didTimeout) {
            const searchedNameProducts: any[] = [];
            const searchedKeywordsProducts: any[] = [];
            let lastKey = null;

            if (!nameSnaps.empty) {
              nameSnaps.forEach((doc: any) => {
                searchedNameProducts.push({ id: doc.id, ...doc.data() });
              });
              lastKey = nameSnaps.docs[nameSnaps.docs.length - 1];
            }

            if (!keywordsSnaps.empty) {
              keywordsSnaps.forEach((doc: any) => {
                searchedKeywordsProducts.push({ id: doc.id, ...doc.data() });
              });
            }

            // MERGE PRODUCTS
            const mergedProducts = [
              ...searchedNameProducts,
              ...searchedKeywordsProducts,
            ];
            const hash: any = {};

            mergedProducts.forEach((product) => {
              hash[product.id] = product;
            });

            resolve({ products: Object.values(hash), lastKey });
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e);
        }
      })();
    });
  };

  getFeaturedProducts = (itemsCount = 12) =>
    this.db
      .collection("products")
      .where("isFeatured", "==", true)
      .limit(itemsCount)
      .get();

  getRecommendedProducts = (itemsCount = 12) =>
    this.db
      .collection("products")
      .where("isRecommended", "==", true)
      .limit(itemsCount)
      .get();

  addProduct = (id: string, product: any) =>
    this.db.collection("products").doc(id).set(product);

  generateKey = () => this.db.collection("products").doc().id;

  storeImage = async (id: any, folder: any, imageFile: any) => {
    const snapshot = await this.storage.ref(folder).child(id).put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  };

  deleteImage = (id: string) => this.storage.ref("products").child(id).delete();

  editProduct = (id: string, updates: any) =>
    this.db.collection("products").doc(id).update(updates);

  removeProduct = (id: string) =>
    this.db.collection("products").doc(id).delete();

  buynowProduct = (order: Order) => {
    return new Promise<Order>(async (resolve, reject) => {
      const docRef = await addDoc(
        collection(this.db, "orders"),
        order.toObject()
      );
      const orderId = docRef.id;
      order.id = orderId;
      if (order.product.id) {
        const batch = writeBatch(this.db);
        const nycRef = doc(this.db, "products", order.product.id);
        batch.update(nycRef, { maxQuantity: increment(-1) });
        await batch.commit();
      }
      resolve(order);
    });
  };

  getOrder = (orderNumber: string) =>
    getDocs(
      query(
        collection(this.db, "orders"),
        where("orderNumber", "==", orderNumber)
      )
    );
}

const firebaseClientInstance = new FirebaseClient();

export default firebaseClientInstance;
