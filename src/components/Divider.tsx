import { Box } from "@mui/material";

export default function Divider({ margins }: { margins?: boolean }) {
  return (
    <Box
      sx={{
        width: "100%",
        borderBottom: "1px solid black",
        marginY: margins ? "0.5rem" : "0",
      }}
    />
  );
}
