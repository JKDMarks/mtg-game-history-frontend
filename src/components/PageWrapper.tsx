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
import { User, callAPI } from "../helpers";
import { ROOT_ROUTE_ID } from "../App";
import { useState } from "react";

type AppBarPage = { label: string; link: string; isImportant?: boolean };

export default function PageWrapper({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const currUser = useRouteLoaderData(ROOT_ROUTE_ID) as User;
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

  const createNewGamePage: AppBarPage = {
    label: "Create New Game",
    link: "/games/new",
  };
  const gamesPage: AppBarPage = { label: "All Games", link: "/games" };
  // const playersPage: AppBarPage = { label: "Players", link: "/players" };
  const decksPage: AppBarPage = { label: "Decks", link: "/decks" };
  const myProfilePage: AppBarPage = {
    label: "My Profile",
    link: `/users/${currUser.id}`,
  };
  const appBarPages: AppBarPage[] = [createNewGamePage, gamesPage, decksPage];
  if (!isMdOrLarger) {
    appBarPages.push(myProfilePage);
  }

  return (
    <Box className="min-h-screen flex flex-col">
      <AppBar position="static" className="self-start">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="flex flex-row items-center">
            {isMdOrLarger ? null : (
              <>
                <IconButton
                  size="large"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  sx={{ padding: "0", marginRight: "0.5rem" }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                >
                  {appBarPages.map((page, i) => (
                    <MenuItem key={i} onClick={() => navigate(page.link)}>
                      <Typography textAlign="center">{page.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
            <Link className="text-xl font-bold" to="/">
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
                <Link to={`/users/${currUser.id}`}>{currUser.username}</Link>
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
