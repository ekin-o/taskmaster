import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../config.json";
import type { AuthCreds } from "./types";

export const USER_CACHE_KEY = "user";
export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/auth`,
    credentials: "include",
  }),
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    isActive: builder.query({
      query: () => ({
        url: "/active",
        providesTags: () => ["auth", "login"],
      }),
    }),
    login: builder.mutation({
      query: (credentials: AuthCreds) => ({
        url: "/login",
        method: "POST",
        body: credentials,
        providesTags: () => ["login"],
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
        invalidatesTags: () => ["auth", "login"],
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useIsActiveQuery } =
  authApi;
