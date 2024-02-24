export class ProductImage {
  id!: string;
  url!: string;
  static createFromDoc(doc: any): ProductImage {
    const productImage = new ProductImage();
    productImage.id = doc.id;
    productImage.url = doc.url;
    return productImage;
  }
  static createFromDocs(docs: any[]): ProductImage[] {
    const productImages: ProductImage[] = [];
    docs.forEach((doc: any) => {
      productImages.push(ProductImage.createFromDoc(doc));
    });
    return productImages;
  }
}
