import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import { callAPI, Game } from "../../helpers";
import { PageWrapper, GamesGrid } from "../../components";

function HomePage() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const resp = await callAPI("/games");
      const games: Game[] = await resp.json();
      // newest first
      setGames(
        [...games].sort((gameA, gameB) => gameB.id - gameA.id).slice(0, 8)
      );
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
        <Typography variant="h5" className="underline mb-0">
          Most Recent Games
        </Typography>
        <GamesGrid games={games} />
      </Box>
    </PageWrapper>
  );
}

export default HomePage;
