import { Box, Button, Grid } from "@mui/material";
import { useNavigate, useRouteLoaderData } from "react-router-dom";

import { Divider } from ".";
import { Game, Player, canCurrPlayerViewGame } from "../helpers";
import { Fragment } from "react";
import { ROOT_ROUTE_ID } from "../App";

export default function GamesGrid({
  games,
  shouldShowPrivateGames = false,
}: {
  games: Game[];
  shouldShowPrivateGames?: boolean;
}) {
  const navigate = useNavigate();
  const currPlayer = useRouteLoaderData(ROOT_ROUTE_ID) as Player;

  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      sx={{ marginTop: "0" }}
    >
      {games.map((game, idx) => {
        if (!canCurrPlayerViewGame(currPlayer, game)) {
          return shouldShowPrivateGames ? (
            <Grid item key={idx} xs={1}>
              <Button
                disabled
                sx={{
                  height: "100%",
                  minHeight: "100px",
                  width: "100%",
                  backgroundColor: "lightgray",
                  textTransform: "none",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Private game
              </Button>
            </Grid>
          ) : null;
        }

        return (
          <Grid item key={idx} xs={1}>
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
                {game.Location?.name} <br /> {game.date}
                <br />
                Game #{game.gameNum}
              </Box>
              <Divider />
              <Grid container columns={7}>
                {(game.GamePlayerDecks || []).map(
                  ({ Player, Deck, isWinner }, gpdIdx) => (
                    <Fragment key={gpdIdx}>
                      <Grid
                        item
                        xs={1}
                        className="flex flex-col justify-center items-center"
                      >
                        <Box className="">{isWinner && "⭐"}</Box>
                      </Grid>
                      <Grid item xs={5}>
                        <Grid container columns={1}>
                          <Grid item xs={1} className="text-gray-700">
                            {Player.name}
                          </Grid>
                          <Grid item xs={1} className="text-gray-500">
                            {Deck.name}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        className="flex flex-col justify-center items-center"
                      >
                        <Box className="">{isWinner && "⭐"}</Box>
                      </Grid>
                      {game.GamePlayerDecks &&
                        gpdIdx + 1 < game.GamePlayerDecks.length && <Divider />}
                    </Fragment>
                  )
                )}
              </Grid>
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
}
