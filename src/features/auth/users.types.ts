import { Document } from "mongoose";

export enum GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}
export enum ROLE {
  ADMIN = "admin",
  CLIENT = "client",
  VENDOR = "vendor",
}
export type TokenPayload = {
  email: string;
  role: ROLE;
  id: string;
};
export interface UserBase extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  gender: GENDER;
  dob: string;
  role: ROLE;
  password: string;
}
