"use client";
import MessageCard from "./MessageCard";
import MessageInput from "./Messageinput";
import MessageInput2 from "./Messageinput2";
import { useState, useEffect, useRef } from "react";
import { firestore } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";

export default function ChatRoom({ user, selectedChatroom }) {
  const me = selectedChatroom?.myData;
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom?.id;

  const [message, setMessage] = useState("");
  const [messages, setmessages] = useState([]);
  const [image, setImage] = useState(null);
  const messagesContainerRef = useRef(null);

  // retrieve messages
  useEffect(() => {
    if (!chatRoomId) {
      return;
    }
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "messages"),
        where("chatRoomId", "==", chatRoomId),
        orderBy("time", "asc")
      ),
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setmessages(messagesData);
      }
    );
    return unsubscribe;
  }, [chatRoomId]);
  console.log("the messages are", messages);
  // console.log("me id issssss", me.id);

  console.log("from chatroom", selectedChatroom);
  // const messages = [
  //   {
  //     id: 1,
  //     sender: "katy perry",
  //     avatarUrl:
  //       "https://pbs.twimg.com/profile_images/1354479643882004483/Btnfm47p_400x400.jpg",
  //     content: "Hey, how are you?",
  //     time: "2h ago",
  //   },
  //   {
  //     id: 2,
  //     sender: "douglas",
  //     avatarUrl:
  //       "https://pbs.twimg.com/profile_images/1354479643882004483/Btnfm47p_400x400.jpg",
  //     content: "Hey, how are you?",
  //     time: "2h ago",
  //   },
  // ];

  // send message handler

  async function sendMessage(e) {
    const messageCollection = collection(firestore, "messages");
    if (message.trim() === "" && !image) {
      return;
    }
    try {
      const messageData = {
        chatRoomId,
        senderId: me.id,
        content: message,
        time: serverTimestamp(),
        image: image,
        messageType: "text",
      };
      await addDoc(messageCollection, messageData);
      setMessage("");
      setImage(null);

      // update chatroom last message
      const chatroomRef = doc(firestore, "chatrooms", chatRoomId);
      await updateDoc(chatroomRef, {
        lastMessage: message ? message : "Image",
      });
    } catch (err) {
      console.log(err);
    }
  }

  console.log(serverTimestamp());
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-10">
          {/* message cards */}
          {messages?.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              me={me}
              other={other}
            />
          ))}
        </div>
        {/* message input */}
        <MessageInput
          sendMessage={sendMessage}
          messae={message}
          setMessage={setMessage}
          image={image}
          setImage={setImage}
        />
      </div>
    </>
  );
}
