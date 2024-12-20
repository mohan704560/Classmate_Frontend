"use client";

import React from "react";
import CustomSelectInput from "@/components/CustomSelectInput";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { MutableRefObject, useRef, useState } from "react";
import CustomEmailInput from "@/components/CustomEmailInput";
import Axios from "@/service/axios";
import Link from "next/link";
import CustomNumericInput from "@/components/CustomNumericInput";

interface IInput {
  email: string | null;
  userType: string | null;
  otp: string | null;
  password: string | null;
  confirmPassword: string | null;
}

const ForgotPassword = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const userTypeRef = useRef<HTMLSelectElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("email");
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const passwordContainerRef = useRef<HTMLDivElement>(null);
  const inputObj = useRef<IInput>({
    email: null,
    userType: null,
    otp: null,
    password: null,
    confirmPassword: null,
  });
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [error, setError] = useState<string>("");

  const emailHandler = async () => {
    inputObj.current.email = emailRef.current ? emailRef.current.value : null;
    inputObj.current.userType = userTypeRef.current
      ? userTypeRef.current.value
      : null;
    if (!inputObj.current.userType) {
      setError("UserType is required");
    } else if (!inputObj.current.email) {
      setError("Email ID is required");
    } else {
      setError("");
      setStatus("OTPSent");
    }
  };

  const otpHandler = () => {
    inputObj.current.otp = otpRef.current ? otpRef.current.value : null;
    if (!inputObj.current.otp) {
      setError("OTP is required");
      return;
    } else if (inputObj.current.otp !== "4444") {
      setError("OTP is invalid");
    } else {
      setError("");
      setStatus("password");
    }
  };

  const passwordHadler = async () => {
    inputObj.current.password = passwordRef.current
      ? passwordRef.current.value
      : null;
    inputObj.current.confirmPassword = confirmPasswordRef.current
      ? confirmPasswordRef.current.value
      : null;

    if (!inputObj.current.password) {
      setError("Password is required");
      return;
    }
    if (!inputObj.current.confirmPassword) {
      setError("Confirm Password is required");
      return;
    } else if (inputObj.current.password !== inputObj.current.confirmPassword) {
      setError("Password does not match");
      return;
    } else {
      setError("");
    }

    const data = {
      userType: inputObj.current.userType,
      email: inputObj.current.email,
      password: inputObj.current.password,
    };

    try {
      const res = await Axios.post("/user/forgotPassword", data);
      console.log("res", res);
      router.push("/");
    } catch (error: any) {
      console.error("error", error.message);
      alert(error.message);
    }
  };

  const inputElement = (status: string) => {
    if (status === "email") {
      return (
        <>
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
          <button
            className="mt-4 w-full text-center rounded h-10 bg-green-400 text-white"
            onClick={emailHandler}
          >
            Send OTP
          </button>
        </>
      );
    } else if (status === "OTPSent") {
      return (
        <>
          <CustomNumericInput
            placeholder="OTP"
            otherStyle="mt-4"
            ref={otpRef}
          />
          <button
            className="mt-4 w-full text-center rounded h-10 bg-green-400 text-white"
            onClick={otpHandler}
          >
            Submit OTP
          </button>
        </>
      );
    } else {
      return (
        <>
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
          <input
            type="password"
            className="w-full border rounded h-10 px-2 mt-4"
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
          />
          <button
            className="mt-4 w-full text-center rounded h-10 bg-green-400 text-white"
            onClick={passwordHadler}
          >
            Submit
          </button>
        </>
      );
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="mx-8 border px-4 rounded-lg shadow-md md:w-[400px] max-w-lg">
        <div className="mt-8 mb-12">
          <p className="text-center text-2xl font-medium">Forgot Password</p>
          {error && <p className="mt-8 text-red-500 text-sm">{"* " + error}</p>}
          {inputElement(status)}
          <Link
            href="/"
            className="text-sm font-medium text-blue-400 mt-4 text-right block"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
