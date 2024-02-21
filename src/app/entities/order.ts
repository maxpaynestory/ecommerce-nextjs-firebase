import { Product } from "./product";

export class Order {
  id?: string;
  orderNumber!: string;
  total!: number;
  guestUserInfo!: GuestUserInfo;
  shippingCost!: number;
  createdAt!: Date;
  product!: Product;

  static createFromDoc(id: string, doc: any): Order {
    const order = doc as Order;
    order.id = id;
    if (doc.createdAt._seconds) {
      order.createdAt = new Date(doc.createdAt._seconds * 1000);
    } else {
      order.createdAt = new Date(doc.createdAt);
    }
    order.product = Product.createFromDoc(doc.product.id, doc.product);
    order.guestUserInfo = GuestUserInfo.createFromDoc(doc.guestUserInfo);
    return order;
  }
}

export class GuestUserInfo {
  fullName!: string;
  isInternational!: boolean;
  address!: string;
  city!: { value: string; label: string };
  mobile!: string;
  type!: string;
  isDone!: boolean;
  email!: string;
  static createFromDoc(doc: any): GuestUserInfo {
    const guestUserInfo = doc as GuestUserInfo;
    return guestUserInfo;
  }
}
