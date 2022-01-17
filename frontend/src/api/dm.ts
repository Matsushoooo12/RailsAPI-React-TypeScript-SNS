/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import { Message } from "../types/dm";
import client from "./client";

// ルーム作成
export const createRoom = (id: number) => {
  return client.post(
    `/users/${id}/rooms`,
    {},
    {
      headers: <any>{
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    }
  );
};

// ルーム一覧
export const getAllRooms = () => {
  return client.get("/rooms", {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// ルーム詳細
export const getDetailRoom = (id: number) => {
  return client.get(`/rooms/${id}`, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// メッセージ作成
export const createMessage = (id: number, params: Pick<Message, "content">) => {
  return client.post(`/rooms/${id}/messages`, params, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
