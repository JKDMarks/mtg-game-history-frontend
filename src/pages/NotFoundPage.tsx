import { Box } from "@mui/material";

export default function NotFoundPage() {
  return (
    <Box
      className="h-full flex-1 flex flex-col justify-center items-center align-middle"
      sx={{
        paddingY: {
          xs: "0.75rem",
          sm: "2.0rem",
        },
      }}
    >
      <Box
        className="p-3"
        sx={{
          width: { xs: 300 },
          backgroundColor: "white",
          borderRadius: "7px",
        }}
      >
        <div>how'd you get here?</div>
        <a href="/" className="underline">
          go home
        </a>
      </Box>
    </Box>
  );
}
