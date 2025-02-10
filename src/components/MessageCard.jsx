import Image from "next/image";
export default function MessageCard({ message, user }) {
  const isMessageFromMe = message.sender === user;
  return (
    <>
      <div
        key={message.key}
        className={`flex mb-4 items-center  ${
          isMessageFromMe ? "justify-end" : "justify-start"
        }`}
      >
        {/* avatar on th eleft */}

        <div className={`w-10 h-10 ${isMessageFromMe ? "ml-2 mr-2" : "mr-2"}`}>
          <Image
            src={message.avatarUrl}
            alt="avatar"
            width={10}
            height={10}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        {/* message bubble */}
        <div
          className={`text-white p-2 rounded-md ${
            isMessageFromMe ? "bg-blue-500 self-end" : "bg-[#19D39E] self-start"
          }`}
        >
          <p>{message.content}</p>
          <div className="text-xs text-gray-300">{message.time}</div>
        </div>
      </div>
    </>
  );
}
