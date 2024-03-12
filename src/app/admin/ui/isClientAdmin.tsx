"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import firebaseClientInstance from "../../../firebase/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { DocumentSnapshot } from "firebase/firestore";
import { useAppDispatch } from "../../../lib/hooks";
import { User, UserRole } from "../../entities/user";
import { setUser } from "../../../lib/slices/authSlice";

export default function IsClientAdmin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseClientInstance.auth,
      async (user) => {
        if (user) {
          firebaseClientInstance
            .getUser(user.uid)
            .then((snapshot: DocumentSnapshot) => {
              if (!snapshot.exists()) {
                signOut(firebaseClientInstance.auth);
              } else {
                const data = snapshot.data();
                const user = User.createFromDoc(snapshot.id, data);
                dispatch(setUser(user.toObject()));
                if (data.role !== UserRole.Admin) {
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
