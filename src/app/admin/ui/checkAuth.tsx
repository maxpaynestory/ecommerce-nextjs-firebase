"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import firebaseClientInstance from "../../../firebase/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { DocumentSnapshot } from "firebase/firestore";

export default function CheckAuth() {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseClientInstance.auth,
      async (user) => {
        if (user) {
          console.log("User uid", user.uid);
          firebaseClientInstance
            .getUser(user.uid)
            .then((snapshot: DocumentSnapshot) => {
              if (!snapshot.exists()) {
                signOut(firebaseClientInstance.auth);
              } else {
                const data = snapshot.data();
                if (data.role !== "ADMIN") {
                  signOut(firebaseClientInstance.auth);
                }
              }
            });
        } else {
          router.push("/signin");
        }
      }
    );
    return unsubscribe;
  });
  return <></>;
}
