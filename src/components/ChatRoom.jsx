import MessageCard from "./MessageCard";
import MessageInput from "./Messageinput";

export default function ChatRoom({ user }) {
  const messages = [
    {
      id: 1,
      sender: "katy perry",
      avatarUrl:
        "https://pbs.twimg.com/profile_images/1354479643882004483/Btnfm47p_400x400.jpg",
      content: "Hey, how are you?",
      time: "2h ago",
    },
    {
      id: 2,
      sender: "douglas",
      avatarUrl:
        "https://pbs.twimg.com/profile_images/1354479643882004483/Btnfm47p_400x400.jpg",
      content: "Hey, how are you?",
      time: "2h ago",
    },
  ];
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-10">
          {/* message cards */}
          {messages?.map((message) => (
            <MessageCard key={message.id} message={message} user={"douglas"} />
          ))}
        </div>
        {/* message input */}
        <MessageInput />
      </div>
    </>
  );
}
