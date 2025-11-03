import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Task } from "../types";
import config from "../../config.json";
import type { TaskArgs } from "./types";

export const tasksApi = createApi({
  reducerPath: "tasks",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/lists`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllTasks: builder.query<Task[], number>({
      query: (listId) => `/${listId}/tasks`,
    }),
    addTask: builder.mutation({
      query: ({ listId, name }: Partial<TaskArgs>) => ({
        url: `/${listId}/tasks`,
        method: "POST",
        body: {
          name,
        },
      }),
    }),
    editTask: builder.mutation({
      query: ({ listId, id, payload }: Partial<TaskArgs>) => ({
        url: `/${listId}/tasks/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    deleteTask: builder.mutation({
      query: ({ listId, id }: Partial<TaskArgs>) => ({
        url: `/${listId}/tasks/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useEditTaskMutation,
} = tasksApi;
