"use client";

import CustomModel from "@/components/CustomModel";
import CustomNumericInput from "@/components/CustomNumericInput";
import CustomTextInput from "@/components/CustomTextInput";
import {
  faEllipsisVertical,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import Axios from "@/service/axios";
import { ICourse } from "@/Interfaces/course";
import Link from "next/link";

const Courses = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const feesRef = useRef<HTMLInputElement>(null);
  const [subjectCount, setSubjectCount] = useState<number[]>([0]);
  const submitHandler = async () => {
    const subjectArray: string[] = [];
    (
      Array.from(
        document.getElementsByClassName("subject")
      ) as HTMLInputElement[]
    ).map((ele) => subjectArray.push(ele.value));
    const data = {
      name: nameRef.current?.value,
      subject: subjectArray,
      fees: feesRef.current?.value,
    };
    console.log("data :>> ", data);
    if (!data.name) {
      setError("Course name is required");
      return;
    }
    if (data.subject.length === 0) {
      setError("Subject is required");
      return;
    }
    if (!data.fees) {
      setError("Fees is required");
      return;
    }
    const postRes = await Axios.post("/course/create", data);
    console.log("postRes", postRes);
    if (modelRef.current) {
      modelRef.current.style.display = "none";
    }
    setError(null);
    fetchCourse();
  };

  const fetchCourse = async () => {
    try {
      const fetchRes = await Axios.get("/course/all");
      console.log("fetchRes :>> ", fetchRes.data.data);
      setCourses([...fetchRes.data.data]);
    } catch (e) {
      console.error("e", e);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <div className="w-full h-[85vh] lg:px-4">
      <div className="w-full lg:w-3/4 lg:bg-white h-full rounded-md">
        <div className="flex flex-row justify-between items-center mt-4 px-4 lg:pt-4">
          <span className="font-medium text-2xl">Courses</span>
          <button
            className="bg-blue-600 h-8 w-8 lg:w-36 rounded-md flex items-center justify-center"
            onClick={() => {
              if (modelRef.current) {
                modelRef.current.style.display = "flex";
              }
            }}
          >
            <FontAwesomeIcon
              icon={faPlus}
              size="sm"
              style={{ color: "#ffffff" }}
              className="h-5 w-5"
            />
            <span className="text-white hidden lg:inline ml-1 font-medium">
              New Course
            </span>
          </button>
          <CustomModel ref={modelRef} header="Add new Course">
            <div className="mt-4">
              {error !== null && (
                <p className="text-sm text-red-500 mt-2">{`* ${error}`}</p>
              )}
              <div className="mt-4">
                <label className="font-medium">
                  Course Name <span className="text-red-400">{" *"}</span>
                </label>
                <CustomTextInput
                  placeholder="Course Name"
                  otherStyle="mt-1"
                  ref={nameRef}
                />
              </div>
              <div className="mt-2">
                <label className="font-medium">
                  Subject <span className="text-red-400">{" *"}</span>
                </label>
                <div className="flex">
                  <div className="w-full">
                    {subjectCount.map((subject, index) => (
                      <CustomTextInput otherStyle="mt-1 subject" key={index} />
                    ))}
                  </div>
                  <div className="flex mt-2">
                    <button
                      className="bg-blue-600 h-8 w-8 rounded-md flex items-center justify-center  ml-4"
                      onClick={() => setSubjectCount([...subjectCount, 0])}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        size="sm"
                        style={{ color: "#ffffff" }}
                        className="h-5 w-5"
                      />
                    </button>
                    <button
                      className="bg-blue-600 h-8 w-8 rounded-md flex items-center justify-center  ml-2"
                      onClick={() => {
                        if (subjectCount.length > 1) {
                          subjectCount.pop();
                          setSubjectCount([...subjectCount]);
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faMinus}
                        size="sm"
                        style={{ color: "#ffffff" }}
                        className="h-5 w-5"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <label className="font-medium">
                  Fees (Rs.)
                  <span className="text-red-400">{" *"}</span>
                </label>
                <CustomNumericInput otherStyle="mt-1" ref={feesRef} />
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  className="w-20 h-10 rounded-md bg-green-400 text-white font-medium"
                  onClick={submitHandler}
                >
                  Save
                </button>
                <button
                  className="w-20 h-10 ml-4 rounded-md bg-gray-400 font-medium"
                  onClick={() => {
                    if (modelRef.current) {
                      modelRef.current.style.display = "none";
                    }
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </CustomModel>
        </div>
        <div className="px-4 my-4">
          <input
            type="text"
            disabled
            className="w-full h-8 block bg-gray-200"
          />
        </div>
        <div className="overflow-y-auto h-full">
          <div>
            {courses.length > 0 &&
              courses.map((course) => (
                <Course
                  key={course.id}
                  name={course.name}
                  fees={course.fees}
                  subjects={course.subject}
                />
              ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

const Course = ({
  key,
  name,
  fees,
  subjects,
}: {
  key: number;
  name: string;
  fees: number;
  subjects: string[];
}) => {
  return (
    <div className="border-y border-gray-300 py-2 ps-3 pe-3 flex">
      <div className="grow pr-10">
        <p className="flex justify-between">
          <span className="font-medium text-xl text-blue-600">{name}</span>
          <span className="font-medium text-xl">{"Rs " + fees}</span>
        </p>
        <div className="mt-2">
          {subjects.map((subject, index) => (
            <button
              className="bg-green-400 font-medium px-2 text-sm rounded-md mx-1 text-white"
              key={index}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full"
          onClick={() => {
            let menu: HTMLElement | null = document.getElementById(`${key}`);
            if (!menu) return;
            if (menu.style.display === "none") {
              menu.style.display = "block";
            } else {
              menu.style.display = "none";
            }
          }}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} className="w-1 inline" />
        </button>
        <ul
          className="w-40 absolute right-1 top-4 z-50 border rounded-md shadow-md bg-white"
          style={{ display: "none" }}
          id={`${key}`}
        >
          <li className="p-2 border-b">
            <Link className="text-normal font-medium" href="">
              Add Marks
            </Link>
          </li>
          <li className="p-2 border">
            <Link className="text-normal font-medium" href="">
              Delete
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Courses;
