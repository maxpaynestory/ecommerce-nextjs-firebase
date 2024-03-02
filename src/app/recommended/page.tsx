import { Metadata } from "next";
import Navigation from "../components/common/navigation";

export const metadata: Metadata = {
  title: "Sabiyya Collections | Recommended Products",
};

export default function RecommendedProducts() {
  return (
    <>
      <Navigation />
      <main>
        <h1>Recommended product</h1>
      </main>
    </>
  );
}
