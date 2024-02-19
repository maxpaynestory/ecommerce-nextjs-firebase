import Navigation from "../../components/common/Navigation";
import Link from "next/link";
import firebaseServerInstance from "../../../firebase/firebaseServer";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Container, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import ProductDetailCarousal from "./carousal";
import { displayMoneyInPKR } from "../../helpers/utils";
import ColorChooser from "../../components/common/ColorChooser";
import { BuyNowButton } from "./BuyNowButton";

type ProductParams = {
  id: string;
};

export async function generateMetadata({
  params,
}: {
  params: ProductParams;
}): Promise<Metadata> {
  const productId = params.id;
  let title = "Sabiyya Collections | ";
  const product = await firebaseServerInstance.getSingleProduct(productId);
  if (product) {
    title += product.name;
  }
  return {
    title: title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: ProductParams;
}) {
  const productId = params.id;
  const product = await firebaseServerInstance.getSingleProduct(productId);
  if (!product) {
    redirect("/404");
  }
  const productSizes =
    product?.sizes
      .sort((a, b) => (a < b ? -1 : 1))
      .map((size) => ({ label: `${size} meter`, value: size })) || [];
  return (
    <>
      <Navigation />
      <main>
        <Container className="my-5">
          <Row>
            <nav aria-label="breadcrumb">
              <Col md={12}>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/shop">Shop</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {product.name}
                  </li>
                </ol>
              </Col>
            </nav>
          </Row>
          <Row>
            <Col md={6}>
              <ProductDetailCarousal product={product} />
            </Col>
            <Col md={6}>
              <h2>{product.brand}</h2>
              <h1>{product.name}</h1>
              <p>{product.description}</p>
              <p>Total size: {productSizes[0].label}</p>
              <div>
                Color:{" "}
                <ColorChooser availableColors={product.availableColors} />
              </div>
              <h3>{displayMoneyInPKR(product.price)}</h3>
              <BuyNowButton product={product} />
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}
