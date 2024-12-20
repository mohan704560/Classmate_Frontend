"use client";

import CustomDateInput from "@/components/CustomDateInput";
import CustomModel from "@/components/CustomModel";
import CustomNumericInput from "@/components/CustomNumericInput";
import CustomSelectInput from "@/components/CustomSelectInput";
import CustomTextInput from "@/components/CustomTextInput";
import CustomTimeInput from "@/components/CustomTimeInput";
import { IBatch } from "@/Interfaces/batch";
import { IExamDetailWithBatchName } from "@/Interfaces/exam";
import { convertDateMonthYear } from "@/library/date";
import Axios from "@/service/axios";
import { faCalendarDays, faClock } from "@fortawesome/free-regular-svg-icons";
import {
  faBookOpen,
  faEllipsisVertical,
  faPlus,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const Exams = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const [batches, setBatches] = useState<{ name: string; value: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [exam, setExam] = useState<IExamDetailWithBatchName[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const totalMarksRef = useRef<HTMLInputElement>(null);
  const passingMarksRef = useRef<HTMLInputElement>(null);
  const batchRef = useRef<HTMLSelectElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const examTypeRef = useRef<HTMLSelectElement>(null);
  const submitHandler = async () => {
    const data = {
      testDate: dateRef.current?.value,
      name: nameRef.current?.value,
      subject: subjectRef.current?.value,
      testType: examTypeRef.current?.value,
      passingMark: passingMarksRef.current?.value,
      totalMark: totalMarksRef.current?.value,
      batch: batchRef.current?.value,
      institute: 1,
      startTime: startTimeRef.current?.value,
      endTime: endTimeRef.current?.value,
      testStatus: "Pending",
    };
    console.log("data", data);

    if (!data.name) {
      setError("Exam name is required");
      return;
    } else if (!data.batch) {
      setError("Batch Name is required");
      return;
    }

    const fetchExamRes = await Axios.post("/exam/create", data);
    console.log("fetchExamRes :>> ", fetchExamRes);
    fetchExam();
    setError(null);
    if (modelRef && typeof modelRef !== "function" && modelRef.current) {
      modelRef.current.style.display = "none";
    }
  };

  const heading = [{ name: "Add Marks", link: "/exam" }];

  const subjectArray = [
    { name: "Physics", value: "1" },
    { name: "Chemistry", value: "2" },
  ];

  const questionArray = [
    { name: "Multiple Choice Question", value: "1" },
    { name: "Board Pattern", value: "2" },
  ];

  const fetchBatch = async () => {
    const fetchBatchRes = await Axios.get("/batch/all");
    const batch: { name: string; value: string }[] = [];
    fetchBatchRes.data.data.map((obj: IBatch) => {
      batch.push({ name: obj.name, value: `${obj.id}` });
    });
    setBatches([...batch]);
  };

  const fetchExam = async () => {
    const fetchExamRes = await Axios.get("/exam/all");
    console.log("fetchExamRes.data.data", fetchExamRes.data.data);
    setExam([...fetchExamRes.data.data]);
  };

  useEffect(() => {
    fetchBatch();
    fetchExam();
  }, []);

  return (
    <div className="w-full h-[85vh] lg:px-4">
      <div className="w-full lg:w-3/4 lg:bg-white h-full rounded-md">
        <div className="flex flex-row justify-between items-center mt-4 px-4 lg:pt-4">
          <span className="font-medium text-2xl">Exams</span>
          <button
            className="bg-blue-600 h-8 w-8 lg:w-36 rounded-md flex items-center justify-center"
            onClick={() => {
              if (
                modelRef &&
                typeof modelRef !== "function" &&
                modelRef.current
              ) {
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
              New Exam
            </span>
          </button>
          <CustomModel ref={modelRef} header="Add new Exam">
            {error !== null && (
              <p className="mt-4 text-red-500 text-sm">{`* ${error}`}</p>
            )}
            <div className="mt-4">
              <div className="">
                <label className="font-medium">
                  Exam Name <span className="text-red-400">{" *"}</span>
                </label>
                <CustomTextInput
                  placeholder="Batch Name"
                  otherStyle="mt-1"
                  ref={nameRef}
                />
              </div>
              <div className="mt-2">
                <label className="font-medium">Exam Date</label>
                <CustomDateInput otherStyle="mt-1" ref={dateRef} />
              </div>
              <div className="flex mt-2">
                <div className="mr-2 grow">
                  <label className="font-medium">Start Time</label>
                  <CustomTimeInput otherStyle="mt-1" ref={startTimeRef} />
                </div>
                <div className="grow">
                  <label className="font-medium">End Time</label>
                  <CustomTimeInput otherStyle="mt-1" ref={endTimeRef} />
                </div>
              </div>
              <div className="mt-2">
                <label className="font-medium">
                  Batch <span className="text-red-400">{" *"}</span>
                </label>
                <CustomSelectInput
                  otherStyle="mt-1"
                  optionArray={batches}
                  placeholder="Select Batch"
                  ref={batchRef}
                />
              </div>
              <div className="mt-2">
                <label className="font-medium">Subject</label>
                <CustomSelectInput
                  otherStyle="mt-1"
                  optionArray={subjectArray}
                  placeholder="Select Subject"
                  ref={subjectRef}
                />
              </div>
              <div className="mt-2">
                <label className="font-medium">Exam Type</label>
                <CustomSelectInput
                  otherStyle="mt-1"
                  optionArray={questionArray}
                  placeholder="Select Exam Paper Type"
                  ref={examTypeRef}
                />
              </div>
              <div className="flex mt-2">
                <div className="mr-2 grow">
                  <label className="font-medium">Passing Marks</label>
                  <CustomNumericInput otherStyle="mt-1" ref={passingMarksRef} />
                </div>
                <div className="grow">
                  <label className="font-medium grow">Total Marks</label>
                  <CustomNumericInput otherStyle="mt-1" ref={totalMarksRef} />
                </div>
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
                    if (
                      modelRef &&
                      typeof modelRef !== "function" &&
                      modelRef.current
                    ) {
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
            {exam.map((test) => (
              <Test
                key={test.id}
                id={test.id}
                name={test.name}
                date={test.testDate}
                subject={test.subject}
                batch={test.batchName}
                startTime={test.startTime}
                endTime={test.endTime}
                status={test.testStatus}
                createdAt={test.createdAt}
              />
            ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

interface ExamProp {
  key: number | string;
  id: number | string;
  name: string;
  date: Date | string;
  subject: string;
  batch: string;
  startTime: Date | string;
  endTime: Date | string;
  status: string;
  createdAt: Date | string;
}

const Test = (props: ExamProp) => {
  const data = { ...props };
  type ExamPropKeys = keyof ExamProp;
  for (let [key, value] of Object.entries(data)) {
    const typedKey = key as ExamPropKeys;
    if (value === null) {
      data[typedKey] = "";
    }
  }

  return (
    <div className="border-y border-gray-300 py-2 ps-2 pe-3 flex">
      <span
        className={`border rounded-md mr-4 text-white px-1 text-xs h-5 mt-1 ${
          data.status === "Completed" ? "bg-green-500" : "bg-gray-500"
        }`}
      >
        {data.status}
      </span>
      <div className="grow">
        <div>
          <Link href={`/exams/view/${props.id}`}>
            <span className="font-normal text-xl text-blue-600">
              {data.name}
            </span>
          </Link>
        </div>
        <p className="lg:inline">
          <span className="text-sm font-medium ">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="h-3 w-3 mr-1 mb-[1px]"
            />
            {convertDateMonthYear(data.date)}
          </span>
          <span className="text-sm font-medium ml-4">
            <FontAwesomeIcon icon={faClock} className="h-3 w-3 mr-1 mb-[1px]" />
            {`${data.startTime} - ${data.endTime}`}
          </span>
        </p>
        <p className="lg:inline">
          <span className="text-sm font-medium lg:ml-4">
            <FontAwesomeIcon
              icon={faBookOpen}
              className="h-3 w-3 mr-1 mb-[1px]"
            />
            {data.subject}
          </span>
          <span className="text-sm font-medium ml-4">
            <FontAwesomeIcon
              icon={faUserGroup}
              className="h-3 w-3 mr-1 mb-[1px]"
            />
            {data.batch}
          </span>
        </p>
        <p className="text-xs font-medium">{`created on ${convertDateMonthYear(
          data.createdAt
        )}`}</p>
      </div>
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full"
          onClick={() => {
            let menu: HTMLElement | null = document.getElementById(data.name);
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
          id={data.name}
        >
          <li className="p-2 border-b">
            <Link
              className="text-normal font-medium"
              href={`exams/add/${data.id}`}
            >
              Add Marks
            </Link>
          </li>
          <li className="p-2 border">
            <Link
              className="text-normal font-medium"
              href={`exams/edit/${data.name}`}
            >
              Delete
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Exams;
