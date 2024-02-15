import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "./config";

class FirebaseClient {
  auth: any;
  storage: any;
  db: any;
  analytics: any;
  app: any;
  constructor() {
    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    this.storage = getStorage(app);
    this.db = getFirestore(app);
    this.auth = getAuth(app);
    this.analytics = getAnalytics(app);
    const uniqueUserId = performance.now().toString();
    this.analytics.setUserId(uniqueUserId);
    this.app = app;
  }

  // AUTH ACTIONS ------------

  createAccount = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  logEvent = (name: string, data: any) => this.analytics.logEvent(name, data);

  signIn = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signInWithGoogle = () => this.auth.signInWithPopup(new GoogleAuthProvider());

  signInWithFacebook = () =>
    this.auth.signInWithPopup(new FacebookAuthProvider());

  signInWithGithub = () => this.auth.signInWithPopup(new GithubAuthProvider());

  signInWithPhoneNumber = (phone: string, appVerifier: any) =>
    this.auth.signInWithPhoneNumber(phone, appVerifier);

  signOut = () => this.auth.signOut();

  passwordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

  addUser = (id: string, user: any) =>
    this.db.collection("users").doc(id).set(user);

  getUser = (id: string) => this.db.collection("users").doc(id).get();

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

  onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user: any) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
        }
      });
    });

  saveBasketItems = (items: any, userId: string) =>
    this.db.collection("users").doc(userId).update({ basket: items });

  setAuthPersistence = () =>
    this.auth.setPersistence(this.auth.Auth.Persistence.LOCAL);

  // // PRODUCT ACTIONS --------------

  getSingleProduct = (id: string) =>
    this.db.collection("products").doc(id).get();

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

  buynowProduct = (
    product: any,
    guestUserInfo: any,
    orderNumber: string,
    total: Number,
    shippingCost: Number
  ) => {
    return new Promise(async (resolve, reject) => {
      const orderId = this.db.collection("orders").doc().id;
      const results = await this.db.collection("orders").doc(orderId).set({
        product: product,
        guestUserInfo: guestUserInfo,
        orderNumber: orderNumber,
        createdAt: new Date(),
        total: total,
        shippingCost: shippingCost,
      });
      const rs = await this.db
        .collection("products")
        .doc(product.id)
        .update({
          maxQuantity: this.db.FieldValue.increment(-1),
        });
      console.log("Ye kia hai", rs);
      resolve(results);
    });
  };

  getOrder = (orderNumber: string) =>
    this.db
      .collection("orders")
      .where("orderNumber", "==", orderNumber)
      .limit(1)
      .get();
}

const firebaseClientInstance = new FirebaseClient();

export default firebaseClientInstance;
