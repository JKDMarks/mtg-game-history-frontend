import { useParams } from "react-router-dom";
import { PageWrapper } from "../../hocs";
import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Game } from "../../helpers/types";
import { fakeGame } from "../../helpers/constants";
import { callAPI, getPlayerName } from "../../helpers/utils";

export default function NewGamePage() {
  const { gameId } = useParams();

  const [game, setGame] = useState<Game>(fakeGame);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await callAPI(`/games/${gameId}`);
      const game = await resp.json();
      setGame(game);
    };

    fetchData();
  }, [gameId]);

  return (
    <PageWrapper>
      <Box className="flex flex-col">
        {game.id > 0 && (
          <>
            <Typography
              variant="h5"
              className="underline"
              sx={{ marginBottom: "0.75rem" }}
            >
              {game.Location?.name} on {game.date}, game #{game.gameNum}
            </Typography>
            <Grid container spacing={2} columns={{ xs: 1, md: 2, lg: 4 }}>
              {game.GamePlayerDecks?.map((gpd) => {
                const player = gpd.Player;
                const deck = gpd.Deck;
                const didPlayOwnDeck = player.id === deck.Player?.id;
                return (
                  <Grid item xs={1} md={1} lg={1}>
                    {gpd.isWinner && "⭐"}
                    {getPlayerName(gpd.Player)}
                    {gpd.isWinner && "⭐"}
                    <br />
                    {!didPlayOwnDeck && getPlayerName(gpd.Deck.Player) + "'s "}
                    {gpd.Deck.name}
                  </Grid>
                );
              })}
            </Grid>
            {game.notes && <Box>Notes: {game.notes}</Box>}
          </>
        )}
      </Box>
    </PageWrapper>
  );
}
