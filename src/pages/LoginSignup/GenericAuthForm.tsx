import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { callAPI } from "../../helpers";
import { Divider } from "../../components";

type AuthForm = "LOGIN" | "SIGNUP";

export default function GenericAuthForm({ type }: { type: AuthForm }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
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
      body: { username, password },
    });
    const respJson = await resp.json();

    if (respJson.loggedIn === true) {
      // navigate twice to force refresh root route loader
      navigate("/", { replace: true });
      navigate("/", { replace: true });
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
        <Divider />
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
                This is the name you will use to login. It must be 1-20
                characters long. It can use only A-Z (upper or lower), 0-9, and{" "}
                <code>_</code>.
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
