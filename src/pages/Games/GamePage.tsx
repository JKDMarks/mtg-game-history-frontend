import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { Box, Grid, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Game,
  fakeGame,
  callAPI,
  canCurrUserViewGame,
  User,
} from "../../helpers";

import { PageWrapper } from "../../components";
import { ROOT_ROUTE_ID } from "../../App";

export default function GamePage() {
  const { gameId } = useParams();
  const currUser = useRouteLoaderData(ROOT_ROUTE_ID) as User;
  const navigate = useNavigate();

  const [game, setGame] = useState<Game>(fakeGame);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await callAPI(`/games/${gameId}`);
      const game = await resp.json();
      setGame(game);
    };

    fetchData();
  }, [gameId]);

  useEffect(() => {
    if (game.id > 0 && !canCurrUserViewGame(currUser, game)) {
      navigate("/");
    }
  }, [currUser, navigate, game]);

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
              {game.id} -- {game.date}
            </Typography>
            <Grid container spacing={2} columns={{ xs: 1, md: 2, lg: 4 }}>
              {game.game_player_decks?.map(
                ({ player, deck, is_winner }, gpdIdx) => {
                  const didPlayOwnDeck = player.id === deck.player?.id;
                  return (
                    <Grid key={gpdIdx} item xs={1} md={1} lg={1}>
                      {Boolean(is_winner) && "⭐"}
                      <Link href={`/players/${player.id}`}>{player.name}</Link>
                      {Boolean(is_winner) && "⭐"}
                      <br />
                      <Link href={`/decks/${deck.id}`}>
                        {!didPlayOwnDeck && `${deck.player.name}'s `}
                        {deck.name}
                      </Link>
                    </Grid>
                  );
                }
              )}
            </Grid>
            {game.notes && <Box>Notes: {game.notes}</Box>}
          </>
        )}
      </Box>
    </PageWrapper>
  );
}
