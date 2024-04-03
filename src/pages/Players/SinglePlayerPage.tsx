import { useParams } from "react-router-dom";
import { Divider, PageWrapper, GamesGrid } from "../../components";
import { Grid, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Game, PlayerWithDecks, callAPI, fakePlayer } from "../../helpers";

export default function SinglePlayerPage() {
  const { playerId } = useParams();

  const [games, setGames] = useState<Game[]>([]);
  const [player, setPlayer] = useState<PlayerWithDecks>({
    ...fakePlayer,
    decks: [],
  });
  const [gameWinCt, setGameWinCt] = useState<number>(0);

  useEffect(() => {
    const fetchPlayer = async () => {
      const resp = await callAPI(`/players/${playerId}`);
      const player = await resp.json();
      setPlayer(player);
    };
    const fetchGames = async () => {
      const resp = await callAPI(`/games/player/${playerId}`);
      const games = await resp.json();
      setGames(games);
    };
    fetchPlayer();
    fetchGames();
  }, [playerId]);

  useEffect(() => {
    const gamesWon = games.filter(
      (game) =>
        game.game_player_decks.find((gpd) => gpd.is_winner === 1)?.player.id ===
        player.id
    );
    setGameWinCt(gamesWon.length);
  }, [games, player]);

  return (
    <PageWrapper>
      {player.id > 0 ? (
        <>
          <Typography variant="h5" className="underline">
            {player.name}
          </Typography>
          <Typography className="text-gray-600">
            Played in {games.length} games
          </Typography>
          <Typography className="text-gray-600">
            Won {gameWinCt} games (
            {((gameWinCt / games.length) * 100).toFixed(2)}%)
          </Typography>
          {!!player.decks?.length && (
            <>
              <Divider margins />
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
                {player.decks.map(({ id, name }, i) => (
                  <Grid item key={i} xs={1}>
                    <Link href={`/decks/${id}`}>{name}</Link>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          {games.length > 0 && (
            <>
              <Divider margins />
              <GamesGrid games={games} shouldShowPrivateGames />
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </PageWrapper>
  );
}
