"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Logout = () => {
  const router = useRouter();
  useEffect(() => {
    try {
      localStorage.removeItem("authToken");
      router.replace("/");
    } catch (error) {
      console.error("error", error);
    }
  }, []);

  return null;
};

export default Logout;
