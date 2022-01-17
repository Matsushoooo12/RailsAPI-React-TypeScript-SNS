import { Follow } from "./follow";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  followings: Follow[];
  followers: Follow[];
};
