import Link from "next/link";
import { Metadata } from "next";
import firebaseServerInstance from "../firebase/firebaseServer";
import { Product } from "./entities/product";
import ScImage from "./components/common/scImage";
import NavigationNew from "./components/common/navigation";
import bannerGirl from "../../public/images/banner-girl.png";

export const metadata: Metadata = {
  title: "Sabiyya Collections | Home",
};

export default async function Home() {
  const snapshot = await firebaseServerInstance.getFeaturedProducts(3);
  const featuredProducts = snapshot.docs.map((doc) => {
    const product = Product.createFromDoc(doc.id, doc.data());
    return (
      <div className="card p-2" key={product.id}>
        <ScImage
          src={product.image}
          alt={`${product.name} image`}
          width={250}
          height={250}
        />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <Link className="btn btn-primary" href={`/product/${product.id}`}>
            View
          </Link>
        </div>
      </div>
    );
  });

  const snapshot1 = await firebaseServerInstance.getRecommendedProducts(3);
  const recommendedProducts = snapshot1.docs.map((doc) => {
    const product = Product.createFromDoc(doc.id, doc.data());
    return (
      <div className="card p-2" key={product.id}>
        <ScImage
          src={product.image}
          alt={`${product.name} image`}
          width={250}
          height={250}
        />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <Link className="btn btn-primary" href={`/product/${product.id}`}>
            View
          </Link>
        </div>
      </div>
    );
  });
  return (
    <>
      <NavigationNew />
      <div className="f-flex flex-row">
        <div className="d-flex position-relative justify-content-center">
          <ScImage
            src={bannerGirl}
            alt="Main Banner"
            height={300}
            width={400}
          />
        </div>
        <div className="d-flex flex-row justify-content-around">
          <h2>Featured Products</h2>
          <Link href="/featured">See All</Link>
        </div>
        <div className="d-flex flex-row justify-content-center grid gap-5">
          {featuredProducts}
        </div>
        <div className="d-flex flex-row justify-content-around">
          <h2>Recommended Products</h2>
          <Link href="/recommended">See All</Link>
        </div>
        <div className="d-flex flex-row justify-content-center grid gap-5">
          {recommendedProducts}
        </div>
      </div>
    </>
  );
}
