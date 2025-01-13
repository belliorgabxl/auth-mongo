"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Session } from "@/resource/model";
import Body from "./Body";
import { useRouter } from "next/navigation";
export default function page() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null);
  const getUserSession = async () => {
    try {
      const res = await axios.get<{ data: Session }>("/api/users/me");
      if (res.data.data){
       setSession(res.data.data); 
      }else{
        router.push("/")
      }
      
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  };
  useEffect(() => {
    getUserSession();
  }, []);

  return <div>{session && <Body session={session} />}</div>;
}
