"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function validateForm() {
    // const emailRegex
    const newErrors = {};

    if (password.length < 6) {
      newErrors.password = "password must be at least 6 characters";
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        router.push("/");
      }

      setErrors({});
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen p-10 m-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-2xl shadow-lg p-10 bg-blue-100 text-black"
        >
          <h1 className="text-xl text-center font-semibold text-[#0b3a65ff]">
            Chat App
          </h1>

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

          <div>
            <button
              type="submit"
              className="btn btn-block bg-[#0b3a65ff] text-white"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
          <span className="text-black">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Register
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}
