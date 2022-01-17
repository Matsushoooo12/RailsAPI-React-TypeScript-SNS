/* eslint-disable @typescript-eslint/consistent-type-assertions */
import Cookies from "js-cookie";
import client from "./client";

export const createFollow = (id: number) => {
  return client.post(
    `/users/${id}/relationships`,
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

export const deleteFollow = (id: number) => {
  return client.delete(`/relationships/${id}`, {
    headers: <any>{
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
