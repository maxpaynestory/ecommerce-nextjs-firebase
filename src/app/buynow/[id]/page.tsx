"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import NavigationNew from "../../components/common/Navigation";
import { Product } from "../../entities/product";
import firebaseClientInstance from "../../../firebase/firebaseClient";
import { DocumentSnapshot, or } from "firebase/firestore";
import { useRouter } from "next/navigation";
import "./buynowstyle.css";
import { displayMoneyInPKR } from "../../helpers/utils";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { GuestUserInfo, Order } from "../../entities/order";
import { RecaptchaVerifier } from "firebase/auth";
import { Modal, Button, Form } from "react-bootstrap";

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

interface FormValues extends ShippingDetails {}

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

const vSchema = yup.object().shape({
  mobile: yup
    .string()
    .required("Mobile number is required. example 031001234567")
    .length(11, "Mobile number is required. example 031001234567")
    .matches(/^(\d)+$/, "Mobile number is required. example 031001234567"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  fullName: yup
    .string()
    .required("Full name is required.")
    .min(2, "Full name must be at least 2 characters long.")
    .max(60, "Full name must only be less than 60 characters."),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
});

const BuyNowPage = ({ params }: { params: BuyNowPageParams }) => {
  const productId = params.id;
  const router = useRouter();
  const [filledForm, setFilledForm] = useState<Order | null>(null);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // @ts-ignore
  } = useForm({ resolver: yupResolver(vSchema) });
  const onSubmit = (data: any) => {
    if (product) {
      const newDate = new Date();
      let numberPart = window.performance.now().toString().replace(".", "");
      numberPart = numberPart.substring(
        numberPart.length - 5,
        numberPart.length
      );
      const orderNumber = `${moment(newDate).format(
        "YYYY-MM-DD"
      )}-${numberPart}`;
      const guestUserInfo = new GuestUserInfo();
      guestUserInfo.mobile = data.mobile;
      guestUserInfo.email = data.email;
      guestUserInfo.city = { value: data.city, label: data.city };
      guestUserInfo.address = data.address;
      guestUserInfo.fullName = data.fullName;
      guestUserInfo.isDone = true;
      guestUserInfo.isInternational = false;
      guestUserInfo.type = "cod";
      const order = new Order();
      order.orderNumber = orderNumber;
      order.product = product;
      order.total = calculateTotal();
      order.shippingCost = shippingDetails.deliveryFee;
      order.createdAt = newDate;
      order.guestUserInfo = guestUserInfo;
      setFilledForm(order);
      onCaptchVerify();
      const intlPhoneNumber = "+92" + data.mobile.slice(1);
      firebaseClientInstance
        // @ts-ignore
        .signInWithPhoneNumber(intlPhoneNumber, window.recaptchaVerifier)
        .then((res: any) => {
          setConfirmationResult(res);
          setShowOTPForm(true);
        })
        .catch((error: any) => {
          console.log("Error firebaseInstance.signInWithPhoneNumber ", error);
        });
    }
  };

  const onCaptchVerify = useCallback(() => {
    // @ts-ignore
    if (!window.recaptchaVerifier) {
      // @ts-ignore
      window.recaptchaVerifier = new RecaptchaVerifier(
        firebaseClientInstance.auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, []);

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
  const calculateTotal = (): number => {
    let total = 0;
    if (product) {
      total = product.price + shippingDetails.deliveryFee;
    }
    return total;
  };

  // Update delivery fee when city changes
  useEffect(() => {
    const newDeliveryFee = shippingDetails.city === "Lahore" ? 200 : 300;
    setShippingDetails((prev) => ({ ...prev, deliveryFee: newDeliveryFee }));
  }, [shippingDetails.city]);

  useEffect(() => {
    firebaseClientInstance
      .getSingleProduct(productId)
      .then((snapshot: DocumentSnapshot) => {
        if (!snapshot.exists()) {
          router.push("/404");
        }
        setProduct(Product.createFromDoc(snapshot.id, snapshot.data()));
      });
  }, [productId, router]);

  const VerifyOTP = () => {
    if (confirmationResult && filledForm && otp.length > 2) {
      confirmationResult
        // @ts-ignore
        .confirm(otp)
        .then(async (res: any) => {
          firebaseClientInstance.buynowProduct(filledForm).then((res1) => {
            setShowOTPForm(false);
            router.push(`/order/${res1.orderNumber}`);
          });
        })
        .catch((err: any) => {
          console.log("confirmationResult err", err);
        });
    }
  };

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
                  <p>Price: {displayMoneyInPKR(product.price)}</p>
                  <p>
                    Delivery Fee:{" "}
                    {displayMoneyInPKR(shippingDetails.deliveryFee)}
                  </p>
                  <p>Total: {displayMoneyInPKR(calculateTotal())}</p>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                {errors && Object.keys(errors).length > 0 && (
                  <div className="alert alert-danger" role="alert">
                    <p>Please fix the following errors:</p>
                    <ul>
                      {Object.values(errors).map((error: any, index) => (
                        <li key={index}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="mobile">Enter your mobile</label>
                  <input
                    type="tel"
                    className="form-control"
                    {...register("mobile")}
                    placeholder="Enter your mobile"
                    value={shippingDetails.mobile}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        mobile: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    {...register("email")}
                    placeholder="Enter your email address"
                    value={shippingDetails.email}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("fullName")}
                    placeholder="Enter your full name"
                    value={shippingDetails.fullName}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address">Your Address</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("address")}
                    placeholder="Enter your full address"
                    value={shippingDetails.address}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="city">City</label>
                  <select
                    className="form-select"
                    {...register("city")}
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
        <div id="recaptcha-container"></div>
        <Modal
          show={showOTPForm}
          onHide={() => console.log("Close Modal Dude")}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Verify your Mobile number.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Label>Enter OTP from SMS</Form.Label>
              <Form.Control
                type="number"
                placeholder=""
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={VerifyOTP}>
              Verify
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

export default BuyNowPage;
