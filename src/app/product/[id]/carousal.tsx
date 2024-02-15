"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Product } from "../../entities/product";

type CarousalProps = {
  product: Product;
};

export default function ProductDetailCarousal(props: CarousalProps) {
  const product = props.product;
  return (
    <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={400}
            className="d-block w-100"
            style={{
              objectFit: "contain",
              objectPosition: "center top",
            }}
          />
        </div>
        {product.imageCollection?.map((imageItem: any) => (
          <div className="carousel-item" key={imageItem.id}>
            <Image
              src={imageItem.url}
              alt={`${product.name} - ${imageItem.id}`}
              width={600}
              height={400}
              className="d-block w-100"
              style={{
                objectFit: "contain",
                objectPosition: "center top",
              }}
            />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#myCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#myCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
