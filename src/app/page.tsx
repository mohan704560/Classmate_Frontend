"use client";

import CustomPasswordInput from "../components/CustomPasswordInput";
import CustomSelectInput from "../components/CustomSelectInput";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import CustomEmailInput from "../components/CustomEmailInput";
import Axios from "../service/axios";
import Link from "next/link";
import { UserContext } from "./layout";

export default function Home() {
  const router = useRouter();
  const userTypeRef = useRef<HTMLSelectElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const context = useContext(UserContext);

  const signInHandler = async () => {
    const data = {
      userType: userTypeRef?.current?.value,
      email: emailRef?.current?.value,
      password: passwordRef?.current?.value,
    };

    if (!data.userType) {
      setError("Please select a valid user type");
      return;
    }
    if (!data.email) {
      setError("Email ID is required");
      return;
    }
    if (!data.password) {
      setError("Password is required");
      return;
    }

    console.log("data", data);
    try {
      const res = await Axios.post("/user/login", data);
      console.log("res", res);
      console.log("res.data.data.token", res.data.data.token);
      localStorage.setItem("authToken", res.data.data.token);
      router.push("/dashboard");
    } catch (error: any) {
      let message =
        typeof error.response !== "undefined"
          ? error.response.data.message
          : error.message;
      console.error("error", message);
      alert(message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="mx-8 border px-4 rounded-lg shadow-md md:w-[400px] max-w-lg">
        <div className="mt-8 mb-12">
          <p className="text-center text-2xl font-medium">
            Login to your account
          </p>
          {error && <p className="mt-8 text-red-500 text-sm">{"* " + error}</p>}
          <CustomSelectInput
            placeholder="Select user type"
            optionArray={[
              { name: "Student", value: "student" },
              { name: "Institute", value: "institute" },
            ]}
            otherStyle="mt-4"
            ref={userTypeRef}
          />
          <CustomEmailInput
            placeholder="Email"
            otherStyle="mt-4"
            ref={emailRef}
          />
          <style jsx>{`
            .focus-visible {
              outline: 2px solid black;
            }
          `}</style>
          <div
            className="w-full border rounded h-10 mt-4 flex passwordCotainer "
            onFocus={() =>
              passwordContainerRef?.current?.classList.add("focus-visible")
            }
            onBlur={() =>
              passwordContainerRef?.current?.classList.remove("focus-visible")
            }
            ref={passwordContainerRef}
          >
            <input
              type={isPasswordShow ? "text" : "password"}
              ref={passwordRef}
              className="w-full rounded h-full px-2 focus-visible:outline-none password"
              placeholder="Password"
            />
            <button
              onClick={() => setIsPasswordShow(!isPasswordShow)}
              className="w-10 text-center flex items-center justify-center"
            >
              <FontAwesomeIcon
                icon={isPasswordShow ? faEyeSlash : faEye}
                className="w-4 h-4"
              />
            </button>
          </div>
          <button
            className="mt-4 w-full text-center rounded h-10 bg-green-400 text-white"
            onClick={signInHandler}
          >
            Sign In
          </button>
          <Link
            href="/forgotPassword"
            className="text-sm font-medium text-blue-400 mt-4 text-right block"
          >
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
}
