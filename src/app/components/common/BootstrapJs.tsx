"use client";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
export default function BootstrapJs() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    require("bootstrap");
    setMounted(true);
    console.log("Client side js scripts added");
  }, []);
  return <>{mounted && <ToastContainer />}</>;
}
