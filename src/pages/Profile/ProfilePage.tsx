import { PageWrapper } from "../../components";
import { useRouteLoaderData } from "react-router-dom";
import { ROOT_ROUTE_ID } from "../../App";
import { callAPI, User, USER_LEVEL } from "../../helpers";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const currUser = useRouteLoaderData(ROOT_ROUTE_ID) as User;
  const isNewUser = currUser.user_level <= USER_LEVEL.RESTRICTED;

  const [state, setState] = useState({
    newUsername: "",
    newUsernameConfirm: "",
    prevPassword: isNewUser ? "password" : "",
    newPassword: "",
    newPasswordConfirm: "",
    errorMsg: "",
  });
  const updateState = (key: keyof typeof state, value: string) => {
    setState({ ...state, [key]: value });
  };

  useEffect(() => {
    // @ts-expect-error: BE returns {message: '...'} on error
    if (currUser.message) {
      window.location.pathname = "/";
    }
  }, [currUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateState("errorMsg", "");
    if (state.newUsername !== state.newUsernameConfirm) {
      updateState("errorMsg", "Usernames don't match");
      return;
    }
    if (state.newPassword !== state.newPasswordConfirm) {
      updateState("errorMsg", "Passwords don't match");
      return;
    }

    const body = {
      username: state.newUsername !== "" ? state.newUsername : undefined,
      password: state.newPassword !== "" ? state.newPassword : undefined,
      prev_password: state.prevPassword !== "" ? state.prevPassword : undefined,
    };
    const resp = await callAPI("/auth/update", { method: "POST", body });
    const json = await resp.json();
    if (json.message) {
      updateState("errorMsg", json.message);
      return;
    }
    if (json.success === true) {
      window.location.href = window.location.origin;
    }
  };

  const handleLogout = async () => {
    const resp = await callAPI("/auth/logout");
    const json = await resp.json();
    if (resp.status === 200 && json.loggedIn === false) {
      window.location.href = window.location.origin;
    } else {
      window.alert("Something went wrong, please try again.");
    }
  };

  return (
    <PageWrapper>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h5" className="underline">
          {currUser.username}
        </Typography>
        <Box>
          {!isNewUser ? (
            <Button
              variant="contained"
              color="error"
              sx={{ width: "200px" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Box
              sx={{
                border: "1px solid hotpink",
                backgroundColor: "rgba(255,182,193,0.5)",
                borderRadius: "4px",
                minWidth: "235px",
                maxWidth: "235px",
              }}
            >
              <FormHelperText
                error
                sx={{
                  wordWrap: "break-word",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <ErrorIcon color="error" sx={{ marginRight: "2px" }} />
                <br />
                Please complete your registration by changing your username and
                password. Until then, you will have limited capabilities as a
                user.
              </FormHelperText>
            </Box>
          )}
        </Box>

        <FormControl
          component="form"
          // className="space-y-2"
          onSubmit={handleSubmit}
          sx={{ width: "100%", alignItems: "center", marginTop: "1.5rem" }}
        >
          <Grid container columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
            {/* {Object.entries(currUser).map(([k, v], i) => (
            <Grid item key={i} xs={1}>
              {k + ": " + v}
            </Grid>
          ))} */}
            <Grid
              item
              xs={1}
              sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Typography className="underline">Username</Typography>
              <TextField
                value={currUser.username}
                label="Current Username"
                disabled
              />
              <TextField
                value={state.newUsername}
                label="New Username"
                onChange={(e) => updateState("newUsername", e.target.value)}
              />
              <TextField
                value={state.newUsernameConfirm}
                label="Confirm New Username"
                onChange={(e) =>
                  updateState("newUsernameConfirm", e.target.value)
                }
              />
            </Grid>
            <Grid
              item
              xs={1}
              sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Typography className="underline">Password</Typography>
              {!isNewUser && (
                <TextField
                  value={state.prevPassword}
                  label="Previous Password"
                  type="password"
                  onChange={(e) => updateState("prevPassword", e.target.value)}
                />
              )}
              <TextField
                value={state.newPassword}
                label="New Password"
                type="password"
                onChange={(e) => updateState("newPassword", e.target.value)}
              />
              <TextField
                value={state.newPasswordConfirm}
                label="Confirm New Password"
                type="password"
                onChange={(e) =>
                  updateState("newPasswordConfirm", e.target.value)
                }
              />
            </Grid>
          </Grid>
          {state.errorMsg && (
            <Box
              sx={{
                border: "1px solid hotpink",
                backgroundColor: "rgba(255,182,193,0.5)",
                borderRadius: "4px",
              }}
            >
              <FormHelperText
                error
                sx={{ maxWidth: "200px", wordWrap: "break-word" }}
              >
                {state.errorMsg}
              </FormHelperText>
            </Box>
          )}
          <Button
            variant="contained"
            type="submit"
            color="success"
            sx={{ width: "200px", marginTop: "1.5rem" }}
          >
            Update
          </Button>
        </FormControl>
      </Box>
    </PageWrapper>
  );
}
