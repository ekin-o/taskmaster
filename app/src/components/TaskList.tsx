import { useEffect, useMemo, useState } from "react";
import { Stack, Box } from "@mui/material";
import { listsApi } from "../services/lists";
import PanelHeader from "./shared/PanelHeader";
import ItemBase from "./shared/ItemBase";
import AddNewItem from "./shared/AddNew";
import type { List } from "../types";
import ListBase from "./shared/ListBase";

export interface ListsProps {
    setCurrentListId: (id: number | null) => void;
    currentListId: number | null;
}
export default function Lists(props: ListsProps) {
  const [searchTerm, setSearchTerm] = useState("");
const {setCurrentListId, currentListId} = props;
  const {
    useGetListsQuery,
    useEditListMutation,
    useAddListMutation,
    useDeleteListMutation,
  } = listsApi;
  const { data, isLoading, refetch } = useGetListsQuery({
    fixedCacheKey: "all-lists",
  });
  const [editList, { isSuccess: isStarListSuccess }] = useEditListMutation();
  const [addList, { isSuccess: isAddSuccess }] = useAddListMutation();
  const [deleteList, { isSuccess: isDeleteSuccess }] = useDeleteListMutation();

  const onSearch = (val: string) => {
    setSearchTerm(val);
  };
  const onClick = (id: number) => () => {
    setCurrentListId(id);
  };

  useEffect(() => {
    if (isStarListSuccess || isAddSuccess || isDeleteSuccess) {
      refetch();
      if (isDeleteSuccess) {
        setCurrentListId(null);
      }
    }
  }, [isStarListSuccess, isAddSuccess, isDeleteSuccess]);

  const items = useMemo(() => {
    return (data ?? []).filter((x: List) => x.name.includes(searchTerm));
  }, [searchTerm, data]);

  return (
    <Stack
      direction="column"
      sx={{
        height: "85%",
      }}
    >
      <PanelHeader title="Lists" onSearch={onSearch} />
      <ListBase
        items={items}
        render={(value: List) => {
          return (
            <ItemBase
              key={`list${value.id}`}
              item={value}
              onItemClick={onClick(value.id)}
              delete={deleteList}
              idArgs={{ id: value.id }}
              edit={editList}
              basePayload={{
                name: value.name,
                starred: value.starred,
              }}
              sx={{
                border: "none",
              }}
              isSelected={currentListId === value.id}
            />
          );
        }}
        isLoading={isLoading}
      />
      <Box>
        <AddNewItem add={addList} idArgs={{}} />
      </Box>
    </Stack>
  );
}
