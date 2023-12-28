import { useParams } from "react-router-dom";
import { PageWrapper } from "../../components";
import { Box, Grid, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Game, fakeGame, callAPI } from "../../helpers";

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
              {game.GamePlayerDecks?.map((gpd, gpdIdx) => {
                const player = gpd.Player;
                const deck = gpd.Deck;
                const didPlayOwnDeck = player.id === deck.Player?.id;
                return (
                  <Grid key={gpdIdx} item xs={1} md={1} lg={1}>
                    {gpd.isWinner && "⭐"}
                    <Link href={`/players/${player.id}`}>
                      {gpd.Player.name}
                    </Link>
                    {gpd.isWinner && "⭐"}
                    <br />
                    <Link href={`/decks/${deck.id}`}>
                      {!didPlayOwnDeck && `${gpd.Deck.Player.name}'s `}
                      {gpd.Deck.name}
                    </Link>
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
