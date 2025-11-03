import { useCallback, useState } from "react";
import { IconButton, Box, TextField, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

export interface AddNewProps {
  idArgs: any;
  add: (args: any) => void;
}

export default function AddNewItem(props: AddNewProps) {
  const [name, setName] = useState("");
  const { idArgs, add } = props;

  const onClick = useCallback(() => {
    if (name) {
      add({ ...idArgs, name });
      setName("");
    }
  }, [idArgs, name]);

  return (
    <Box
      sx={{
        marginLeft: "32px",
        display: "flex",
        alignItems: "flex-end",
        width: "80%",
      }}
    >
      <AddIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
      <TextField
        id="add-new"
        placeholder="Add new"
        variant="standard"
        fullWidth
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setName(event.target.value);
        }}
        slotProps={{
          input: {
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Add"
                  onClick={onClick}
                  edge="end"
                  sx={{
                    color: name ? "green" : "gray",
                    pointerEvents: name ? "auto" : "none",
                    marginRight: "5px",
                  }}
                >
                  <CheckIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
