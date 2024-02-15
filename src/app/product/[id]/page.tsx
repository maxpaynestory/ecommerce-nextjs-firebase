import Navigation from "../../components/common/Navigation";
import Link from "next/link";
import firebaseServerInstance from "../../../firebase/firebaseServer";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Container, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import ProductDetailCarousal from "./carousal";

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
  return (
    <>
      <Navigation />
      <main>
        <Container className="my-5">
          <Row>
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
          </Row>
          <Row>
            <Col md={6}>
              <ProductDetailCarousal product={product} />
            </Col>
            <Col md={6}>
              <h2>{product.brand}</h2>
              <h1>{product.name}</h1>
              <p>{product.description}</p>
              <p>Available Colors: {product.availableColors.join(", ")}</p>
              <h3>PKR {product.price}</h3>
              <Button variant="primary">Buy Now</Button>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}
