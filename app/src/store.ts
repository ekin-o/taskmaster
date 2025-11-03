import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { listsApi } from "./services/lists";
import { authApi } from "./services/auth";
import { tasksApi } from "./services/tasks";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [authApi.reducerPath]: authApi.reducer,
    [listsApi.reducerPath]: listsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(listsApi.middleware)
      .concat(tasksApi.middleware),
});

setupListeners(store.dispatch);
