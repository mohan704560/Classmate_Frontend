"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const tokenVarification = async (): Promise<any> => {
    const authToken = await localStorage.getItem("authToken");
    if (!authToken) {
      router.replace("/");
    }
  };

  useEffect(() => {
    tokenVarification();
  }, []);

  return (
    <div className="bg-gray-100 min-h-svh">
      <Header />
      {children}
    </div>
  );
};

export default DashboardLayout;
