"use client";
import { useState, useEffect } from "react";
import { app, firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Users from "@/components/Users";
import ChatRoom from "@/components/ChatRoom";
export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setUser(userData);
      } else {
        setUser(null);
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);
  console.log(user);
  return (
    <>
      <div className="flex h-screen">
        {/* left */}
        <div className="flex-shrink-0 w-3/12">
          <Users user={user} />
        </div>
        {/* right */}
        <div className="flex-grow w-3/12">
          <ChatRoom user={user} />
        </div>
      </div>
    </>
  );
}
