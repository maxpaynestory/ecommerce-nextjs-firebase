import admin from "firebase-admin";
import { App, getApps, initializeApp } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { FieldPath, Firestore, getFirestore } from "firebase-admin/firestore";
import { Product } from "../app/entities/product";
import { Order } from "../app/entities/order";

export type ProductSearchResult = {
  products: Product[];
  lastKey: string;
  total?: number;
};

class FirebaseServer {
  public readonly app: App;
  public readonly auth: Auth;
  public readonly firestore: Firestore;

  constructor() {
    const apps = getApps();
    if (apps.length > 0) {
      this.app = apps[0];
    } else {
      this.app = initializeApp({
        credential: admin.credential.cert(
          process.env.SABIYYA_FIRESTORE_ADMIN as string
        ),
      });
    }

    this.auth = getAuth(this.app);
    this.firestore = getFirestore(this.app);
  }

  getFeaturedProducts = (itemsCount = 12) =>
    this.firestore
      .collection("products")
      .where("isFeatured", "==", true)
      .limit(itemsCount)
      .get();

  getRecommendedProducts = (itemsCount = 12) =>
    this.firestore
      .collection("products")
      .where("isRecommended", "==", true)
      .limit(itemsCount)
      .get();

  getSingleProduct = (id: string): Promise<Product | null> => {
    return new Promise(async (resolve, _) => {
      const snapshot = await this.firestore
        .collection("products")
        .doc(id)
        .get();
      if (snapshot.exists) {
        resolve(Product.createFromDoc(snapshot.id, snapshot.data()));
      } else {
        resolve(null);
      }
    });
  };

  getOrder = (orderNumber: string): Promise<Order | null> => {
    return new Promise(async (resolve, _) => {
      const snapshot = await this.firestore
        .collection("orders")
        .where("orderNumber", "==", orderNumber)
        .get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        resolve(Order.createFromDoc(doc.id, doc.data()));
      } else {
        resolve(null);
      }
    });
  };

  getProducts = (
    lastRefKey: string,
    limit: number = 12
  ): Promise<ProductSearchResult> => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        if (lastRefKey) {
          try {
            const query = this.firestore
              .collection("products")
              .orderBy(FieldPath.documentId())
              .startAfter(lastRefKey)
              .limit(limit);

            const snapshot = await query.get();
            const products: Product[] = [];
            snapshot.forEach((doc: any) =>
              products.push(Product.createFromDoc(doc.id, doc.data()))
            );
            const lastKey = snapshot.docs[snapshot.docs.length - 1].id;

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
            const totalQuery = await this.firestore
              .collection("products")
              .get();
            const total = totalQuery.docs.length;
            const query = this.firestore
              .collection("products")
              .orderBy(FieldPath.documentId())
              .limit(limit);
            const snapshot = await query.get();

            clearTimeout(timeout);
            if (!didTimeout) {
              const products: Product[] = [];
              snapshot.forEach((doc: any) =>
                products.push(Product.createFromDoc(doc.id, doc.data()))
              );
              const lastKey = snapshot.docs[snapshot.docs.length - 1].id;

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
}

const firebaseServerInstance = new FirebaseServer();
export default firebaseServerInstance;
