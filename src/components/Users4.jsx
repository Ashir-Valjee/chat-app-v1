"use client";
import { useState, useEffect } from "react";
import UserCard from "./UserCard";
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
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Users4({ userData, setSelectedChatroom }) {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(true);
  const [userUid, setUserUid] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [userData2, setUserData2] = useState(null);
  const [userData3, setUserData3] = useState(null);

  const [chatrooms, setChatrooms] = useState([]);
  const [error, setError] = useState(null);

  const auth = getAuth(app);
  const router = useRouter();

  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  //   get loggon on user UID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
        setUserData2(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  //   get logged on user data
  useEffect(() => {
    if (userUid) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/user?id=${userUid}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          setUserData2(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data");
        }
        setLoading(false);
      };

      fetchUserData();
    }
  }, [userUid]);

  //   get user data in right format
  useEffect(() => {
    if (userUid) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/userData?id=${userUid}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          setUserData3(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data");
        }
      };

      fetchUserData();
    }
  }, [userUid]);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading2(true);
      try {
        const response = await fetch("/api/users"); // Ensure the API route matches your setup
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
      }
      setLoading2(false);
    };

    fetchAllUsers();
  }, []);
  console.log("all the users are", allUsers);
  //   logout function
  async function handleLogout() {
    try {
      await signOut(auth);
      toast.success("logout succesful");
      router.push("/login");
    } catch (err) {
      toast.error(err.message);
    }
  }

  //   get all chatrooms
  useEffect(() => {
    if (userUid) {
      const fetchUserChatrooms = async () => {
        setLoading3(true);
        try {
          const response = await fetch(`/api/chatrooms?id=${userUid}`); //
          if (!response.ok) {
            throw new Error("Failed to fetch chatrooms");
          }
          const data = await response.json();
          setChatrooms(data);
        } catch (error) {
          console.error("Error fetching chatrooms:", error);
          setError("Failed to fetch chatrooms");
        }
        setLoading3(false);
      };

      fetchUserChatrooms();
    }
  }, [userUid]);
  console.log("chatrooms are", chatrooms);

  async function createChat(user) {
    // check if chatroom already exists
    const existingChatRoom = query(
      collection(firestore, "chatrooms"),
      where("users", "==", [user.id, userUid])
    );
    try {
      const existingChatroomSnapshot = await getDocs(existingChatRoom);
      if (existingChatroomSnapshot.docs.length > 0) {
        toast.error("chatroom already exists");
        return;
      }
      // chatroom does not exist, create one!
      const usersData = {
        [userUid]: userData2,
        [user.id]: user,
      };
      const chatRoomData = {
        users: [user.id, userUid],
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

  console.log(allUsers);
  console.log("user data is indeed", userData2);

  //   open chat handler
  function openChat(chatroom) {
    const data = {
      id: chatroom.id,
      myData: userData3,
      otherData:
        chatroom.usersData[chatroom.users.find((id) => id !== userUid)],
    };
    setSelectedChatroom(data);
  }

  console.log("omg omg omg", userData3);

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
        {/* render chatrooms */}
        <div>
          {activeTab === "Chatrooms" && (
            <>
              <h1 className="px-4 text-base font-semibold">Chat Rooms</h1>
              {chatrooms.map((chatroom) => (
                <div
                  onClick={() => {
                    openChat(chatroom);
                  }}
                  key={chatroom.id}
                >
                  <UserCard
                    name={
                      chatroom.usersData[
                        chatroom.users.find((id) => id !== userUid)
                      ].name
                    }
                    avatarUrl={
                      chatroom.usersData[
                        chatroom.users.find((id) => id !== userUid)
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
        {/* render users */}
        <div>
          {activeTab === "users" && (
            <>
              <h1 className="px-4 text-base font-semibold">Users</h1>
              {loading2 ? (
                <p>Loading...</p>
              ) : (
                allUsers.map(
                  (user) =>
                    user.id !== userUid && (
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
