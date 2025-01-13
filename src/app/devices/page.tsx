"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Session } from "@/resource/model";
import Body from "./Body";

export default function page() {
  const [session, setSession] = useState<Session | null>(null);
  const getUserSession = async () => {
    try {
      const res = await axios.get<{ data: Session }>("/api/users/me");
      setSession(res.data.data);
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  };
  useEffect(() => {
    getUserSession();
  }, []);

  return <div>{session && <Body session={session} />}</div>;
}
