import { useEffect, useState } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export interface PanelHeaderProps {
  title?: string;
  mode?: "primary" | "secondary";
  onSearch: (term: string) => void;
  clearSearch?: boolean;
}

export default function PanelHeader(props: PanelHeaderProps) {
  const { mode = "primary", title, clearSearch = false } = props;
  const [searchTerm, setSearchTerm] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setSearchTerm(val);
  };

  useEffect(() => {
    if (clearSearch) {
      setSearchTerm("");
    }
  }, [clearSearch]);

  return (
    <Box sx={{ paddingBottom: 1 }}>
      {title && (
        <Typography
          variant={mode === "primary" ? "h4" : "h5"}
          sx={{
            fontFamily: "Inter",
          }}
        >
          {title}
        </Typography>
      )}
      <TextField
        id="search"
        fullWidth
        label="Search"
        variant="outlined"
        size="small"
        onChange={onChange}
        value={searchTerm}
        slotProps={{
          input: {
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
