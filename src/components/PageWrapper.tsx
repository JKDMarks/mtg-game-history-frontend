import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import { Player, callAPI } from "../helpers";
import { ROOT_ROUTE_ID } from "../App";
import { useState } from "react";

const appBarPages = [
  { label: "Create New Game", link: "/games/new" },
  { label: "Players", link: "/players" },
  // { label: "Decks", link: "/decks" },
];

export default function PageWrapper({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const currPlayer = useRouteLoaderData(ROOT_ROUTE_ID) as Player;
  const navigate = useNavigate();

  const theme = useTheme();
  const isMdOrLarger = useMediaQuery(theme.breakpoints.up("md"));

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box className="min-h-screen flex flex-col">
      <AppBar position="static" className="self-start">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="flex flex-row items-center">
            {isMdOrLarger ? null : (
              <>
                <IconButton
                  size="large"
                  // aria-label="navigate actions"
                  // aria-controls="menu-appbar"
                  // aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  sx={{ padding: "0", marginRight: "0.5rem" }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  // anchorOrigin={{
                  //   vertical: "bottom",
                  //   horizontal: "left",
                  // }}
                  // keepMounted
                  // transformOrigin={{
                  //   vertical: "top",
                  //   horizontal: "left",
                  // }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  // sx={{
                  //   display: { xs: "block", md: "none" },
                  // }}
                >
                  {appBarPages.map((page, i) => (
                    <MenuItem key={i} onClick={() => navigate(page.link)}>
                      <Typography textAlign="center">{page.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
            <Link
              // variant={isMdOrLarger ? "h6" : "body1"}
              // component={Link}
              className="text-xl font-bold"
              to="/"
            >
              MTG Game History
            </Link>
            {isMdOrLarger ? (
              <>
                {appBarPages.map((page, i) => (
                  <Link key={i} to={page.link} className="ml-7 tracking-wider">
                    {page.label.toUpperCase()}
                  </Link>
                ))}
              </>
            ) : null}
            <Box sx={{ flexGrow: 1 }}></Box>
            <Box
              sx={{ flexGrow: 0 }}
              className="flex flex-row space-x-10 align-center"
            >
              {isMdOrLarger ? (
                <Link to={`/players/${currPlayer.id}`}>{currPlayer.name}</Link>
              ) : null}
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
