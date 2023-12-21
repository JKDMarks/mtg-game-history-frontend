import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { callAPI } from "../helpers";

export default function PageWrapper({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <Box className="min-h-screen flex flex-col">
      <AppBar position="static" className="self-start">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="h6" component={Link} to="/">
              MTG Game History
            </Typography>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Box sx={{ flexGrow: 0 }}>
              <Link to="/login" onClick={() => callAPI("/auth/logout")}>
                Logout
              </Link>{" "}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
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
          //   className="flex flex-col items-center space-y-3 py-3"
          className="p-3"
          sx={{
            width: { xs: 300, sm: 550, md: 850, lg: 1100 },
            backgroundColor: "white",
            borderRadius: "7px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
