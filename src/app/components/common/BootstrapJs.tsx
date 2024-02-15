"use client";
import { useEffect } from "react";
export default function BootstrapJs() {
  useEffect(() => {
    require("bootstrap");
    console.log("Client side js scripts added");
  }, []);
  return <></>;
}
