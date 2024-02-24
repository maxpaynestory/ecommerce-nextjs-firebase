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
    const order = new Order();
    order.orderNumber = doc.orderNumber;
    order.total = doc.total;
    order.shippingCost = doc.shippingCost;
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
  toObject(): object {
    return JSON.parse(JSON.stringify(this));
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
    const guestUserInfo = new GuestUserInfo();
    guestUserInfo.fullName = doc.fullName;
    guestUserInfo.isInternational = doc.isInternational;
    guestUserInfo.address = doc.address;
    guestUserInfo.city = { value: doc.city.value, label: doc.city.label };
    guestUserInfo.mobile = doc.mobile;
    guestUserInfo.type = doc.type;
    guestUserInfo.isDone = doc.isDone;
    guestUserInfo.email = doc.email;
    return guestUserInfo;
  }
  toObject(): object {
    return JSON.parse(JSON.stringify(this));
  }
}
