import moment from "moment";
import Image from "next/image";

export default function MessageCard({ message, me, other }) {
  const isMessageFromMe = message.senderId === me.id;

  function timeAgo(time) {
    const date = time?.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  }
  console.log("message image is", message);
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
          {!isMessageFromMe && (
            <Image
              src={other.avatarUrl}
              alt="avatar"
              width={10}
              height={10}
              className="w-full h-full rounded-full object-cover"
            />
          )}
          {isMessageFromMe && (
            <Image
              src={me.avatarUrl}
              alt="avatar"
              width={10}
              height={10}
              className="w-full h-full rounded-full object-cover"
            />
          )}
        </div>
        {/* message bubble */}
        <div
          className={`text-white p-2 rounded-md ${
            isMessageFromMe ? "bg-blue-500 self-end" : "bg-[#19D39E] self-start"
          }`}
        >
          {message.image && (
            <img
              className="w-60 h-40  rounded-md"
              src={message.image}
              alt="message"
            />
          )}
          <p>{message.content}</p>
          <div className="text-xs text-gray-300">{timeAgo(message.time)}</div>
        </div>
      </div>
    </>
  );
}
