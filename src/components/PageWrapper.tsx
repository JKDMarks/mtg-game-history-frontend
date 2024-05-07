import {
  AppBar,
  Box,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ErrorIcon from "@mui/icons-material/Error";
import { useRouteLoaderData } from "react-router-dom";
import { ChildrenPropType, User, USER_LEVEL } from "../helpers";
import { ROOT_ROUTE_ID } from "../App";
import { useState } from "react";

type AppBarPage = { label: string; link: string; isImportant?: boolean };

export default function PageWrapper({
  children,
}: {
  children: ChildrenPropType;
}) {
  const currUser = useRouteLoaderData(ROOT_ROUTE_ID) as User;
  const isLoggedIn = !!currUser && currUser.id && currUser.id > 0;
  const navigate = (url: string) => {
    window.location.href = window.location.origin + url;
  };

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
    label: "Record a Game",
    link: "/games/new",
  };
  const gamesPage: AppBarPage = { label: "Previous Games", link: "/games" };
  const playersPage: AppBarPage = { label: "Players", link: "/players" };
  // const decksPage: AppBarPage = { label: "Decks", link: "/decks" };

  const appBarPages: AppBarPage[] = [createNewGamePage, gamesPage, playersPage];

  const LINK_STYLING = { color: "white", textDecoration: "none" };

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
            <Box
              className="flex flex-row items-center space-x-2"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
              title={
                '"After his death, monks spent ten years transcribing the tattoos from Reki\'s body and gathering stories from those who spoke with him. Thus the volume you hold was written." —The History of Kamigawa'
              }
            >
              <img
                style={{
                  maxWidth: "25px",
                  maxHeight: "25px",
                }}
                src="/hex.png"
              />
              <Box className="text-xl font-bold">Saga</Box>
            </Box>
            {isMdOrLarger ? (
              <>
                {appBarPages.map((page, i) => (
                  <Link
                    key={i}
                    href={page.link}
                    className="tracking-wider"
                    color="#ffffff"
                    sx={{ ...LINK_STYLING, marginLeft: "1.75rem" }}
                  >
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
              {isLoggedIn && (
                <Link
                  href={`/profile`}
                  sx={{
                    ...LINK_STYLING,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {currUser.user_level <= USER_LEVEL.RESTRICTED && (
                    <ErrorIcon color="error" sx={{ marginRight: "2px" }} />
                  )}
                  {currUser.username}
                </Link>
              )}
              {/* {isLoggedIn &&
                currUser?.user_level >= USER_LEVEL.REGULAR_USER && (
                  <Link
                    href="/login"
                    onClick={() => callAPI("/auth/logout")}
                    className="font-black"
                    sx={{ ...LINK_STYLING, fontWeight: "bold" }}
                  >
                    Logout
                  </Link>
                )} */}
              {!isLoggedIn && (
                <Link
                  href="/login"
                  onClick={() => navigate("/")}
                  className="font-black"
                  sx={{ ...LINK_STYLING, fontWeight: "bold" }}
                >
                  Login
                </Link>
              )}
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
