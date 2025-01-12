"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import NavLink from "./NavLink";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="w-full top-0 left-0   fixed bg-gradient-to-l from-blue-600 to-gray-900 shadow-sm shadow-gray-900 px-5">
      <div className="grid grid-cols-[20%_50%_30%] text-white">
        <div className="flex gap-1 items-center pl-10 py-1">
          <img
            src="/assets/iconweb_white.png"
            className=""
            width={50}
            height={45}
            alt="icon"
          />
          <div className="font-extrabold text-5xl">IoT</div>
        </div>
        <div className="flex justify-center items-center">
          <NavLink
            href="/documents"
            label="Document"
            isActive={pathname === "/documents"}
          />
          <NavLink
            href="/production"
            label="Products"
            isActive={pathname === "/production"}
          />
          <NavLink
            href="/devices"
            label="Device"
            isActive={pathname === "/devices"}
          />
          <NavLink
            href="/dashboard"
            label="Dashboard"
            isActive={pathname === "/dashboard"}
          />
          <NavLink
            href="/aboutus"
            label="About Us"
            isActive={pathname === "/aboutus"}
          />
        </div>
        <div className="flex justify-end items-center gap-5">
          <button
            className="px-5 rounded-md py-1 border border-white"
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </button>
          <button
            className="px-5 rounded-md py-1 "
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
