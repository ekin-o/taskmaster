import {
  useCallback,
} from "react";
import {
  IconButton,
  Box,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

export interface ActionsProps {
  idArgs: any;
  item: any;
  basePayload: any;
  delete: (args: any) => void;
  edit: (args: any) => void;
}

export default function Actions(props: ActionsProps) {
  const { idArgs, item, delete: deleteFn, edit, basePayload } = props;

  const onDeleteClick = useCallback(() => {
    deleteFn(idArgs);
  }, [idArgs, deleteFn]);

  const toggleKeyOnAction = useCallback(
    (actionKey: keyof typeof item) => () => {
      const payload = {
        ...basePayload,
        [actionKey]: !item[actionKey],
      };
      edit({ ...idArgs, payload });
    },
    [item, idArgs, edit]
  );
  return (
    <Box>
      <IconButton
        edge="end"
        aria-label="star"
        onClick={toggleKeyOnAction("starred")}
      >
        {item.starred ? <StarIcon /> : <StarBorderIcon />}
      </IconButton>
      <IconButton edge="end" aria-label="delete" onClick={onDeleteClick}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
