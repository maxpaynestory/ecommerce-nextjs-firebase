import { Metadata } from "next";
import Navigation from "../components/common/Navigation";
import firebaseServerInstance, {
  ProductSearchResult,
} from "../../firebase/firebaseServer";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sabiyya Collections | Shop",
};

export default async function Shop() {
  const res: ProductSearchResult = await firebaseServerInstance.getProducts(
    "",
    100
  );
  const productsUI = res.products.map((product) => {
    return (
      <div className="card" style={{ width: "12rem" }} key={product.id}>
        <Image
          src={product.image}
          className="card-img-top position-relative"
          alt={`${product.name} image`}
          fill
          style={{ objectFit: "contain", objectPosition: "center top" }}
        />
        <div className="card-body text-center">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <Link className="btn btn-primary" href={`/product/${product.id}`}>
            Buy Now
          </Link>
        </div>
      </div>
    );
  });
  return (
    <>
      <Navigation />
      <main>
        <div className="d-flex flex-md-wrap gap-3 m-5 justify-content-around">
          {productsUI}
        </div>
      </main>
    </>
  );
}
