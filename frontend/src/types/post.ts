import { Like } from "./like";

export type Post = {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  likes: Like[];
};
