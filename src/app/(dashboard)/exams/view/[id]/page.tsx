"use client";

import { CalculatePercentage } from "@/library/arithmatic";
import { convertDateMonthYear } from "@/library/date";
import Axios from "@/service/axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import {
  IExamDetailWithBatchName,
  IExamStatic,
  IExamWithStudentDetail,
  IExamWithStudentDetailExamStatic,
} from "@/Interfaces/exam";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const View = () => {
  const params: { id: string } = useParams();
  console.log("params :>> ", params);
  const [examData, setExamData] = useState<{
    examDetail: IExamDetailWithBatchName[];
    examMarks: IExamWithStudentDetail[];
    examStatic: IExamStatic[];
    examMarksTeamWise: IExamWithStudentDetailExamStatic[];
  }>({ examDetail: [], examMarks: [], examStatic: [], examMarksTeamWise: [] });
  const fetchExamDetailsWithMarks = async (id: number) => {
    try {
      console.log("id", id);
      const res = await Axios.get(`/exam/examDetailWithMarks/${id}`);
      console.log("res :>> ", res.data.data);
      setExamData({ ...res.data.data });
    } catch (e) {
      console.error("e", e);
    }
  };

  console.log("examData :>> ", examData);

  var heading = [
    {
      title: "Test",
      value: examData.examDetail[0]?.name,
    },
    {
      title: "Date",
      value: convertDateMonthYear(examData.examDetail[0]?.testDate),
    },
    { title: "Batch", value: examData.examDetail[0]?.batchName },
    { title: "Passing Marks", value: examData.examDetail[0]?.passingMark },
    { title: "Total Marks", value: examData.examDetail[0]?.totalMark },
  ];

  const pieDataHandler = (
    examMarks: IExamWithStudentDetail[],
    totalMark: number
  ) => {
    if (!examMarks) return null;
    const percentageData = [0, 0, 0, 0, 0, 0, 0];
    examMarks.map((mark) => {
      const percentage =
        mark.absent === 0
          ? CalculatePercentage(mark.marksObtain, totalMark)
          : -1;
      if (percentage === -1) {
        percentageData[0]++;
      } else if (percentage >= 0 && percentage < 35) {
        percentageData[1]++;
      } else if (percentage >= 35 && percentage < 45) {
        percentageData[2]++;
      } else if (percentage >= 45 && percentage < 60) {
        percentageData[3]++;
      } else if (percentage >= 60 && percentage < 75) {
        percentageData[4]++;
      } else if (percentage >= 75 && percentage < 90) {
        percentageData[5]++;
      } else if (percentage >= 90 && percentage <= 100) {
        percentageData[6]++;
      }
    });
    return [
      { y: percentageData[0], label: "Absent" },
      { y: percentageData[1], label: "0-35%" },
      { y: percentageData[2], label: "35%-45%" },
      { y: percentageData[3], label: "45%-60%" },
      { y: percentageData[4], label: "60%-75%" },
      { y: percentageData[5], label: "75%-90%" },
      { y: percentageData[6], label: "90%-100%" },
    ];
  };

  const options = {
    animationEnabled: true,
    data: [
      {
        type: "pie",
        startAngle: 90,
        toolTipContent: "<b>{label}</b>: {y}",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}",
        dataPoints: pieDataHandler(
          examData.examMarks,
          examData.examDetail[0]?.totalMark
        ),
      },
    ],
  };

  useEffect(() => {
    console.log("params.id", params.id);
    fetchExamDetailsWithMarks(parseInt(params.id));
  }, []);

  return Object.keys(examData).length > 0 ? (
    <div className="bg-white w-full pt-8 pb-8">
      <h1 className="text-center font-bold text-2xl">Exam Analysis</h1>
      <div className="mt-8 lg:flex">
        <div className="pl-4 lg:w-1/2">
          {heading.map(
            (ele, index) =>
              index <= 2 && (
                <p key={index}>
                  <span className="inline-block w-36 font-bold">
                    {ele.title}
                  </span>
                  <span>{" : " + ele.value}</span>
                </p>
              )
          )}
        </div>
        <div className="pl-4 lg:w-1/2">
          {heading.map(
            (ele, index) =>
              index > 2 && (
                <p key={index}>
                  <span className="inline-block w-36 font-bold">
                    {ele.title}
                  </span>
                  <span>{" : " + ele.value}</span>
                </p>
              )
          )}
        </div>
      </div>
      <div className="h-[500px] px-8 py-10">
        <CanvasJSChart options={options} />
      </div>
      <div className="flex-row flex-wrap flex justify-evenly lg:justify-start">
        <StaticCard
          text="Students"
          value={examData.examStatic[0]?.count}
          otherStyle="m-2 lg:mx-4"
        />
        <StaticCard
          text="Highest"
          value={examData.examStatic[0]?.highest}
          otherStyle="m-2 lg:mx-4"
        />
        <StaticCard
          text="Average"
          value={parseInt(examData.examStatic[0]?.average).toFixed(1)}
          otherStyle="m-2 lg:mx-4"
        />
        <StaticCard
          text="Lowest"
          value={examData.examStatic[0]?.lowest}
          otherStyle="m-2 lg:mx-4"
        />
      </div>
      {examData.examDetail[0]?.isTestTeamwise === 1 && (
        <div className="pt-8">
          <p className="text-center font-bold text-xl">Team Wise Ranking</p>
          <div className="overflow-x-scroll lg:overflow-x-auto px-4 mt-1">
            {examData.examDetail[0].testType === 1 ? (
              <TeamMCQTableTeamWise
                data={examData.examMarksTeamWise}
                examDetail={examData.examDetail}
              />
            ) : (
              <TeamShortAnswerTableTeamWise
                data={examData.examMarksTeamWise}
                examDetail={examData.examDetail}
              />
            )}
          </div>
        </div>
      )}

      <div className="pt-8">
        <p className="text-center font-bold text-xl">Mark Wise Ranking</p>
        <div className="overflow-x-scroll lg:overflow-x-auto px-4 mt-1">
          {examData.examDetail[0]?.testType === 1 ? (
            examData.examDetail[0].isTestTeamwise === 0 ? (
              <MCQTable
                data={examData.examMarks}
                examDetail={examData.examDetail}
              />
            ) : (
              <TeamMCQTable
                data={examData.examMarks}
                examDetail={examData.examDetail}
              />
            )
          ) : examData.examDetail[0]?.isTestTeamwise === 0 ? (
            <ShortAnswerTable
              data={examData.examMarks}
              examDetail={examData.examDetail}
            />
          ) : (
            <TeamShortAnswerTable
              data={examData.examMarks}
              examDetail={examData.examDetail}
            />
          )}
        </div>
      </div>
    </div>
  ) : null;
};

const StaticCard = ({
  text,
  value,
  otherStyle,
}: {
  text: string;
  value: string | number;
  otherStyle: string;
}) => {
  return (
    <div
      className={`w-40 h-20 border border-2 border-black rounded-md p-2 flex flex-col justify-end ${otherStyle}`}
    >
      <p className="font-bold">{text}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
};

const MCQTable = ({
  data,
  examDetail,
}: {
  data: IExamWithStudentDetail[];
  examDetail: IExamDetailWithBatchName[];
}) => {
  return (
    <table className="w-[1024px] lg:w-auto table-fixed border-collapse">
      <thead>
        <tr className="bg-neutral-300">
          <th className="border border-black w-[5%]">Rank</th>
          <th className="border w-[10%] border-black">Roll No</th>
          <th className="border w-[30%] border-black">Student Name</th>
          <th className="border w-[10%] border-black">Absent</th>
          <th className="border w-[10%] border-black">Correct Answer</th>
          <th className="border w-[10%] border-black"> Incorrect Answer</th>
          <th className="border w-[10%] border-black">Not Attempt</th>
          <th className="border w-[10%] border-black">Total Marks</th>
          <th className="border w-[10%] border-black">Result</th>
          <th className="border w-[15%] border-black">Percentage</th>
        </tr>
      </thead>
      <tbody>
        {data.map((mark: IExamWithStudentDetail, index: number) => {
          return (
            <tr key={index} className="text-center h-8">
              <td className="border border-black">{index + 1}</td>
              <td className="border border-black">{mark.rollNo}</td>
              <td className="text-left border border-black px-2">{`${mark.firstName} ${mark.middleName} ${mark.lastName}`}</td>
              <td className="border border-black">
                {mark.absent === 0 ? "" : "Yes"}
              </td>
              <td className="border border-black">{mark.correctAnswer}</td>
              <td className="border border-black">{mark.incorrectAnswer}</td>
              <td className="border border-black">{mark.nonattemptQuestion}</td>
              <td className="border border-black">{mark.marksObtain}</td>
              <td className="border border-black">
                {mark.marksObtain !== null &&
                  (mark.marksObtain >= examDetail[0].passingMark
                    ? "Pass"
                    : "Fail")}
              </td>
              <td className="border border-black">
                {mark.marksObtain !== null
                  ? CalculatePercentage(
                      mark.marksObtain,
                      examDetail[0].totalMark
                    ) + "%"
                  : ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const ShortAnswerTable = ({
  data,
  examDetail,
}: {
  data: IExamWithStudentDetail[];
  examDetail: IExamDetailWithBatchName[];
}) => {
  return (
    <table className="w-[1024px] lg:w-full table-fixed border-collapse">
      <thead>
        <tr className="bg-neutral-300">
          <th className="border border-black w-[5%]">Rank</th>
          <th className="border w-[10%] border-black">Roll No</th>
          <th className="border w-[30%] border-black">Student Name</th>
          <th className="border w-[10%] border-black">Absent</th>
          <th className="border w-[10%] border-black">Total Marks</th>
          <th className="border w-[10%] border-black">Result</th>
          <th className="border w-[15%] border-black">Percentage</th>
        </tr>
      </thead>
      <tbody>
        {data.map((mark, index) => {
          return (
            <tr key={index} className="text-center h-8">
              <td className="border border-black">{index + 1}</td>
              <td className="border border-black">{mark.rollNo}</td>
              <td className="text-left border border-black px-2">{`${mark.firstName} ${mark.middleName} ${mark.lastName}`}</td>
              <td className="border border-black">
                {mark.absent === 0 ? "" : "Yes"}
              </td>
              <td className="border border-black">{mark.marksObtain}</td>
              <td className="border border-black">
                {mark.marksObtain !== null &&
                  (mark.marksObtain >= examDetail[0].passingMark
                    ? "Pass"
                    : "Fail")}
              </td>
              <td className="border border-black">
                {mark.marksObtain !== null
                  ? CalculatePercentage(
                      mark.marksObtain,
                      examDetail[0].totalMark
                    ) + "%"
                  : ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TeamMCQTable = ({
  data,
  examDetail,
}: {
  data: IExamWithStudentDetail[];
  examDetail: IExamDetailWithBatchName[];
}) => {
  return (
    <table className="w-[1280px] lg:w-auto table-fixed border-collapse">
      <thead>
        <tr className="bg-neutral-300">
          <th className="border border-black w-[5%]">Rank</th>
          <th className="border w-[5%] border-black">Roll No</th>
          <th className="border w-[10%] border-black">Team</th>
          <th className="border w-[30%] border-black">Student Name</th>
          <th className="border w-[7%] border-black">Captain</th>
          <th className="border w-[7%] border-black">Absent</th>
          <th className="border w-[10%] border-black">Correct Answer</th>
          <th className="border w-[10%] border-black"> Incorrect Answer</th>
          <th className="border w-[10%] border-black">Not Attempt</th>
          <th className="border w-[10%] border-black">Total Marks</th>
          <th className="border w-[10%] border-black">Result</th>
          <th className="border w-[15%] border-black">Percentage</th>
        </tr>
      </thead>
      <tbody>
        {data.map((mark, index) => {
          return (
            <tr key={index} className="text-center h-8">
              <td className="border border-black">{index + 1}</td>
              <td className="border border-black">{mark.rollNo}</td>
              <td className="border border-black">{mark.team}</td>
              <td className="text-left border border-black px-2">{`${mark.firstName} ${mark.middleName} ${mark.lastName}`}</td>
              <td className="border border-black">
                {mark.isCaptain === 1 ? "Yes" : ""}
              </td>
              <td className="border border-black">
                {mark.absent === 0 ? "" : "Yes"}
              </td>
              <td className="border border-black">{mark.correctAnswer}</td>
              <td className="border border-black">{mark.incorrectAnswer}</td>
              <td className="border border-black">{mark.nonattemptQuestion}</td>
              <td className="border border-black">{mark.marksObtain}</td>
              <td className="border border-black">
                {mark.marksObtain !== null &&
                  (mark.marksObtain >= examDetail[0].passingMark
                    ? "Pass"
                    : "Fail")}
              </td>
              <td className="border border-black">
                {mark.marksObtain !== null
                  ? CalculatePercentage(
                      mark.marksObtain,
                      examDetail[0].totalMark
                    ) + "%"
                  : ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TeamShortAnswerTable = ({
  data,
  examDetail,
}: {
  data: IExamWithStudentDetail[];
  examDetail: IExamDetailWithBatchName[];
}) => {
  return (
    <table className="w-[1024px] lg:w-auto table-fixed border-collapse">
      <thead>
        <tr className="bg-neutral-300">
          <th className="border border-black w-[5%]">Rank</th>
          <th className="border w-[10%] border-black">Roll No</th>
          <th className="border w-[10%] border-black">Team</th>
          <th className="border w-[30%] border-black">Student Name</th>
          <th className="border w-[10%] border-black">Captain</th>
          <th className="border w-[10%] border-black">Absent</th>
          <th className="border w-[10%] border-black">Total Marks</th>
          <th className="border w-[10%] border-black">Result</th>
          <th className="border w-[15%] border-black">Percentage</th>
        </tr>
      </thead>
      <tbody>
        {data.map((mark, index) => {
          return (
            <tr key={index} className="text-center h-8">
              <td className="border border-black">{index + 1}</td>
              <td className="border border-black">{mark.rollNo}</td>
              <td className="border border-black">{mark.team}</td>
              <td className="text-left border border-black px-2">{`${mark.firstName} ${mark.middleName} ${mark.lastName}`}</td>
              <td className="border border-black">
                {mark.isCaptain === 1 ? "Yes" : ""}
              </td>
              <td className="border border-black">
                {mark.absent === 0 ? "" : "Yes"}
              </td>
              <td className="border border-black">{mark.marksObtain}</td>
              <td className="border border-black">
                {mark.marksObtain !== null &&
                  (mark.marksObtain >= examDetail[0].passingMark
                    ? "Pass"
                    : "Fail")}
              </td>
              <td className="border border-black">
                {mark.marksObtain !== null
                  ? CalculatePercentage(
                      mark.marksObtain,
                      examDetail[0].totalMark
                    ) + "%"
                  : ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TeamShortAnswerTableTeamWise = ({
  data,
  examDetail,
}: {
  data: IExamWithStudentDetailExamStatic[];
  examDetail: IExamDetailWithBatchName[];
}) => {
  const teamArray: string[] = [];
  const teamCount: number[] = [];
  data.map((exam, index) => {
    if (teamArray.includes(exam.team)) {
      teamCount[teamArray.indexOf(exam.team)]++;
    } else {
      teamArray.push(exam.team);
      teamCount.push(1);
    }
  });

  const teamRowSpanFunction = (
    index: number,
    team: string,
    innerText: number | string
  ) => {
    if (index === 0) {
      return (
        <td
          className="border border-black"
          rowSpan={teamCount[teamArray.indexOf(team)]}
        >
          {innerText}
        </td>
      );
    } else {
      return (
        team !== data[index - 1].team && (
          <td
            className="border border-black"
            rowSpan={teamCount[teamArray.indexOf(team)]}
          >
            {innerText}
          </td>
        )
      );
    }
  };

  return (
    <table className="w-[1024px] lg:w-full table-fixed border-collapse">
      <thead>
        <tr className="bg-neutral-300">
          <th className="border border-black w-[5%]">Rank</th>
          <th className="border w-[10%] border-black">Team</th>
          <th className="border w-[5%] border-black">Roll No</th>
          <th className="border w-[30%] border-black">Student Name</th>
          <th className="border w-[7%] border-black">Captain</th>
          <th className="border w-[7%] border-black">Absent</th>
          <th className="border w-[10%] border-black">Total Marks</th>
          <th className="border w-[10%] border-black">Team Average</th>
          <th className="border w-[15%] border-black">Standard Deviation</th>
        </tr>
      </thead>
      <tbody>
        {data.map((mark, index) => {
          return (
            <tr key={index} className="text-center h-8">
              {teamRowSpanFunction(
                index,
                mark.team,
                teamArray.indexOf(mark.team) + 1
              )}
              {teamRowSpanFunction(index, mark.team, mark.team)}

              <td className="border border-black">{mark.rollNo}</td>
              <td className="text-left border border-black px-2">{`${mark.firstName} ${mark.middleName} ${mark.lastName}`}</td>
              <td className="border border-black">
                {mark.isCaptain === 1 ? "Yes" : ""}
              </td>
              <td className="border border-black">
                {mark.absent === 0 ? "" : "Yes"}
              </td>
              <td className="border border-black">{mark.marksObtain}</td>
              {teamRowSpanFunction(
                index,
                mark.team,
                parseFloat(`${mark.average}`).toFixed(1)
              )}
              {teamRowSpanFunction(
                index,
                mark.team,
                parseFloat(`${mark.stddev}`).toFixed(1)
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TeamMCQTableTeamWise = ({
  data,
  examDetail,
}: {
  data: IExamWithStudentDetailExamStatic[];
  examDetail: IExamDetailWithBatchName[];
}) => {
  const teamArray: string[] = [];
  const teamCount: number[] = [];
  data.map((exam, index) => {
    if (teamArray.includes(exam.team)) {
      teamCount[teamArray.indexOf(exam.team)]++;
    } else {
      teamArray.push(exam.team);
      teamCount.push(1);
    }
  });

  const teamRowSpanFunction = (
    index: number,
    team: string,
    innerText: number | string
  ) => {
    if (index === 0) {
      return (
        <td
          className="border border-black"
          rowSpan={teamCount[teamArray.indexOf(team)]}
        >
          {innerText}
        </td>
      );
    } else {
      return (
        team !== data[index - 1].team && (
          <td
            className="border border-black"
            rowSpan={teamCount[teamArray.indexOf(team)]}
          >
            {innerText}
          </td>
        )
      );
    }
  };

  return (
    <table className="w-[1280px] lg:w-auto table-fixed border-collapse">
      <thead>
        <tr className="bg-neutral-300">
          <th className="border border-black w-[5%]">Rank</th>
          <th className="border w-[10%] border-black">Team</th>
          <th className="border w-[10%] border-black">Roll No</th>
          <th className="border w-[30%] border-black">Student Name</th>
          <th className="border w-[7%] border-black">Captain</th>
          <th className="border w-[7%] border-black">Absent</th>
          <th className="border w-[10%] border-black">Total Marks</th>
          <th className="border w-[10%] border-black">Team Average</th>
          <th className="border w-[15%] border-black">Standard Deviation</th>
        </tr>
      </thead>
      <tbody>
        {data.map((mark, index) => {
          return (
            <tr key={index} className="text-center h-8">
              {teamRowSpanFunction(
                index,
                mark.team,
                teamArray.indexOf(mark.team) + 1
              )}
              {teamRowSpanFunction(index, mark.team, mark.team)}
              <td className="border border-black">{mark.rollNo}</td>
              <td className="text-left border border-black px-2">{`${mark.firstName} ${mark.middleName} ${mark.lastName}`}</td>
              <td className="border border-black">
                {mark.isCaptain === 1 ? "Yes" : ""}
              </td>
              <td className="border border-black">
                {mark.absent === 0 ? "" : "Yes"}
              </td>
              <td className="border border-black">{mark.marksObtain}</td>
              {teamRowSpanFunction(
                index,
                mark.team,
                parseFloat(`${mark.average}`).toFixed(1)
              )}
              {teamRowSpanFunction(
                index,
                mark.team,
                parseFloat(`${mark.stddev}`).toFixed(1)
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default View;
