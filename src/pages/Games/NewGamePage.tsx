import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { PageWrapper } from "../../components";
import { useEffect, useState } from "react";
import { Player } from "../../helpers/types";
import { callAPI, getPlayerName } from "../../helpers/utils";

export default function NewGamePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [decks, setDecks] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const resp = await callAPI("/players");
      const players = await resp.json();
      setPlayers(players);
    };
    const fetchDecks = async () => {
      const resp = await callAPI("/decks");
      const decks = await resp.json();
      setDecks(decks);
    };

    fetchPlayers();
    fetchDecks();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <PageWrapper>
      <Box className="flex flex-col">
        <Typography
          variant="h5"
          className="underline"
          sx={{ marginBottom: "0.75rem" }}
        >
          Create New Game
        </Typography>
        <FormControl component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 1, md: 2, lg: 4 }}>
            <Grid item xs={1}>
              <Grid container columns={1}>
                <Grid item xs={1}>
                  <Select label="Player 1" sx={{ width: "100%" }}>
                    {players.map((player) => (
                      <MenuItem value={player.username}>
                        {getPlayerName(player)}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={1}>
                  bottom
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <Grid container columns={1}>
                <Grid item xs={1}>
                  <Select label="Player 1" sx={{ width: "100%", color: "red" }}>
                    {players.map((player) => (
                      <MenuItem value={player.id}>
                        {getPlayerName(player)}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={1}>
                  bottom
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <Grid container columns={1}>
                <Grid item xs={1}>
                  top
                </Grid>
                <Grid item xs={1}>
                  bottom
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <Grid container columns={1}>
                <Grid item xs={1}>
                  top
                </Grid>
                <Grid item xs={1}>
                  bottom
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FormControl>
      </Box>
    </PageWrapper>
  );
}
