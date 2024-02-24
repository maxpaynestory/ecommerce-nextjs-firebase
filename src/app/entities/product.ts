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
    const product = new Product();
    product.id = id;
    product.image = doc.image;
    product.availableColors = doc.availableColors;
    product.quantity = doc.quantity;
    product.keywords = doc.keywords;
    product.description = doc.description;
    product.sizes = doc.sizes;
    product.price = doc.price;
    product.imageCollection = ProductImage.createFromDocs(doc.imageCollection);
    product.isRecommended = doc.isRecommended;
    product.isFeatured = doc.isFeatured;
    product.brand = doc.brand;
    product.name = doc.name_lower;
    product.maxQuantity = doc.maxQuantity;
    if (doc.dateAdded._seconds) {
      product.dateAdded = new Date(doc.dateAdded._seconds * 1000);
    } else {
      product.dateAdded = new Date(doc.dateAdded);
    }
    return product;
  }
  toObject(): object {
    return JSON.parse(JSON.stringify(this));
  }
}
