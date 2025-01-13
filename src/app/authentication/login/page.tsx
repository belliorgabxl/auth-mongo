"use client";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {
    try {
      const res = await axios.post("/api/users/login", user);
      if (res.data.success == true) {
        toast.success("login success");
        router.push("/devices");
      } else {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error instanceof Error ? error.message : "Unknown error");
      alert("login failed");
    }
  };

  return (
    <div className="w-full grid place-items-center bg-gradient-to-r from-sky-100 via-white to-sky-100 py-5">
      <div className="relative my-10  w-full max-w-2xl flex justify-center items-center">
        <div className="absolute mix-blend-multiply filter blur-lg top-0 left-10 w-72 h-72 bg-sky-300 opacity-70 rounded-full animate-blob"></div>
        <div className="absolute mix-blend-multiply filter blur-lg top-0 right-10 w-72 h-72  bg-yellow-300 opacity-60 rounded-full  animate-blob animation-delay-2000"></div>
        <div className="absolute mix-blend-multiply filter blur-lg bottom-0 left-30 w-72 h-72 bg-pink-300 opacity-60 rounded-full  animate-blob animation-delay-4000"></div>
        <div className="w-fit grid z-10 place-items-start bg-white  rounded-md my-10 shadow-sm gap-5 px-10 py-5">
          <div className="text-3xl font-bold text-black mb-2 text-center w-full">
            Login
          </div>
          <div className="flex gap-4">
            <label className="w-[80px]" htmlFor="username">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="email"
              className="border px-4 py-1 border-gray-200 rounded-md bg-white text-gray-600 focus:outline-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <label className="w-[80px]" htmlFor="username">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="password"
              className="border px-4 py-1 border-gray-200 rounded-md bg-white text-gray-600 focus:outline-blue-500"
            />
          </div>
          <div className="flex gap-10 my-4">
            <button
              className="px-10 py-1 bg-blue-500 hover:bg-blue-300 text-white rounded-md"
              onClick={onLogin}
            >
              Login
            </button>
            <button
              className="px-10 py-1 hover:bg-gray-300 hover:text-white  text-blue-500 rounded-md"
              onClick={() => {
                router.push("/authentication/signup");
              }}
            >
              Sign-Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
