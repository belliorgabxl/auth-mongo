"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import NavLink from "./NavLink";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="w-full top-0 left-0   fixed bg-gradient-to-l from-blue-600 to-gray-900 shadow-sm shadow-gray-900 px-5">
      <div className="grid grid-cols-[20%_50%_30%] text-white">
        <Link href={"/"} className="flex gap-3 items-center pl-10 py-1">
          <img
            src="/assets/iconweb_white.png"
            className=""
            width={50}
            height={45}
            alt="icon"
          />
          <div className="font-extrabold text-5xl">IoT</div>
        </Link>
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
        <div className="flex justify-end items-center gap-2">
          <button
            className="px-10 rounded-md py-1 border hover:bg-white hover:text-blue-800 duration-300 border-white"
            onClick={() => {
              router.push("/authentication/login");
            }}
          >
            Login
          </button>
          <button
            className="px-10 rounded-md duration-300 py-1 hover:text-blue-800 hover:bg-white"
            onClick={() => {
              router.push("/authentication/signup");
            }}
          >
            Sign-Up
          </button>
        </div>
      </div>
    </div>
  );
}
