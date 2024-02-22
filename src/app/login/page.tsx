import { Metadata } from "next";
import Navigation from "../components/common/Navigation";

export const metadata: Metadata = {
  title: "Sabiyya Collections | Featured Products",
};

export default function LoginPage() {
  return (
    <>
      <Navigation />
      <main>
        <h1>Login Page</h1>
      </main>
    </>
  );
}
