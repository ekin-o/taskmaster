import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../config.json";
import type { ListArgs } from "./types";

export const listsApi = createApi({
  reducerPath: "lists",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/lists`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getLists: builder.query({
      query: () => "",
    }),
    addList: builder.mutation({
      query: ({ name }: Partial<ListArgs>) => ({
        url: "",
        method: "POST",
        body: {
          name,
        },
      }),
    }),
    editList: builder.mutation({
      query: ({ id, payload }: Partial<ListArgs>) => ({
        url: `/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    deleteList: builder.mutation({
      query: ({ id }: Partial<ListArgs>) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetListsQuery,
  useEditListMutation,
  useDeleteListMutation,
  useAddListMutation,
} = listsApi;
