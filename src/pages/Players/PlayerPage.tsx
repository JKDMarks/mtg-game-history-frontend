import { useParams, useRouteLoaderData } from "react-router-dom";
import { Divider, PageWrapper, GamesGrid } from "../../components";
import { Grid, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Game, Player, callAPI, fakePlayer } from "../../helpers";
import { ROOT_ROUTE_ID } from "../../App";

export default function PlayerPage({ me }: { me?: boolean }) {
  const { playerId } = useParams();
  const currPlayer = useRouteLoaderData(ROOT_ROUTE_ID) as Player;

  const [games, setGames] = useState<Game[]>([]);
  const [player, setPlayer] = useState<Player>({ ...fakePlayer });

  useEffect(() => {
    const fetchPlayer = async () => {
      const resp = await callAPI(`/players/${me ? currPlayer.id : playerId}`);
      const player = await resp.json();
      setPlayer(player);
    };
    const fetchGames = async () => {
      const resp = await callAPI(
        `/games/player/${me ? currPlayer.id : playerId}`
      );
      const games = await resp.json();
      setGames(games);
    };
    fetchPlayer();
    fetchGames();
  }, [me, currPlayer, playerId]);

  return (
    <PageWrapper>
      {player.id > 0 && games.length > 0 ? (
        <>
          <Typography variant="h5" className="underline">
            {player.name}
          </Typography>
          <Typography className="text-gray-600">
            Played in {games.length} games
          </Typography>
          <Divider margins />
          {!!player.Decks?.length && (
            <>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Decks
              </Typography>
              <Grid
                container
                spacing={1}
                columns={{
                  xs: 1,
                  //, sm: 2, md: 3, lg: 4
                }}
                sx={{
                  marginTop: "-8px",
                }}
              >
                {player.Decks.map(({ id, name }) => (
                  <Grid item xs={1}>
                    <Link href={`/decks/${id}`}>{name}</Link>
                  </Grid>
                ))}
              </Grid>
              <Divider margins />
            </>
          )}
          <GamesGrid games={games} />
        </>
      ) : (
        <></>
      )}
    </PageWrapper>
  );
}
