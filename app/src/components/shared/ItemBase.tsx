import { useCallback } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import BaseActions from "./Actions";

export interface ItemBase {
  item: any;
  idArgs: any;
  basePayload: any;
  delete: (args: any) => void;
  edit: (args: any) => void;
  checkboxEnabled?: boolean;
  onItemClick?: Function;
  sx?: any;
  isSelected?: boolean;
}

export default function ItemBase(props: ItemBase) {
  const {
    item,
    idArgs,
    basePayload,
    edit,
    checkboxEnabled = false,
    onItemClick,
    sx,
    isSelected = false,
    ...actionProps
  } = props;

  const onClick = useCallback(() => {
    if (checkboxEnabled) {
      edit({ ...idArgs, payload: { ...basePayload, done: !item.done } });
    }
    onItemClick?.();
  }, [onItemClick, checkboxEnabled, item, basePayload]);

  return (
    <ListItem
      key={`${item.id}-${item.name}`}
      secondaryAction={
        <BaseActions {...{ ...actionProps, idArgs, item, basePayload, edit }} />
      }
      disablePadding
      sx={{
        border: "1px solid",
        borderColor: "#4d4d4d",
        borderRadius: 2,
        ...sx,
      }}
    >
      <ListItemButton selected={isSelected} onClick={onClick} dense>
        {!!checkboxEnabled && (
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={item.done}
              tabIndex={-1}
              disableRipple
              checkedIcon={<CheckCircleIcon />}
              icon={<RadioButtonUncheckedIcon />}
            />
          </ListItemIcon>
        )}
        <ListItemText
          primary={item.name}
          sx={{
            textDecoration: item.done ? "line-through" : "none",
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}
