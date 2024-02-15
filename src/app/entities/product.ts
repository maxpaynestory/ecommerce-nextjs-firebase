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
    /*product.created = new Date(doc.created._seconds * 1000);
    product.updated = new Date(doc.updated._seconds * 1000);*/
    product.dateAdded = new Date(doc.dateAdded._seconds * 1000);
    product.imageCollection = doc.imageCollection as ProductImage[];
    return product;
  }
}
