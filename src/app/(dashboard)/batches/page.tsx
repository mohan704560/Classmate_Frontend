"use client";

import CustomModel from "@/components/CustomModel";
import CustomNumericInput from "@/components/CustomNumericInput";
import CustomTextInput from "@/components/CustomTextInput";
import { faEllipsisVertical, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { IBatch } from "@/Interfaces/batch.js";
import Axios from "@/service/axios";

const Batches = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const [batches, setBatches] = useState<IBatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const yosRef = useRef<HTMLInputElement>(null);
  const yoeRef = useRef<HTMLInputElement>(null);
  const submitHandler = async () => {
    const data = {
      name: nameRef.current?.value,
      yos: yosRef.current?.value,
      yoe: yoeRef.current?.value,
    };

    console.log("data :>> ", data);

    if (!data.name) {
      setError("Batch name is required");
      return;
    }
    if (!data.yos) {
      setError("Batch start year is required");
      return;
    }
    if (!data.yoe) {
      setError("Batch end year is required");
      return;
    }

    const postRes = await Axios.post("/batch/create", data);
    console.log("postRes", postRes);
    if (modelRef.current) {
      modelRef.current.style.display = "none";
    }
    setError(null);
    fetchBatch();
  };

  const fetchBatch = async () => {
    try {
      const fetchRes = await Axios.get("/batch/all");
      console.log("fetchRes :>> ", fetchRes.data.data);
      setBatches([...fetchRes.data.data]);
    } catch (e) {
      console.error("e", e);
    }
  };

  useEffect(() => {
    fetchBatch();
  }, []);

  return (
    <div className="w-full h-[85vh] lg:px-4">
      <div className="w-full lg:w-3/4 lg:bg-white h-full rounded-md">
        <div className="flex flex-row justify-between items-center mt-4 px-4 lg:pt-4">
          <span className="font-medium text-2xl">Batches</span>
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
              New Batch
            </span>
          </button>
          <CustomModel ref={modelRef} header="Add new Batch">
            <div className="mt-4">
              {error !== null && (
                <p className="text-sm text-red-500 mt-2">{`* ${error}`}</p>
              )}
              <div className="mt-4">
                <label className="font-medium">
                  Batch Name <span className="text-red-400">{" *"}</span>
                </label>
                <CustomTextInput
                  placeholder="Batch Name"
                  otherStyle="mt-1"
                  ref={nameRef}
                />
              </div>
              <div className="mt-2">
                <label className="font-medium">
                  Year Of Start <span className="text-red-400">{" *"}</span>
                </label>
                <CustomNumericInput otherStyle="mt-1" ref={yosRef} />
              </div>
              <div className="mt-2">
                <label className="font-medium">
                  Year Of Completion{" "}
                  <span className="text-red-400">{" *"}</span>
                </label>
                <CustomNumericInput otherStyle="mt-1" ref={yoeRef} />
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
            {batches.length > 0 &&
              batches.map((batch) => (
                <Batch
                  key={batch.id}
                  name={batch.name}
                  yos={batch.yearOfStart}
                  yoe={batch.yearOfEnd}
                />
              ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

const Batch = ({
  name,
  yos,
  yoe,
}: {
  name: string;
  yos: number;
  yoe: number;
}) => {
  return (
    <div className="border-y border-gray-300 py-2 ps-2 pe-3 flex">
      <span className="border rounded-md bg-gray-500 mr-4 text-white px-1 leading-6 text-xs">{`${yos}-${yoe}`}</span>
      <span className="font-normal text-xl text-blue-600 grow">{name}</span>
      <FontAwesomeIcon icon={faEllipsisVertical} className="w-1 inline" />
    </div>
  );
};

export default Batches;
