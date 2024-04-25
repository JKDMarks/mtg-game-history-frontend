import { useContext, useEffect, useState } from "react";
import { Box, Button, Link, Typography } from "@mui/material";

import { callAPI, Game } from "../../helpers";
import { PageWrapper, GamesGrid } from "../../components";
import { IsLoadingContext } from "../../App";

function HomePage() {
  const { setIsLoading } = useContext(IsLoadingContext);

  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      const resp = await callAPI("/games");
      const games = await resp.json();
      // newest first

      if (!games.message) {
        setGames(
          [...(games as Game[])]
            .sort((gameA, gameB) => gameB.id - gameA.id)
            .slice(0, 8)
        );
      }
      setIsLoading(false);
    };

    fetchGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper>
      <Box className="flex flex-col">
        <Box className="flex justify-center">
          <Button
            variant="contained"
            component={Link}
            href="/games/new"
            sx={{
              width: "350px",
              // marginBottom: "1.5rem",
              fontSize: "1.25rem",
              color: "black",
              backgroundColor: "#aae0fa",
              "&:hover": {
                color: "white",
                backgroundColor: "#208dc1",
              },
            }}
          >
            Record a Game
          </Button>
        </Box>
        {games.length > 0 && (
          <Typography
            variant="h5"
            sx={{
              textDecoration: "underline",
              marginTop: "1.5rem",
              marginBottom: "0",
            }}
          >
            Most Recent Games
          </Typography>
        )}
        <GamesGrid games={games} />
      </Box>
    </PageWrapper>
  );
}

export default HomePage;
