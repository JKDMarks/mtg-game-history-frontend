import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useRouteLoaderData } from "react-router-dom";
import { Player, callAPI } from "../helpers";
import { ROOT_ROUTE_ID } from "../App";

export default function PageWrapper({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const currPlayer = useRouteLoaderData(ROOT_ROUTE_ID) as Player;

  const theme = useTheme();
  const isMdOrLarger = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box className="min-h-screen flex flex-col">
      <AppBar position="static" className="self-start">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant={isMdOrLarger ? "h6" : "body1"}
              component={Link}
              to="/"
            >
              MTG Game History
            </Typography>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Box sx={{ flexGrow: 0 }} className="flex flex-row space-x-10">
              {isMdOrLarger ? (
                <Link to="/players/me">{currPlayer.name}</Link>
              ) : (
                <MenuIcon />
              )}
              <Link
                to="/login"
                onClick={() => callAPI("/auth/logout")}
                className="font-black"
              >
                Logout
              </Link>
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
