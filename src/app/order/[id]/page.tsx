import NavigationNew from "../../components/common/Navigation";
import firebaseServerInstance from "../../../firebase/firebaseServer";
import { redirect } from "next/navigation";
import styles from "./orderPage.module.css";
import { displayMoneyInPKR } from "../../helpers/utils";

type OrderPageParams = {
  id: string;
};

const OrderPage = async ({ params }: { params: OrderPageParams }) => {
  const orderNumber = params.id;
  const order = await firebaseServerInstance.getOrder(orderNumber);
  if (!order) {
    redirect("/404");
  }
  const fullName = order.guestUserInfo.fullName;
  const guestUserInfo = order.guestUserInfo;
  const shippingCost = order.shippingCost;
  const total = order.total;
  return (
    <>
      <NavigationNew />
      <main>
        <div className={styles.container}>
          <div className={styles.thankYou}>
            <h1>Thank You for Your Order!</h1>
            <p>Hi {fullName},</p>
            <p>
              Your order #{orderNumber} has been placed successfully, and we
              will contact you on your phone for order confirmation.
            </p>

            <div className={styles.deliveryDetails}>
              <h2>Delivery Details</h2>
              <p>Full Name: {fullName}</p>
              <p>Address: {guestUserInfo.address}</p>
              <p>Phone: {guestUserInfo.mobile}</p>
              <p>Email: {guestUserInfo.email}</p>
              <p>Delivery Fee: {displayMoneyInPKR(shippingCost)}</p>
              <p>Order Total: {displayMoneyInPKR(total)}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default OrderPage;
