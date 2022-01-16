/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import { User } from "../types/user";
import client from "./client";

// サインアップ
export const signUp = (params: User) => {
  return client.post("/auth", params);
};

// サインイン
export const signIn = (params: Omit<User, "passwordConfirmation" | "name">) => {
  return client.post("/auth/sign_in", params);
};

// サインアウト
export const signOut = () => {
  return client.delete("/auth/sign_out", {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// ログインユーザーの取得
export const getCurrentUser = () => {
  if (
    !Cookies.get("_access_token") ||
    !Cookies.get("_client") ||
    !Cookies.get("_uid")
  )
    return;

  return client.get("/auth/sessions", {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
