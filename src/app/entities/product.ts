import { ProductImage } from "./ProductImage";

export class Product {
  id?: string;
  image!: string;
  availableColors!: string[];
  quantity!: number;
  keywords?: string[];
  description?: string;
  sizes!: string[];
  price!: number;
  imageCollection?: ProductImage[];
  isRecommended!: boolean;
  isFeatured!: boolean;
  brand!: string;
  name!: string;
  name_lower!: string;
  maxQuantity!: number;
  dateAdded!: Date;

  static createFromDoc(id: string, doc: any): Product {
    const product = doc as Product;
    product.id = id;
    if (doc.dateAdded._seconds) {
      product.dateAdded = new Date(doc.dateAdded._seconds * 1000);
    } else {
      product.dateAdded = new Date(doc.dateAdded);
    }
    product.imageCollection = doc.imageCollection as ProductImage[];
    return product;
  }
}
