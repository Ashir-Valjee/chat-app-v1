import { useState } from "react";
import UserCard from "./UserCard";
import ChatRoom from "./ChatRoom";

export default function Users({ user }) {
  const [activeTab, setActiveTab] = useState("users");
  function handleTabClick(tab) {
    setActiveTab(tab);
  }
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
        </div>
        <div>
          {activeTab === "Chatrooms" && (
            <>
              <h1 className="px-4 text-base font-semibold">ChatRooms</h1>
              <UserCard
                name="katy perry"
                avatarUrl="https://pbs.twimg.com/profile_images/1354479643882004483/Btnfm47p_400x400.jpg"
                latestMessageText="hey, how are you?"
                time="2h ago"
                type={"chat"}
              />

              <UserCard
                name="katy perry"
                avatarUrl="https://pbs.twimg.com/profile_images/1354479643882004483/Btnfm47p_400x400.jpg"
                latestMessageText="hey, how are you?"
                time="2h ago"
                type={"chat"}
              />
            </>
          )}
        </div>
        <div>
          {activeTab === "users" && (
            <>
              <h1 className="px-4 text-base font-semibold">Users</h1>
              <UserCard
                name="katy perry"
                avatarUrl="https://pbs.twimg.com/profile_images/1354479643882004483/Btnfm47p_400x400.jpg"
                latestMessageText="hey, how are you?"
                time="2h ago"
                type={"users"}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
