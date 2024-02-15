import { Metadata } from "next";
import Navigation from "../components/common/Navigation";

export const metadata: Metadata = {
  title: "Sabiyya Collections | Featured Products",
};

export default function Featured() {
  return (
    <>
      <Navigation />
      <main>
        <h1>Featured product</h1>
      </main>
    </>
  );
}
