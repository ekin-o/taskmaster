import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import type { List, Task } from "../types";
import { tasksApi } from "../services/tasks";
import { listsApi } from "../services/lists";
import PanelHeader from "./shared/PanelHeader";
import ItemBase from "./shared/ItemBase";
import AddNewItem from "./shared/AddNew";
import ListBase from "./shared/ListBase";
import { useDispatch } from "react-redux";

export interface TasksProps {
    list: number;
}
export default function Tasks(props: TasksProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { list: listId } = props;
  const {
    useGetAllTasksQuery,
    useAddTaskMutation,
    useDeleteTaskMutation,
    useEditTaskMutation,
  } = tasksApi;
  const { data, isLoading, refetch } = useGetAllTasksQuery(listId);
  const [editTask, { isSuccess: isEditSuccess }] = useEditTaskMutation();
  const [addTask, { isSuccess: isAddSuccess }] = useAddTaskMutation();
  const [deleteTask, { isSuccess: isDeleteSuccess }] = useDeleteTaskMutation();
  const { useGetListsQuery } = listsApi;
  const { data: lists } = useGetListsQuery({ fixedCacheKey: "all-lists" });
  const dispatch = useDispatch();
  const onSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    if (isEditSuccess || isAddSuccess || isDeleteSuccess) {
      refetch();
    }
  }, [isEditSuccess, isAddSuccess, isDeleteSuccess]);

  useEffect(() => {
    if (listId < 1) {
      dispatch(tasksApi.util.resetApiState());
    }
  }, [listId]);

  const items = useMemo(() => {
    return (data ?? []).filter((x: Task) => x.name.includes(searchTerm));
  }, [searchTerm, data]);
  return (
    <Stack
      direction="column"
      sx={{
        width: "50%",
        height: "85%",
      }}
    >
      <PanelHeader
        title={lists?.find((x: List) => x.id === listId)?.name}
        mode="secondary"
        onSearch={onSearch}
        clearSearch={listId < 1}
      />
      <ListBase
        items={items}
        render={(value: Task) => {
          return (
            <ItemBase
              key={`task${value.id}`}
              item={value}
              delete={deleteTask}
              idArgs={{ id: value.id, listId }}
              edit={editTask}
              checkboxEnabled
              basePayload={{
                name: value.name,
                done: value.done,
                starred: value.starred,
                dueDate: value.dueDate,
              }}
            />
          );
        }}
        isLoading={isLoading}
      />
      <Box>
        <AddNewItem add={addTask} idArgs={{ listId }} />
      </Box>
    </Stack>
  );
}
