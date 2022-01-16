/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import client from "./client";

export const createLike = (id: number) => {
  return client.post(
    `/posts/${id}/likes`,
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

export const deleteLike = (id: number) => {
  return client.delete(`/likes/${id}`, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
