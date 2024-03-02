import { Metadata } from "next";
import Navigation from "../components/common/navigation";
import SigninForm from "./signinForm";

export const metadata: Metadata = {
  title: "Sabiyya Collections | Login",
};

export default function SigninPage() {
  return (
    <>
      <Navigation />
      <main className="form-signin w-100 m-auto">
        <SigninForm />
      </main>
    </>
  );
}
