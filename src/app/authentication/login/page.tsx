"use client";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
        router.push("/members");
        alert("login success");
      } else {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error instanceof Error ? error.message : "Unknown error");
      alert("login failed");
    } 
  };

  return (
    <div className="w-full grid place-items-center py-5">
      <div className="flex justify-start px-5 w-full">
        <button
          className="px-10 py-1 rounded-md bg-slate-500 hover:bg-gray-600 text-white"
          onClick={() => {
            router.push("/");
          }}
        >
          Back
        </button>
      </div>
      <div className="w-fit grid place-items-start border border-gray-300 rounded-md mt-20 shadow-sm gap-2 px-10 py-5">
        <div className="text-3xl text-black mb-2 text-center w-full">
          Sign-In
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
              router.push("/signup");
            }}
          >
            Sign-Up
          </button>
        </div>
      </div>
    </div>
  );
}
