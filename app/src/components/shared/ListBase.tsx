import { type ReactElement } from "react";
import { Box, Skeleton } from "@mui/material";

export interface ListBaseProps {
  items: any[];
  render: (value: any) => ReactElement;
  isLoading?: boolean;
}
export default function ListBase(props: ListBaseProps) {
  const { items, render, isLoading = false } = props;

  return (
    <Box
      sx={{
        flex: 3,
        width: "80%",
        "& > *": {
          margin: 1, // Add margin to all children
          width: "100%",
        },
      }}
    >
      {isLoading
        ? [...Array(10).keys()].map((x) => (
            <Skeleton key={x} variant="rectangular" sx={{ mb: 1 }} />
          ))
        : items.map(render)}
    </Box>
  );
}
