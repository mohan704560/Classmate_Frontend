"use client";

import CustomModel from "@/components/CustomModel";
import CustomSelectInput from "@/components/CustomSelectInput";
import CustomTextInput from "@/components/CustomTextInput";
import { IExamDetailWithBatchName } from "@/Interfaces/exam";
import { IStudent } from "@/Interfaces/student";
import { capitalizeFirstLetter } from "@/library/string";
import Axios from "@/service/axios";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import React, {
  ForwardedRef,
  forwardRef,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface ITeam {
  teamName: string;
  member: Array<{ student: IStudent; isCaptain: boolean }>;
}

interface IMarksForQuestion {
  correctAnswer: number;
  incorrectAnswer: number;
  nonAttempt: number;
}

const Add = () => {
  const router = useRouter();

  var marksForQuestion: IMarksForQuestion = {
    correctAnswer: 0,
    incorrectAnswer: 0,
    nonAttempt: 0,
  };

  const params = useParams();
  const [examDetail, setExamDetail] = useState<IExamDetailWithBatchName | null>(
    null
  );
  const [questionMarks, setQuestionMarks] =
    useState<IMarksForQuestion>(marksForQuestion);
  const [student, setStudent] = useState<IStudent[]>([]);
  const modelRef = useRef<HTMLDivElement>(null);

  const [team, setTeam] = useState<ITeam[]>([]);

  const fetchExamDetails = async (id: string) => {
    try {
      const fetchRes = await Axios.get(`/exam/examDetailById/${id}`);
      const fetchStudentRes = await Axios.get(
        `/student/getFromBatch/${fetchRes.data.data[0].batch}`
      );
      setExamDetail({ ...fetchRes.data.data[0] });
      setStudent([...fetchStudentRes.data.data]);
    } catch (e) {
      console.error("e :>> ", e);
    }
  };

  const resetHandler = () => {
    student.map((obj) => {
      Array.from(document.getElementsByClassName(`${obj.rollNo}`)).map(
        (ele) => {
          if (
            ele instanceof HTMLInputElement ||
            ele instanceof HTMLButtonElement
          ) {
            ele.disabled = false;
          }
        }
      );
    });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const examMarks: Array<{
        id: number;
        rollNo: number;
        absent: boolean;
        correctAnswer: string | null;
        incorrectAnswer: string | null;
        nonAttempt: string | null;
        marksObtain: number | string;
      }> = [];
      student.map((obj) => {
        const input = Array.from(
          document.getElementsByClassName(`${obj.rollNo}`)
        ) as HTMLInputElement[];

        examMarks.push({
          id: obj.id,
          rollNo: obj.rollNo,
          absent: input[0].checked,
          correctAnswer: input[1].value === "" ? null : input[1].value,
          incorrectAnswer: input[2].value === "" ? null : input[2].value,
          nonAttempt: input[3].value === "" ? null : input[3].value,
          marksObtain:
            (
              document.getElementById(
                `totalMarks${obj.rollNo}`
              ) as HTMLInputElement
            )?.value === ""
              ? 0
              : (
                  document.getElementById(
                    `totalMarks${obj.rollNo}`
                  ) as HTMLInputElement
                )?.value,
        });
      });
      if (examDetail) {
        examDetail.testStatus = "Completed";
        examDetail.correctAnswerMarks = questionMarks.correctAnswer;
        examDetail.incorrectAnswerMarks = questionMarks.incorrectAnswer;
        examDetail.nonattemptQuestionMarks = questionMarks.nonAttempt;
      }

      const resMarks = await Axios.post("/exam/examMarks", {
        examMarks,
        examDetail: examDetail,
      });
      console.log("resMarks :>> ", resMarks);
      alert("Marks Saved Successfully.");
      router.push("/exams");
    } catch (e) {
      alert("Unable to save marks.");
      console.error("e", e);
    }
  };

  const teamSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const examMarks: Array<{
        id: number;
        rollNo: number;
        absent: boolean;
        isCaptain: boolean;
        correctAnswer: string | null;
        incorrectAnswer: string | null;
        nonAttempt: string | null;
        marksObtain: number | string;
        team: string;
      }> = [];
      team.map((teamObj) => {
        teamObj.member.map(({ student, isCaptain }) => {
          const input = Array.from(
            document.getElementsByClassName(`${student.rollNo}`)
          ) as HTMLInputElement[];
          examMarks.push({
            id: student.id,
            rollNo: student.rollNo,
            isCaptain: isCaptain,
            absent: input[0].checked,
            correctAnswer: input[1].value === "" ? null : input[1].value,
            incorrectAnswer: input[2].value === "" ? null : input[2].value,
            nonAttempt: input[3].value === "" ? null : input[3].value,
            marksObtain:
              (
                document.getElementById(
                  `totalMarks${student.rollNo}`
                ) as HTMLInputElement
              )?.value === ""
                ? 0
                : (
                    document.getElementById(
                      `totalMarks${student.rollNo}`
                    ) as HTMLInputElement
                  ).value,
            team: teamObj.teamName,
          });
        });
      });

      if (examDetail) {
        examDetail.testStatus = "Completed";
        examDetail.isTestTeamwise = 1;
        examDetail.correctAnswerMarks = questionMarks.correctAnswer;
        examDetail.incorrectAnswerMarks = questionMarks.incorrectAnswer;
        examDetail.nonattemptQuestionMarks = questionMarks.nonAttempt;
      }

      const resMarks = await Axios.post("/exam/examMarks", {
        examMarks,
        examDetail: examDetail,
      });
      console.log("resMarks :>> ", resMarks);
      alert("Marks Saved Successfully.");
      router.push("/exams");
    } catch (e) {
      alert("Unable to save marks.");
      console.error("e", e);
    }
  };

  const ShortAnswerSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      const examMarks: Array<{
        id: number;
        rollNo: number;
        absent: boolean;
        marksObtain: number | string;
      }> = [];
      student.map((obj) => {
        const input = Array.from(
          document.getElementsByClassName(`${obj.rollNo}`)
        ) as HTMLInputElement[];
        examMarks.push({
          id: obj.id,
          rollNo: obj.rollNo,
          absent: input[0].checked,
          marksObtain: input[1].value === "" ? 0 : input[1].value,
        });
      });
      if (examDetail) {
        examDetail.testStatus = "Completed";
      }

      const resMarks = await Axios.post("/exam/examMarks", {
        examMarks,
        examDetail: examDetail,
      });
      console.log("resMarks :>> ", resMarks);
      alert("Marks Saved Successfully.");
      router.push("/exams");
    } catch (e) {
      alert("Unable to save marks.");
      console.error("e", e);
    }
  };

  const ShortAnswerTeamSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      const examMarks: Array<{
        id: number;
        rollNo: number;
        absent: boolean;
        isCaptain: boolean;
        marksObtain: number | string;
        team: string;
      }> = [];
      team.map((teamObj) => {
        teamObj.member.map(({ student, isCaptain }) => {
          const input = Array.from(
            document.getElementsByClassName(`${student.rollNo}`)
          ) as HTMLInputElement[];
          examMarks.push({
            id: student.id,
            rollNo: student.rollNo,
            isCaptain: isCaptain,
            absent: input[0].checked,
            marksObtain: input[1].value === "" ? 0 : input[1].value,
            team: teamObj.teamName,
          });
        });
      });
      if (examDetail) {
        examDetail.testStatus = "Completed";
        examDetail.isTestTeamwise = 1;
      }

      const resMarks = await Axios.post("/exam/examMarks", {
        examMarks,
        examDetail: examDetail,
      });
      console.log("resMarks :>> ", resMarks);
      alert("Marks Saved Successfully.");
      router.push("/exams");
    } catch (e) {
      alert("Unable to save marks.");
      console.error("e", e);
    }
  };

  useEffect(() => {
    fetchExamDetails(params.id as string);
  }, []);

  return (
    <div>
      <div className="lg:flex py-4 px-2">
        <button
          className="bg-blue-600 h-8 w-36 rounded-md flex items-center justify-center"
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
          <span className="text-white ml-1 font-medium">Create Team</span>
        </button>
      </div>
      <TeamModel
        team={team}
        setTeam={setTeam}
        student={student}
        ref={modelRef}
      />
      <div className="px-2">
        {examDetail && examDetail.testType === 1 && (
          <QuestionMarks
            initialValue={questionMarks}
            setValue={setQuestionMarks}
          />
        )}
      </div>
      <div className="mt-8 overflow-x-scroll p-4 bg-white">
        {examDetail &&
          (team.length <= 0 ? (
            examDetail.testType === 1 ? (
              <MCQMarksTable
                student={student}
                questionMarks={questionMarks}
                submitHandler={submitHandler}
                resetHandler={resetHandler}
              />
            ) : (
              <ShortAnswerMarksTable
                student={student}
                submitHandler={ShortAnswerSubmitHandler}
                resetHandler={resetHandler}
              />
            )
          ) : examDetail.testType === 1 ? (
            <MCQMarksTableForTeam
              team={team}
              questionMarks={questionMarks}
              submitHandler={teamSubmitHandler}
              resetHandler={resetHandler}
            />
          ) : (
            <ShortAnswerMarksTableForTeam
              team={team}
              submitHandler={ShortAnswerTeamSubmitHandler}
              resetHandler={resetHandler}
            />
          ))}
      </div>
    </div>
  );
};

export default Add;

const TeamModel = forwardRef(
  (
    {
      team,
      setTeam,
      student,
    }: {
      team: ITeam[];
      setTeam: React.Dispatch<React.SetStateAction<ITeam[]>>;
      student: IStudent[];
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const nameRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    const createTeamHandler = () => {
      const teamName = nameRef.current
        ? capitalizeFirstLetter(nameRef.current?.value)
        : null;
      if (!teamName) {
        setError("Team Name is required");
        return;
      }

      const availableStudent = student.filter((obj) => {
        if (team.length === 0) return true;

        return team.every((teamObj) =>
          teamObj.member.every((memberObj) => memberObj.student.id !== obj.id)
        );
      });

      const selectedStudent = availableStudent.filter((obj) => {
        return (
          document.getElementsByClassName(
            `teamStudent${obj.rollNo}`
          )[0] as HTMLInputElement
        ).checked;
      });

      if (selectedStudent.length <= 0) {
        setError("Please select at least one member.");
        return;
      }

      const captainSelected: IStudent[] = selectedStudent.filter(
        (obj) =>
          (
            document.getElementsByClassName(
              `teamStudent${obj.rollNo}`
            )[1] as HTMLInputElement
          ).checked
      );

      if (captainSelected.length <= 0) {
        setError("Select captain of team.");
        return;
      }

      const tempObj: {
        teamName: string;
        member: { student: IStudent; isCaptain: boolean }[];
      } = { teamName: teamName, member: [] };
      selectedStudent.map((obj) => {
        tempObj.member.push({
          student: obj,
          isCaptain: (
            document.getElementsByClassName(
              `teamStudent${obj.rollNo}`
            )[1] as HTMLInputElement
          ).checked,
        });
      });
      setTeam((team) => [...team, tempObj]);
      setError(null);
      if (nameRef.current) {
        nameRef.current.value = "";
      }
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.style.display = "none";
      }
    };

    return (
      <CustomModel ref={ref} header="Add new Exam">
        {error !== null && (
          <p className="mt-4 text-red-500 text-sm">{`* ${error}`}</p>
        )}
        <div className="mt-4">
          <div className="">
            <label className="font-medium">
              Team Name <span className="text-red-400">{" *"}</span>
            </label>
            <CustomTextInput
              placeholder="Team Name"
              otherStyle="mt-1 capitalize"
              ref={nameRef}
            />
          </div>
          <table className="w-full mt-4">
            <thead>
              <tr>
                <th className="border text-center">Select</th>
                <th className="border text-center">Name</th>
                <th className="border text-center">Captain</th>
              </tr>
            </thead>
            <tbody>
              {student
                .filter((obj) => {
                  if (team.length === 0) return true;

                  return team.every((teamObj) =>
                    teamObj.member.every(
                      (memberObj) => memberObj.student.id !== obj.id
                    )
                  );
                })

                .map((obj) => {
                  return (
                    <tr key={obj.id}>
                      <td className="border text-center p-1">
                        <input
                          type="checkbox"
                          className={`teamStudent${obj.rollNo}`}
                          onClick={(e) => {
                            const target = e.target as HTMLInputElement;
                            const ele = document.getElementsByClassName(
                              target.classList[0]
                            )[1] as HTMLInputElement;
                            if (target.checked) {
                              ele.disabled = false;
                            } else {
                              ele.disabled = true;
                            }
                          }}
                        />
                      </td>
                      <td className="border py-1 px-1 lg:px-4">{`${obj.firstName} ${obj.middleName} ${obj.lastName}`}</td>
                      <td className="border text-center p-1">
                        <input
                          type="radio"
                          name="captain"
                          className={`teamStudent${obj.rollNo}`}
                          disabled={true}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <div className="mt-8 flex justify-end">
            <button
              className="w-20 h-10 rounded-md bg-green-400 text-white font-medium"
              onClick={createTeamHandler}
            >
              Save
            </button>
            <button
              className="w-20 h-10 ml-4 rounded-md bg-gray-400 font-medium"
              onClick={() => {
                if (ref && typeof ref !== "function" && ref.current) {
                  ref.current.style.display = "none";
                }
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </CustomModel>
    );
  }
);

const ShortAnswerMarksTableForTeam = ({
  team,
  submitHandler,
  resetHandler,
}: {
  team: ITeam[];
  submitHandler: React.FormEventHandler<HTMLFormElement>;
  resetHandler: React.FormEventHandler<HTMLFormElement>;
}) => {
  const absentCheckboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalMarksElement = document.getElementsByClassName(
      e.target.classList[0]
    )[1] as HTMLInputElement;
    if (e.target.checked) {
      totalMarksElement.disabled = true;
      totalMarksElement.value = "";
    } else {
      totalMarksElement.disabled = false;
    }
  };

  return (
    <div className="w-[756px] lg:w-auto">
      <form onSubmit={submitHandler} onReset={resetHandler}>
        <table className="min-w-full border-collapse border table-fixed">
          <thead>
            <tr>
              <th className="w-[10%] border ">Roll No.</th>
              <th className="border w-[50%]">Name</th>
              <th className="border w-[10%]">isCaptain</th>
              <th className="border w-[15%]">Absent</th>
              <th className="border w-[25%]">Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {team.map((teamObj, index) => {
              return (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan={5} className="font-bold px-4 border">
                      {teamObj.teamName}
                    </td>
                  </tr>
                  {teamObj.member.map(({ student, isCaptain }) => {
                    return (
                      <tr key={student.id}>
                        <td className="text-center border font-medium">
                          {student.rollNo}
                        </td>
                        <td className="font-medium px-2 border">{`${student.firstName} ${student.middleName} ${student.lastName}`}</td>
                        <td className="font-medium text-center border">
                          {isCaptain ? "Yes" : ""}
                        </td>
                        <td className="border text-center">
                          <input
                            type="checkbox"
                            value={1}
                            className={`${student.rollNo}`}
                            onChange={absentCheckboxHandler}
                          />
                        </td>
                        <td className="text-center border">
                          <input
                            type="number"
                            required
                            className={`${student.rollNo} w-20 border rounded text-center disabled:bg-gray-300`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        <div className="text-center mt-8">
          <button
            type="submit"
            className="bg-green-400 h-8 w-24 rounded-md text-white"
          >
            Save
          </button>
          <button
            type="reset"
            className="bg-gray-400 h-8 w-24 rounded-md text-white ml-4"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

const MCQMarksTableForTeam = ({
  team,
  questionMarks,
  submitHandler,
  resetHandler,
}: {
  team: ITeam[];
  questionMarks: IMarksForQuestion;
  submitHandler: React.FormEventHandler<HTMLFormElement>;
  resetHandler: React.FormEventHandler<HTMLFormElement>;
}) => {
  const calculateMarks = (className: number) => {
    const input = Array.from(
      document.getElementsByClassName(`${className}`)
    ) as HTMLInputElement[];
    const totalMarks =
      questionMarks.correctAnswer * parseInt(input[1].value || "0") -
      questionMarks.incorrectAnswer * parseInt(input[2].value || "0") -
      questionMarks.nonAttempt * parseInt(input[3].value || "0");
    (
      document.getElementById(`totalMarks${className}`) as HTMLInputElement
    ).value = `${totalMarks}`;
  };

  const absentCheckboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = Array.from(
      document.getElementsByClassName(e.target.classList[0])
    ) as HTMLInputElement[];
    if (e.target.checked) {
      input.forEach((ele, index) => {
        if (index !== 0) {
          ele.value = "";
          ele.disabled = true;
        }
      });
      (
        document.getElementById(
          `totalMarks${e.target.classList[0]}`
        ) as HTMLInputElement
      ).value = "";
    } else {
      input.forEach((ele, index) => {
        if (index !== 0) {
          ele.disabled = false;
        }
      });
    }
  };

  return (
    <div className="w-[1024px] lg:w-auto">
      <form onSubmit={submitHandler} onReset={resetHandler}>
        <table className="min-w-full border-collapse border table-fixed">
          <thead>
            <tr>
              <th className="w-[5%] border ">Roll No.</th>
              <th className="border w-[25%]">Name</th>
              <th className="border w-[5%]">Captain</th>
              <th className="border w-[5%]">Absent</th>
              <th className="border w-[15%]">Correct</th>
              <th className="border w-[15%]">Incorrect</th>
              <th className="border w-[15%]">Not Attempt</th>
              <th className="border w-[15%]">Marks</th>
            </tr>
          </thead>
          <tbody>
            {team.map((teamObj, index) => {
              return (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan={8} className="font-bold px-4 border">
                      {teamObj.teamName}
                    </td>
                  </tr>
                  {teamObj.member.map(({ student, isCaptain }) => {
                    return (
                      <tr key={student.id}>
                        <td className="text-center border font-medium">
                          {student.rollNo}
                        </td>
                        <td className="font-medium px-2 border">{`${student.firstName} ${student.middleName} ${student.lastName}`}</td>
                        <td className="font-medium text-center border">
                          {isCaptain ? "Yes" : ""}
                        </td>
                        <td className="border text-center">
                          <input
                            type="checkbox"
                            value={1}
                            className={`${student.rollNo}`}
                            onChange={absentCheckboxHandler}
                          />
                        </td>
                        <td className="text-center border">
                          <input
                            type="number"
                            required
                            className={`${student.rollNo} w-20 border rounded text-center disabled:bg-gray-300`}
                            onChange={() => calculateMarks(student.rollNo)}
                          />
                        </td>
                        <td className="text-center border p-1">
                          <input
                            type="number"
                            required
                            className={`${student.rollNo} w-20 border rounded text-center disabled:bg-gray-300`}
                            onChange={() => calculateMarks(student.rollNo)}
                          />
                        </td>
                        <td className="text-center border">
                          <input
                            type="number"
                            required
                            className={`${student.rollNo} w-20 border rounded text-center disabled:bg-gray-300`}
                            onChange={() => calculateMarks(student.rollNo)}
                          />
                        </td>
                        <td className="text-center border">
                          <input
                            type="number"
                            disabled
                            id={`totalMarks${student.rollNo}`}
                            className="disabled:bg-gray-300 w-20 border rounded text-center"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        <div className="text-center mt-8">
          <button
            type="submit"
            className="bg-green-400 h-8 w-24 rounded-md text-white"
          >
            Save
          </button>
          <button
            type="reset"
            className="bg-gray-400 h-8 w-24 rounded-md text-white ml-4"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

const MCQMarksTable = ({
  student,
  questionMarks,
  submitHandler,
  resetHandler,
}: {
  student: IStudent[];
  questionMarks: IMarksForQuestion;
  submitHandler: React.FormEventHandler<HTMLFormElement>;
  resetHandler: React.FormEventHandler<HTMLFormElement>;
}) => {
  const calculateMarks = (className: number) => {
    const input = Array.from(
      document.getElementsByClassName(`${className}`)
    ) as HTMLInputElement[];
    const totalMarks =
      questionMarks.correctAnswer * parseInt(input[1].value) -
      questionMarks.incorrectAnswer * parseInt(input[2].value) -
      questionMarks.nonAttempt * parseInt(input[3].value);
    (
      document.getElementById(`totalMarks${className}`) as HTMLInputElement
    ).value = `${totalMarks}`;
  };

  const absentCheckboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = Array.from(
      document.getElementsByClassName(e.target.classList[0])
    ) as HTMLInputElement[];
    if (e.target.checked) {
      input.forEach((ele, index) => {
        if (index !== 0) {
          ele.value = "";
          ele.disabled = true;
        }
      });
      (
        document.getElementById(
          `totalMarks${e.target.classList[0]}`
        ) as HTMLInputElement
      ).value = "";
    } else {
      input.forEach((ele, index) => {
        if (index !== 0) {
          ele.disabled = false;
        }
      });
    }
  };

  return (
    <div className="w-[1024px] lg:w-auto">
      <form onSubmit={submitHandler} onReset={resetHandler}>
        <table className="min-w-full border-collapse border table-fixed">
          <thead>
            <tr>
              <th className="w-[5%] border ">Roll No.</th>
              <th className="border w-[30%]">Name</th>
              <th className="border w-[5%]">Absent</th>
              <th className="border w-[15%]">Correct</th>
              <th className="border w-[15%]">Incorrect</th>
              <th className="border w-[15%]">Not Attempt</th>
              <th className="border w-[15%]">Marks</th>
            </tr>
          </thead>
          <tbody>
            {student.map((student, index) => {
              return (
                <tr key={index}>
                  <td className="text-center border font-medium">
                    {student.rollNo}
                  </td>
                  <td className="font-medium px-2 border">{`${student.firstName} ${student.middleName} ${student.lastName}`}</td>
                  <td className="border text-center">
                    <input
                      type="checkbox"
                      value={1}
                      className={`${student.rollNo}`}
                      onChange={absentCheckboxHandler}
                    />
                  </td>
                  <td className="text-center border">
                    <input
                      type="number"
                      required={true}
                      className={`${student.rollNo} w-20 border rounded text-center disabled:bg-gray-300`}
                      onChange={() => calculateMarks(student.rollNo)}
                    />
                  </td>
                  <td className="text-center border p-1">
                    <input
                      type="number"
                      required={true}
                      className={`${student.rollNo} w-20 border rounded text-center disabled:bg-gray-300`}
                      onChange={() => calculateMarks(student.rollNo)}
                    />
                  </td>
                  <td className="text-center border">
                    <input
                      type="number"
                      required={true}
                      className={`${student.rollNo} w-20 border rounded text-center disabled:bg-gray-300`}
                      onChange={() => calculateMarks(student.rollNo)}
                    />
                  </td>
                  <td className="text-center border">
                    <input
                      type="number"
                      disabled
                      id={`totalMarks${student.rollNo}`}
                      className="disabled:bg-gray-300 w-20 border rounded text-center"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="text-center mt-8">
          <button
            type="submit"
            className="bg-green-400 h-8 w-24 rounded-md text-white"
          >
            Save
          </button>
          <button
            type="reset"
            className="bg-gray-400 h-8 w-24 rounded-md text-white ml-4"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

const QuestionMarks = ({
  initialValue,
  setValue,
}: {
  initialValue: IMarksForQuestion;
  setValue: React.Dispatch<React.SetStateAction<IMarksForQuestion>>;
}) => {
  const correctAnswerRef = useRef<HTMLInputElement>(null);
  const incorrectAnswerRef = useRef<HTMLInputElement>(null);
  const nonAttemptRef = useRef<HTMLInputElement>(null);

  const changeHandler = (e: MouseEvent<HTMLButtonElement>) => {
    const marksForQuestion: IMarksForQuestion = {
      correctAnswer: parseInt(correctAnswerRef.current?.value || "0"),
      incorrectAnswer: parseInt(incorrectAnswerRef.current?.value || "0"),
      nonAttempt: parseInt(nonAttemptRef.current?.value || "0"),
    };
    setValue({ ...marksForQuestion });

    correctAnswerRef.current && (correctAnswerRef.current.disabled = true);
    incorrectAnswerRef.current && (incorrectAnswerRef.current.disabled = true);
    nonAttemptRef.current && (nonAttemptRef.current.disabled = true);
    (e.target as HTMLInputElement).disabled = true;
  };

  return (
    <>
      <div>
        <label className="font-medium block md:inline md:mr-4">
          Correct Answer Marks
        </label>
        <input
          type="number"
          defaultValue={initialValue.correctAnswer}
          className="border rounded h-10 px-2 font-medium disabled:bg-gray-300"
          ref={correctAnswerRef}
        />
      </div>
      <div className="mt-2">
        <label className="font-medium block md:inline md:mr-4 ">
          Incorrect Answer Marks
        </label>
        <input
          type="number"
          defaultValue={initialValue.incorrectAnswer}
          className="border rounded h-10 px-2 font-medium disabled:bg-gray-300"
          ref={incorrectAnswerRef}
        />
      </div>
      <div className="mt-2">
        <label className="font-medium block md:inline md:mr-4">
          Non Attempt Question Marks
        </label>
        <input
          type="number"
          defaultValue={initialValue.nonAttempt}
          className="border rounded h-10 px-2 font-medium disabled:bg-gray-300"
          ref={nonAttemptRef}
        />
      </div>
      <div className="mt-4">
        <button
          onClick={(e) => changeHandler(e)}
          className="bg-green-400 h-8 w-24 rounded-md text-white disabled:bg-gray-400"
        >
          Change
        </button>
      </div>
    </>
  );
};

const ShortAnswerMarksTable = ({
  student,
  submitHandler,
  resetHandler,
}: {
  student: IStudent[];
  submitHandler: React.FormEventHandler<HTMLFormElement>;
  resetHandler: React.FormEventHandler<HTMLFormElement>;
}) => {
  const absentCheckboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalMarksElement = document.getElementsByClassName(
      e.target.classList[0]
    )[1] as HTMLInputElement;
    if (e.target.checked) {
      totalMarksElement.disabled = true;
      totalMarksElement.value = "";
    } else {
      totalMarksElement.disabled = false;
    }
  };
  return (
    <div className="w-[756px] lg:w-auto">
      <form onSubmit={submitHandler} onReset={resetHandler}>
        <table className="min-w-full border-collapse border table-fixed">
          <thead>
            <tr>
              <th className="w-[10%] border ">Roll No.</th>
              <th className="border w-[50%]">Name</th>
              <th className="border w-[15%]">Absent</th>
              <th className="border w-[25%]">Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {student.map((student, index) => {
              return (
                <tr key={index}>
                  <td className="text-center border font-medium">
                    {student.rollNo}
                  </td>
                  <td className="font-medium px-2 border">{`${student.firstName} ${student.middleName} ${student.lastName}`}</td>
                  <td className="border text-center">
                    <input
                      type="checkbox"
                      value={1}
                      className={`${student.rollNo}`}
                      onChange={absentCheckboxHandler}
                    />
                  </td>
                  <td className="text-center border">
                    <input
                      type="number"
                      required
                      className={`${student.rollNo} w-20 border rounded text-center disabled:bg-gray-300`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="text-center mt-8">
          <button
            type="submit"
            className="bg-green-400 h-8 w-24 rounded-md text-white"
          >
            Save
          </button>
          <button
            type="reset"
            className="bg-gray-400 h-8 w-24 rounded-md text-white ml-4"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
