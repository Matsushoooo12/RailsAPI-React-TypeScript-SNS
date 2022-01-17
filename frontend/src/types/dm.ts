import { User } from "./user";

export type DetailRoom = {
  id: number;
  currentUser: User;
  otherUser: User;
  lastMessage: Message;
};

export type Message = {
  id: number;
  content: string;
  userId: number;
};
