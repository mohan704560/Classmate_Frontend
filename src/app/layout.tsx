"use client";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { createContext, useEffect, useReducer } from "react";
import Axios from "@/service/axios";

export const UserContext = createContext<{
  state: any;
  dispatch: React.Dispatch<{ type: string; payload?: any }>;
} | null>(null);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router: AppRouterInstance = useRouter();
  const pathName: string = usePathname();

  const initialValue = {
    userDetail: null,
  };
  const reducer = (
    state: any,
    action: { type: string; payload?: any }
  ): any => {
    switch (action.type) {
      case "addUserDetail":
        return { ...state, userDetail: action.payload };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialValue);

  const userDetail = async (): Promise<any> => {
    try {
      const res = await Axios.get("/user/getUserDetail");
      dispatch({ type: "addUserDetail", payload: res.data.data.data });
      console.log("res", res);
      if (pathName === "/") {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("error", error);
      router.replace("/");
    }
  };

  useEffect(() => {
    userDetail();
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "Montserrat" }}>
        <UserContext.Provider value={{ state, dispatch }}>
          {children}
        </UserContext.Provider>
      </body>
    </html>
  );
}
