import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Grid } from "@mui/material";

import { callAPI, Game } from "../helpers";
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
        <Box className="flex justify-center">
          <Button
            variant="contained"
            component={Link}
            to="/games/new"
            sx={{
              width: "350px",
              marginBottom: "1.5rem",
              fontSize: "1.25rem",
              color: "black",
              backgroundColor: "#aae0fa",
              "&:hover": {
                color: "white",
                backgroundColor: "#208dc1",
              },
            }}
          >
            Create New Game
          </Button>
        </Box>
        <Grid
          container
          spacing={{ xs: 2, sm: 2, md: 2, lg: 2 }}
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        >
          {games.map((game, idx) => {
            return (
              <Grid key={idx} item xs={1} sm={1} md={1} lg={1}>
                <Button
                  variant="contained"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
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
                  <Box>
                    {game.Location?.name} on {game.date}
                    <br />
                    Game #{game.gameNum}
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      borderBottom: "1px solid black",
                    }}
                  />
                  {(game.GamePlayerDecks || []).map(({ Player, isWinner }) => (
                    <Box>
                      {isWinner && "⭐"}
                      {Player.name}
                      {isWinner && "⭐"}
                    </Box>
                  ))}
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
