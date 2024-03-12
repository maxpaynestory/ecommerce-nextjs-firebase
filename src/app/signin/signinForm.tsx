"use client";

import firebaseClientInstance from "../../firebase/firebaseClient";
import { useAppDispatch } from "../../lib/hooks";
import { loginUser } from "../../lib/slices/authSlice";
import { UserRole } from "../entities/user";
import { useRouter } from "next/navigation";

export default function SigninForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const elements: any = e.currentTarget.elements;
    const email = elements.floatingInput.value;
    const password = elements.floatingPassword.value;
    dispatch(loginUser({ email: email, password: password }))
      .then((action) => action.payload)
      .then((uid) => firebaseClientInstance.getUserbyRole(uid, UserRole.Admin))
      .then((users) => {
        if (!users.empty) {
          router.push("/admin");
        }
      });
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Please sign in</h1>

      <div className="form-floating">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          autoComplete="off"
          required
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          required
          autoComplete="off"
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <button className="btn btn-primary w-100 py-2" type="submit">
        Sign in
      </button>
    </form>
  );
}
