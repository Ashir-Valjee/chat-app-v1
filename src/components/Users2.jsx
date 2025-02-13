"use client";
import { useState, useEffect } from "react";
import UserCard from "./UserCard";
import { onAuthStateChanged } from "firebase/auth";
import { firestore, app } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function Users2({ userData }) {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [users, setUsers] = useState([]);
  const [userChatRooms, setUserChatRooms] = useState([]);
  const [user, setUser] = useState(null);

  const auth = getAuth(app);
  const router = useRouter();

  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData2 = { id: userSnap.id, ...userSnap.data() };
        setUser(userData2);
      } else {
        setUser(null);
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);
  console.log("bla bla");
  console.log("user is", user);

  // get all users
  useEffect(() => {
    setLoading(true);
    const taskQuery = query(collection(firestore, "users"));

    const unsubscribe = onSnapshot(taskQuery, (querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(users);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      toast.success("logout succesful");
      router.push("/login");
    } catch (err) {
      toast.error(err.message);
    }
  }
  // get users chatrooms

  useEffect(() => {
    setLoading2(true);
    // if (!user?.id) {
    //   return;
    // }
    const chatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", "RBf57bzpYqS4490ShppWyYC67K13")
    );
    const unsubscribeChatrooms = onSnapshot(chatroomsQuery, (querySnapshot) => {
      const chatrooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserChatRooms(chatrooms);
      setLoading2(false);
    });
    return () => unsubscribeChatrooms();
  }, []);

  async function createChat(user) {
    // check if chatroom already exists
    const existingChatRoom = query(
      collection(firestore, "chatrooms"),
      where("users", "==", [user.id, userData.id])
    );
    try {
      const existingChatroomSnapshot = await getDocs(existingChatRoom);
      if (existingChatroomSnapshot.docs.length > 0) {
        toast.error("chatroom already exists");
        return;
      }
      // chatroom does not exist, create one!
      const usersData = {
        [userData.id]: userData,
        [user.id]: user,
      };
      const chatRoomData = {
        users: [user.id, userData.id],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
      };

      const chatroomRef = await addDoc(
        collection(firestore, "chatrooms"),
        chatRoomData
      );
      console.log("chatroom created with id", chatroomRef.id);
      setActiveTab("Chatrooms");
    } catch (err) {
      toast.error(err.message);
    }
  }

  console.log(users);
  console.log("user data is indeed", userData);

  //   console.log("bla bla");
  //   console.log("user is", user);

  return (
    <>
      <div className="shadow-lg h-screen overflow-auto mt-4 mb-20">
        <div className="flex justify-between p-4">
          <button
            onClick={() => handleTabClick("users")}
            className={`btn btn-outline ${
              activeTab === "users" ? "btn-primary" : ""
            }`}
          >
            Users
          </button>
          <button
            onClick={() => handleTabClick("Chatrooms")}
            className={`btn btn-outline ${
              activeTab === "Chatrooms" ? "btn-primary" : ""
            }`}
          >
            Chatrooms
          </button>
          {/* log out button */}
          <button onClick={handleLogout} className={`btn btn-outline `}>
            Log Out
          </button>
        </div>
        <div>
          {activeTab === "Chatrooms" && (
            <>
              <h1 className="px-4 text-base font-semibold">Chat Rooms</h1>
              {userChatRooms.map((chatroom) => (
                <div
                  onClick={() => {
                    createChat(chatroom);
                  }}
                  key={chatroom.id}
                >
                  <UserCard
                    name={
                      chatroom.usersData[
                        chatroom.users.find((id) => id !== userData?.id)
                      ].name
                    }
                    avatarUrl={
                      chatroom.usersData[
                        chatroom.users.find((id) => id !== userData?.id)
                      ].avatarUrl
                    }
                    latestMessageText={chatroom.lastMessage}
                    time="2h ago"
                    type={"chat"}
                  />
                </div>
              ))}
            </>
          )}
        </div>
        <div>
          {activeTab === "users" && (
            <>
              <h1 className="px-4 text-base font-semibold">Users</h1>
              {loading ? (
                <p>Loading...</p>
              ) : (
                users.map(
                  (user) =>
                    user.id !== userData.id && (
                      <div
                        onClick={() => {
                          createChat(user);
                        }}
                        key={user.id}
                      >
                        <UserCard
                          name={user.name}
                          avatarUrl={user.avatarUrl}
                          latestMessageText="hey, how are you?"
                          time="2h ago"
                          type={"users"}
                        />
                      </div>
                    )
                )
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
