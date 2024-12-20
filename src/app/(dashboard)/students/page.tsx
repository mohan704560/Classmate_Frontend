"use client";

import CustomDateInput from "@/components/CustomDateInput";
import CustomEmailInput from "@/components/CustomEmailInput";
import CustomModel from "@/components/CustomModel";
import CustomNumericInput from "@/components/CustomNumericInput";
import CustomSelectInput from "@/components/CustomSelectInput";
import CustomTextArea from "@/components/CustomTextArea";
import CustomTextInput from "@/components/CustomTextInput";
import { IBatch } from "@/Interfaces/batch";
import { IStudent, IStudentWithBatchNo } from "@/Interfaces/student";
import { convertDateMonthYear } from "@/library/date";
import Axios from "@/service/axios";
import {
  faEllipsisVertical,
  faEnvelope,
  faPhone,
  faPlus,
  faSquarePlus,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

const Students = () => {
  const modelRef = useRef<HTMLDivElement>(null);

  const [batches, setBatches] = useState<{ name: string; value: string }[]>([]);
  const [students, setStudents] = useState<IStudentWithBatchNo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const middleNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const rollNoRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const pincodeRef = useRef<HTMLInputElement>(null);
  const districtRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const batchRef = useRef<HTMLSelectElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailIdRef = useRef<HTMLInputElement>(null);
  const genderMaleRef = useRef<HTMLInputElement>(null);
  const genderFemaleRef = useRef<HTMLInputElement>(null);
  const dateOfBirthRef = useRef<HTMLInputElement>(null);

  const submitHandler = async () => {
    const data = {
      rollNo: rollNoRef.current?.value,
      address: addressRef.current?.value,
      batch: batchRef.current?.value,
      mobileNo: mobileRef.current?.value,
      emailId: emailIdRef.current?.value,
      firstName: firstNameRef.current?.value,
      middleName: middleNameRef.current?.value,
      lastName: lastNameRef.current?.value,
      pincode: pincodeRef.current?.value,
      district: districtRef.current?.value,
      state: stateRef.current?.value,
      gender: genderMaleRef.current?.checked
        ? genderMaleRef.current?.value
        : genderFemaleRef.current?.checked
        ? genderFemaleRef.current?.value
        : null,
      dateOfBirth: dateOfBirthRef.current?.value,
      institute: 1,
    };
    console.log("data :>> ", data);
    if (!data.firstName) {
      setError("First Name is Required");
      return;
    } else if (!data.lastName) {
      setError("Last Name is Required");
      return;
    } else if (!data.batch) {
      setError("Batch is required");
      return;
    }

    const studentRes = await Axios.post("/student/create", data);
    console.log("studentRes.data.data :>> ", studentRes.data.data);
    if (modelRef && typeof modelRef !== "function" && modelRef.current) {
      modelRef.current.style.display = "none";
    }
    fetchStudent();
  };

  const fetchBatch = async () => {
    const fetchBatchRes = await Axios.get("/batch/all");
    console.log("fetchBatchRes", fetchBatchRes.data.data);
    const batch: { name: string; value: string }[] = [];
    fetchBatchRes.data.data.map((obj: IBatch) => {
      batch.push({ name: obj.name, value: `${obj.id}` });
    });
    setBatches([...batch]);
  };

  console.log("batches", batches);

  const fetchStudent = async () => {
    const fetchStudentRes = await Axios.get("/student/all");
    console.log("fetchStudentRes :>> ", fetchStudentRes.data.data);
    setStudents([...fetchStudentRes.data.data]);
  };

  useEffect(() => {
    fetchBatch();
    fetchStudent();
  }, []);

  return (
    <div className="w-full h-[85vh] lg:px-4">
      <div className="w-full lg:w-3/4 lg:bg-white h-full rounded-md">
        <div className="flex flex-row justify-between items-center mt-4 px-4 lg:pt-4">
          <span className="font-medium text-2xl">Students</span>
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
              New Student
            </span>
          </button>

          <CustomModel ref={modelRef} header="Add new Student">
            {error !== null && (
              <p className="mt-4 text-red-500 text-sm">{`* ${error}`}</p>
            )}
            <div className="mt-4 lg:flex">
              <div className="lg:mr-4">
                <label className="font-medium">
                  First Name<span className="text-red-400">{" *"}</span>
                </label>
                <CustomTextInput
                  placeholder="First name"
                  otherStyle="mt-1"
                  ref={firstNameRef}
                />
              </div>
              <div className="mt-2 lg:mr-4 lg:mt-0">
                <label className="font-medium">Middle Name</label>
                <CustomTextInput
                  placeholder="Middle name"
                  otherStyle="mt-1"
                  ref={middleNameRef}
                />
              </div>
              <div className="mt-2 lg:mt-0">
                <label className="font-medium">
                  Last Name<span className="text-red-400">{" *"}</span>
                </label>
                <CustomTextInput
                  placeholder="Last name"
                  otherStyle="mt-1"
                  ref={lastNameRef}
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="font-medium">Roll No</label>
              <CustomNumericInput otherStyle="mt-1" ref={rollNoRef} />
            </div>
            <div className="mt-2">
              <label className="font-medium">Address </label>
              <CustomTextArea rows={6} otherStyle="mt-1" ref={addressRef} />
            </div>
            <div className="lg:mt-2 lg:flex">
              <div className="mt-2 lg:mt-0 lg:mr-4">
                <label className="font-medium">Pincode</label>
                <CustomNumericInput otherStyle="mt-1" ref={pincodeRef} />
              </div>
              <div className="mt-2 lg:mt-0 lg:mr-4">
                <label className="font-medium">District</label>
                <CustomTextInput otherStyle="mt-1" ref={districtRef} />
              </div>
              <div className="mt-2 lg:mt-0">
                <label className="font-medium">State</label>
                <CustomTextInput otherStyle="mt-1" ref={stateRef} />
              </div>
            </div>
            <div className="mt-2">
              <label className="font-medium">
                Batch<span className="text-red-400">{" *"}</span>
              </label>
              <CustomSelectInput
                optionArray={batches}
                otherStyle="mt-1"
                placeholder="Choose a batch"
                ref={batchRef}
              />
            </div>
            <div className="lg:mt-2 lg:flex">
              <div className="mt-2 lg:mt-0 lg:mr-4 w-full">
                <label className="font-medium">Mobile No</label>
                <CustomNumericInput otherStyle="mt-1" ref={mobileRef} />
              </div>
              <div className="mt-2 lg:mt-0 w-full">
                <label className="font-medium">Email ID</label>
                <CustomEmailInput otherStyle="mt-1" ref={emailIdRef} />
              </div>
            </div>
            <div className="lg:mt-2 lg:flex">
              <div className="mt-2 lg:mt-0 lg:mr-4 w-full">
                <label className="font-medium">Gender</label>
                <div className="mt-1 flex justify-start items-center">
                  <input
                    type="radio"
                    value="male"
                    name="gender"
                    ref={genderMaleRef}
                  />
                  <label className="font-medium ml-2">Male</label>
                  <input
                    type="radio"
                    value="female"
                    className="ml-8"
                    name="gender"
                    ref={genderFemaleRef}
                  />
                  <label className="font-medium ml-2">Female</label>
                </div>
              </div>
              <div className="mt-2 lg:mt-0 w-full">
                <label className="font-medium">Date Of Birth</label>
                <CustomDateInput otherStyle="mt-1" ref={dateOfBirthRef} />
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
            {students.map((student) => (
              <Student
                key={student.id}
                firstName={student.firstName}
                rollNo={student.rollNo}
                batch={student.batchName}
                middleName={student.middleName}
                lastName={student.lastName}
                mobileNo={student.mobileNo}
                emailId={student.emailId}
                createdAt={student.createdAt}
              />
            ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

interface StudentProp {
  key: number | string;
  firstName: string;
  rollNo: number | string;
  batch: string;
  middleName: string;
  lastName: string;
  mobileNo: string;
  emailId: string;
  createdAt: Date | string;
}

const Student = (props: StudentProp) => {
  const data: StudentProp = { ...props };
  type StudentPropKeys = keyof StudentProp;
  for (let [key, value] of Object.entries(data)) {
    const typedKey = key as StudentPropKeys;
    if (value === null) {
      data[typedKey] = "";
    }
  }
  return (
    <div className="border-y border-gray-300 py-2 ps-4 flex relative">
      <div className="w-20 h-20 rounded-full bg-gray-200 my-auto"></div>
      <div className="mx-4 grow">
        <p className="font-normal text-xl text-blue-600 grow">{`${data.firstName} ${data.middleName} ${data.lastName}`}</p>
        <span className="block lg:inline text-sm font-medium ">
          <span>Roll No {" : "}</span>
          {data.rollNo}
        </span>
        <span className="block lg:inline text-sm font-medium lg:ml-8">
          <FontAwesomeIcon
            icon={faUserGroup}
            className="h-3 w-3 mr-1 mb-[1px]"
          />
          {data.batch}
        </span>
        <span className="block lg:inline lg:mr-8 text-sm font-medium lg:ml-8">
          <FontAwesomeIcon icon={faPhone} className="h-3 w-3" />
          {" " + data.mobileNo}
        </span>
        <span className="block lg:inline text-sm font-medium">
          <FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" />
          {" " + data.emailId}
        </span>
        <p className="text-xs font-normal lg:mt-1">
          {"Created on " + convertDateMonthYear(data.createdAt)}
        </p>
      </div>
      <FontAwesomeIcon
        icon={faEllipsisVertical}
        className="w-1 block absolute right-2 lg:right-6 top-4"
      />
    </div>
  );
};

export default Students;
