export interface IExam {
  id: number;
  student: number;
  test: number;
  marksObtain: number;
  team: string;
  absent: number;
  correctAnswer: number;
  incorrectAnswer: number;
  nonattemptQuestion: number;
  isCaptain: number;
}

export interface IExamDetail {
  id: number;
  testDate: Date;
  name: string;
  subject: string;
  testType: number;
  passingMark: number;
  totalMark: number;
  batch: number;
  institute: number;
  createdAt: Date;
  updatedAt: Date;
  startTime: Date;
  endTime: Date;
  testStatus: string;
  correctAnswerMarks: number;
  incorrectAnswerMarks: number;
  nonattemptQuestionMarks: number;
  isTestTeamwise: number;
}

export interface IExamDetailWithBatchName extends IExamDetail {
  batchName: string;
}

export interface IExamCreate {
  student: number;
  test: number;
  marksObtain: number;
  team: string;
  absent: number;
  correctAnswer: number;
  incorrectAnswer: number;
  nonattemptQuestion: number;
  isCaptain: number;
}

export interface ICreateExamDetail {
  testDate: Date;
  name: string;
  subject: string;
  testType: number;
  passingMark: number;
  totalMark: number;
  batch: number;
  institute: number;
  startTime: Date;
  endTime: Date;
  testStatus: string;
}

export interface IExamWithStudentDetail extends IExam {
  rollNo: number;
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface IExamWithStudentDetailExamStatic
  extends IExamWithStudentDetail {
  average: number;
  stddev: number;
}

export interface IExamStatic {
  count: number;
  lowest: number;
  highest: number;
  average: string;
}

export interface IExamMarks {
  id: number;
  rollNo: number;
  marksObtain: number;
  absent: number;
  correctAnswer: number;
  incorrectAnswer: number;
  nonAttempt: number;
  isCaptain: boolean;
  team: string | null;
}
