"use client";
import { useState, useEffect } from "react";
import { app, firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Users from "@/components/unused/Users";
import Users2 from "@/components/unused/Users2";
import Users3 from "@/components/unused/Users3";
import Users4 from "@/components/Users4";
import ChatRoom from "@/components/ChatRoom";
import Header from "@/components/Header";
export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [selectedChatroom, setSelectedChatroom] = useState();
  const [showUsers, setShowUsers] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = { id: userSnap.id, ...userSnap.data() };
        setUser(userData);
      } else {
        setUser(null);
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);
  console.log("user is", user);

  const toggleUsers4Visibility = () => {
    setShowUsers(!showUsers);
  };
  return (
    <>
      <div className="  flex h-screen flex-grow  ">
        {/* left */}

        <div className="flex-shrink-0 w-3/12">
          <Users4 userData={user} setSelectedChatroom={setSelectedChatroom} />
        </div>
        {/* right */}
        <div className="flex-grow w-3/12">
          <ChatRoom user={user} selectedChatroom={selectedChatroom} />
        </div>
      </div>
    </>
  );
}
