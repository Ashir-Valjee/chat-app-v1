"use client";
import { useState } from "react";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/lib/firebase";

import EmojiPicker from "emoji-picker-react";

export default function MessageInput({
  sendMessage,
  message,
  setMessage,
  image,
  setImage,
}) {
  const storage = getStorage(app);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleUpload() {
    const storageRef = ref(storage, `chatroom_images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(downloadUrl);
          setUploadProgress(null);
          setImagePreview(null);
          document.getElementById("my_modal_3").close();
        } catch (error) {
          console.log(error);
        }
      }
    );
  }

  console.log("image is", image);
  function handleEmojiClick(event, emojiData) {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  }

  return (
    <>
      <div className="relative flex items-center p-4 border-t border-gray-200">
        {/* attach files */}
        <FaPaperclip
          onClick={() => {
            document.getElementById("my_modal_3").showModal();
          }}
          className={`${
            image ? "text-red-500" : "text-gray-500"
          }  mr-2 cursor-pointer`}
        />
        {/* emoji picker */}
        <button
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
          }}
        >
          &#128540;
        </button>

        {showEmojiPicker && (
          <div className="absolute right-0 bottom-full p-2">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              disableAutoFocus={true}
            />
          </div>
        )}

        {/* input */}
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 border-none p-2 outline-none"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />

        {/* send messages */}
        <FaPaperPlane
          onClick={() => {
            sendMessage();
          }}
          className="text-gray-500 ml-2 cursor-pointer"
        />

        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {imagePreview && (
                <img src={imagePreview} className="max-h-60 w-60 mb-4" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
              />
              <div
                onClick={() => {
                  handleUpload();
                }}
                className="btn btn-sm btn-primary"
              >
                Upload
              </div>
              {uploadProgress && (
                <progress value={uploadProgress} max="100"></progress>
              )}
            </form>
            <button
              onClick={() => document.getElementById("my_modal_3").close()}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              x
            </button>
          </div>
        </dialog>
      </div>
    </>
  );
}
