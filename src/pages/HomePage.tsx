import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Grid, Link as MUILink } from "@mui/material";

import { callAPI, getPlayerName } from "../helpers/utils";
import { Game, Player } from "../helpers/types";
import { PageWrapper } from "../components";

function HomePage() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const resp = await callAPI("/games");
      const games: Game[] = await resp.json();
      // newest first
      setGames([...games].sort((gameA, gameB) => gameB.id - gameA.id));
    };

    fetchGames();
  }, []);

  return (
    <PageWrapper>
      <Box className="flex flex-col">
        <MUILink
          component={Link}
          to="/games/new"
          sx={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}
        >
          Add New Game
        </MUILink>
        <Grid
          container
          spacing={{ xs: 2, sm: 2, md: 2, lg: 2 }}
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        >
          {[...games].map((game, idx) => {
            const gameWinner = game.GamePlayerDecks?.find(
              (gpd) => gpd.isWinner
            )?.Player;
            const winnerName = getPlayerName(gameWinner as Player);
            return (
              <Grid key={idx} item xs={1} sm={1} md={1} lg={1}>
                <Button
                  variant="contained"
                  sx={{
                    minHeight: "100px",
                    width: "100%",
                    backgroundColor: "lightgray",
                    "&:hover": {
                      backgroundColor: "darkgray",
                    },
                    textTransform: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  onClick={() => navigate(`/games/${game.id}`)}
                >
                  {game.Location?.name} on {game.date}
                  <br />
                  Game #{game.gameNum}
                  {winnerName && (
                    <>
                      <br />⭐ Winner: {winnerName} ⭐
                    </>
                  )}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </PageWrapper>
  );
}

export default HomePage;
