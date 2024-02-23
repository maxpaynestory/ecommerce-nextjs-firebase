"use client";

import { useAppDispatch } from "../../lib/hooks";
import { loginUser } from "../../lib/slices/authSlice";

export default function SigninForm() {
  const dispatch = useAppDispatch();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const elements: any = e.currentTarget.elements;
    const email = elements.floatingInput.value;
    const password = elements.floatingPassword.value;
    dispatch(loginUser({ email: email, password: password }));
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
