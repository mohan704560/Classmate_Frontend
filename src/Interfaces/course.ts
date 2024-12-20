export interface ICourse {
  id: number;
  name: string;
  subject: Array<string>;
  fees: number;
  createdAt: Date;
  updatedAt: Date;
}
