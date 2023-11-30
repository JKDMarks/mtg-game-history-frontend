import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { callAPI } from "../utils";
import { useNavigate } from "react-router-dom";
import { PLAYER_AUTH_KEY } from "../constants";

export default function LoginPage() {
  const navigate = useNavigate();
  const [cardNames, setCardNames] = useState<Array<string>>([]);
  const [username, setUsername] = useState<string>("");
  const [favoriteCard, setFavoriteCard] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("https://api.scryfall.com/catalog/card-names");
      const scryfallObj = await resp.json();
      setCardNames(
        scryfallObj.data.filter(
          (cardName: string) => !cardName.startsWith("A-")
        )
      );
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const resp = await callAPI("/auth/login", {
      method: "POST",
      body: { username, favoriteCard },
    });
    const respText = await resp.text();
    if (resp.status !== 200) {
      setErrorMsg(respText);
    } else {
      localStorage.setItem(PLAYER_AUTH_KEY, respText);
      navigate("/");
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
        <Box className="text-xl font-bold">Login</Box>
        <Box sx={{ width: "100%", borderBottom: "1px solid black" }}></Box>
        <FormControl
          component="form"
          className="space-y-2"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Autocomplete
            options={cardNames}
            renderInput={(params) => (
              <TextField {...params} label="Favorite Card" />
            )}
            onChange={(_, value) => setFavoriteCard(value as string)}
          />
          <Button variant="outlined" type="submit">
            login
          </Button>
          <Box className="text-xs">
            Not a member?{" "}
            <a href="/signup" className="underline">
              Signup
            </a>
          </Box>
          {errorMsg && (
            <FormHelperText error sx={{ maxWidth: "200px" }}>
              {errorMsg}
            </FormHelperText>
          )}
        </FormControl>
      </Box>
    </Box>
  );
}
