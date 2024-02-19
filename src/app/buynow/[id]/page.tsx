"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import NavigationNew from "../../components/common/Navigation";
import { Product } from "../../entities/product";
import firebaseClientInstance from "../../../firebase/firebaseClient";
import { DocumentSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import "./buynowstyle.css";

interface ProductInfo {
  name: string;
  price: number;
}

interface ShippingDetails {
  mobile: string;
  email: string;
  fullName: string;
  address: string;
  city: string;
  deliveryFee: number;
}

type BuyNowPageParams = {
  id: string;
};

// List of cities in Pakistan
const citiesInPakistan = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  // Add more cities as needed
];

const BuyNowPage = ({ params }: { params: BuyNowPageParams }) => {
  const productId = params.id;
  const router = useRouter();

  // Product information (Replace with actual product data)
  const productInfo: ProductInfo = {
    name: "Design # 01 Unstitched Lawn 3 Piece",
    price: 3500,
  };

  // Shipping details state
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    mobile: "",
    email: "",
    fullName: "",
    address: "",
    city: "Lahore",
    deliveryFee: 200, // Set a default delivery fee
  });

  const [product, setProduct] = useState<Product | null>(null);

  // Total calculation function
  const calculateTotal = (): string => {
    const total = productInfo.price + shippingDetails.deliveryFee;
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "PKR",
    });
  };

  // Update delivery fee when city changes
  useEffect(() => {
    const newDeliveryFee = shippingDetails.city === "Lahore" ? 200 : 300;
    setShippingDetails((prev) => ({ ...prev, deliveryFee: newDeliveryFee }));
  }, [shippingDetails.city]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Implement your buy now logic here
    console.log("Form submitted:", shippingDetails);
  };

  useEffect(() => {
    firebaseClientInstance
      .getSingleProduct(productId)
      .then((snapshot: DocumentSnapshot) => {
        if (!snapshot.exists()) {
          router.push("/404");
        }
        setProduct(Product.createFromDoc(snapshot.id, snapshot.data()));
      });
  }, []);

  return (
    <>
      <NavigationNew />
      <main>
        <div className="container my-5">
          <h1>Buy Now</h1>
          <div className="row">
            <div className="col-md-6">
              {product && (
                <div className="product-info">
                  <h2>{product.name}</h2>
                  <Image
                    src={product.image} // Replace with the actual path to your image
                    alt={product.name}
                    width={90}
                    height={90}
                  />
                  <p>
                    Price:{" "}
                    {product.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                    })}
                  </p>
                  <p>
                    Delivery Fee:{" "}
                    {shippingDetails.deliveryFee.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                    })}
                  </p>
                  <p>Total: {calculateTotal()}</p>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="mobile">Enter your mobile</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="mobile"
                    placeholder="Enter your mobile"
                    value={shippingDetails.mobile}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        mobile: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email address"
                    value={shippingDetails.email}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    placeholder="Enter your full name"
                    value={shippingDetails.fullName}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address">Your Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="Enter your full address"
                    value={shippingDetails.address}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="city">City</label>
                  <select
                    className="form-select"
                    id="city"
                    value={shippingDetails.city}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        city: e.target.value,
                      })
                    }
                  >
                    {citiesInPakistan.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Payment Option:</label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="cashOnDelivery"
                      disabled
                      defaultChecked
                    />
                    <label
                      className="form-check-label"
                      htmlFor="cashOnDelivery"
                    >
                      Cash on Delivery
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Buy Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BuyNowPage;
