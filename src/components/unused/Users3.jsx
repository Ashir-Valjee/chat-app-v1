"use client";
import { useState, useEffect } from "react";
import { app, firestore } from "@/lib/firebase"; // Ensure the path to your Firebase config is correct
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import UserCard from "../UserCard";

export default function Users3() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const [userUid, setUserUid] = useState(null);
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [error, setError] = useState(null);

  //   get loggon on user UID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  //   console.log("User UID:", userUid);
  //   console.log("Current Auth State:", auth.currentUser);

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
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data");
        }
        setLoading(false);
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

  //   console.log("all users", allUsers);

  //   get all chatrooms
  useEffect(() => {
    if (userUid) {
      const fetchUserChatrooms = async () => {
        setLoading3(true);
        try {
          const response = await fetch(`/api/chatrooms?id=${userUid}`); // Ensure the API route matches your setup
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

  return (
    <>
      <h1>hello3</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {userData && (
        <div>
          <h1>User Information</h1>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          {/* Render other user data as needed */}
        </div>
      )}
      {!loading && !userUid && <p>No user data found</p>}
      {/* get all users */}
      {loading2 && <p>Loading...</p>}
      {allUsers && (
        <>
          {allUsers.map((user) =>
            user.id !== userUid ? (
              <div key={user.id}>
                <UserCard
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  latestMessageText="hey, how are you?"
                  time="2h ago"
                  type={"users"}
                />
              </div>
            ) : null
          )}
        </>
      )}

      {/* get chatrooms */}
      <h1>User Chatrooms</h1>
      {loading3 && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {chatrooms.length > 0 && (
        <ul>
          {chatrooms.map((chatroom) => (
            <li key={chatroom.id}>
              <h2>Chatroom: {chatroom.id}</h2>
              <ul>
                {Object.entries(chatroom.usersData)
                  .filter(([id, user]) => id !== userUid)
                  .map(([id, user]) => (
                    <div key={id}>
                      <UserCard
                        name={user.name}
                        avatarUrl={user.avatarUrl}
                        latestMessageText="hey, how are you?"
                        time="2h ago"
                        type={"users"}
                      />
                    </div>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      {!loading3 && chatrooms.length === 0 && <p>No chatrooms found</p>}
    </>
  );
}
