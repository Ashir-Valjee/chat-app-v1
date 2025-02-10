"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AvatarGenerator } from "random-avatar-generator";
import Image from "next/image";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState();
  const router = useRouter();

  function generateRandomAvatar() {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar();
  }

  function handleRefreshAvatar() {
    setAvatarUrl(generateRandomAvatar());
  }

  useEffect(() => {
    setAvatarUrl(generateRandomAvatar());
  }, []);
  // console.log(generateRandomAvatar());

  function validateForm() {
    // const emailRegex
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (password.length < 6) {
      newErrors.password = "password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "confirm password does not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {
        name,
        email,
        avatarUrl,
      });
      router.push("/");
      setErrors({});
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h1>register</h1>
      <div className="flex justify-center items-center h-screen p-10 m-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl shadow-lg p-10"
        >
          <h1 className="text-xl text-center font-semibold text-[#0b3a65ff]">
            Chat<span className="font-bold text-[#eeab63ff]">2</span>Chat
          </h1>

          {/* dispay avatar */}
          <div className="flex items-center space-y-2 justify-between border border-gray-200 p-2">
            <Image
              src={avatarUrl}
              className="rounded-full h-20 w-20"
              height={20}
              width={20}
              alt="avatar"
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleRefreshAvatar}
            >
              New Avatar
            </button>
          </div>
          {/* name */}
          <div>
            <label className="label">
              <span className="text-base label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="enter your name"
              className="w-full input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <span className="text-sm text-red-500">{errors.name}</span>
            )}
          </div>
          {/* email */}
          <div>
            <label className="label">
              <span className="text-base label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="enter your email"
              className="w-full input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>
          {/* password */}
          <div>
            <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="enter your password"
              className="w-full input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password}</span>
            )}
          </div>
          {/* confirm password */}
          <div>
            <label className="label">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="enter your password"
              className="w-full input input-bordered"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword}
              </span>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-block bg-[#0b3a65ff] text-white"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Register"
              )}
            </button>
          </div>
          <span>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Login
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}
