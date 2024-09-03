import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Game,
  fakeGame,
  callAPI,
  canCurrUserViewGame,
  User,
  USER_LEVEL,
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
      if (
        game.id === undefined ||
        (game.id > 0 && !canCurrUserViewGame(currUser, game))
      ) {
        navigate("/");
        return;
      }
      setGame(game);
    };

    fetchData();
  }, [gameId, currUser, navigate]);

  return (
    <PageWrapper>
      <Box className="flex flex-col items-center">
        {game.id > 0 && (
          <>
            <Typography variant="h5" className="underline">
              {currUser.user_level >= USER_LEVEL.ADMIN && game.id + " — "}
              {game.date}
            </Typography>
            <Button
              variant="contained"
              color="info"
              size="small"
              sx={{ maxWidth: "150px", marginBottom: "0.75rem" }}
              onClick={() => navigate(`/games/${gameId}/edit`)}
            >
              Edit Game
            </Button>
            <Grid
              container
              spacing={2}
              columns={{ xs: 1, md: 2, lg: 4 }}
              sx={{ justifyContent: "center" }}
            >
              {game.game_player_decks?.map(
                ({ player, deck, is_winner, cards }, gpdIdx) => {
                  const didPlayOwnDeck = player.id === deck.player?.id;
                  return (
                    <Grid item key={gpdIdx} xs={1} md={1} lg={1}>
                      {Boolean(is_winner) && "⭐"}
                      <Link href={`/players/${player.id}`}>{player.name}</Link>
                      {Boolean(is_winner) && "⭐"}
                      <br />
                      <Link href={`/decks/${deck.id}`}>
                        {!didPlayOwnDeck && `${deck.player.name}'s `}
                        {deck.name}
                      </Link>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {cards.length > 0 && (
                          <>
                            <Box
                              sx={{
                                marginTop: "5px",
                                textDecoration: "underline",
                              }}
                            >
                              Cards Played
                            </Box>
                            {cards.map((card, idx) => (
                              <Box key={"card-" + idx}>
                                {card.name}
                                {card.turn_played &&
                                  " played on turn " + card.turn_played}
                              </Box>
                            ))}
                          </>
                        )}
                      </Box>
                    </Grid>
                  );
                }
              )}
              {game.notes && (
                <>
                  <Grid item xs={1} lg={2} sx={{ whiteSpace: "pre-wrap" }}>
                    <Box sx={{ border: "1px solid black", padding: "5px" }}>
                      <Box sx={{ textDecoration: "underline" }}>Notes</Box>
                      <Box>{game.notes}</Box>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </>
        )}
      </Box>
    </PageWrapper>
  );
}
