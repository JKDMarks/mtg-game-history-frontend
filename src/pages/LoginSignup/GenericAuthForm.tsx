import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { callAPI } from "../../helpers/utils";
import { useNavigate } from "react-router-dom";

type AuthForm = "LOGIN" | "SIGNUP";

export default function GenericAuthForm({ type }: { type: AuthForm }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (type === "SIGNUP") {
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match");
        return;
      }
    }

    const apiRoute = type === "LOGIN" ? "/auth/login" : "/auth/signup";
    const resp = await callAPI(apiRoute, {
      method: "POST",
      body: { username, name, password },
    });
    const respJson = await resp.json();

    if (respJson.loggedIn === true) {
      navigate("/");
    } else {
      setErrorMsg(respJson.message);
    }
  };

  return (
    <Box className="h-screen flex flex-col justify-center items-center align-middle">
      <Box
        className="flex flex-col items-center space-y-3 py-3"
        sx={{
          width: 300,
          minHeight: 300,
          backgroundColor: "white",
          borderRadius: "7px",
        }}
      >
        <Box className="text-xl font-bold">
          {type === "LOGIN" ? "Login" : "Signup"}
        </Box>
        <Box sx={{ width: "100%", borderBottom: "1px solid black" }}></Box>
        <FormControl
          component="form"
          className="space-y-2"
          onSubmit={handleSubmit}
          sx={{ marginX: "1.5rem" }}
        >
          <TextField
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          {type === "SIGNUP" && (
            <>
              <FormHelperText sx={{ marginTop: "0 !important" }}>
                This name you will use to login. It must be 1-20 characters long
                and contain only A-Z, 0-9, and <code>_</code>.
              </FormHelperText>
              <TextField
                label="Display Name"
                onChange={(e) => setName(e.target.value)}
              />
              <FormHelperText sx={{ marginTop: "0 !important" }}>
                This name is what other players will see. Consider using a last
                name or last initial. It must be 2-63 characters long and
                contain only A-Z, <code>,.'-</code>, and spaces.
              </FormHelperText>
            </>
          )}
          <TextField
            type="password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {type === "SIGNUP" && (
            <TextField
              type="password"
              label="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <Button variant="outlined" type="submit">
            {type === "LOGIN" ? "login" : "signup"}
          </Button>
          {errorMsg && (
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
                {errorMsg}
              </FormHelperText>
            </Box>
          )}
          {type === "LOGIN" ? (
            <Box className="text-xs">
              Not a member?{" "}
              <a href="/signup" className="underline">
                Signup
              </a>
            </Box>
          ) : (
            <Box className="text-xs">
              Already a member?{" "}
              <a href="/login" className="underline">
                Login
              </a>
            </Box>
          )}
        </FormControl>
      </Box>
    </Box>
  );
}
