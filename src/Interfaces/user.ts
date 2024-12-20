export interface IUser {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  userRole: number;
  institute: number;
}
