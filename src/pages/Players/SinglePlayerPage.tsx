import { useParams } from "react-router-dom";
import { Divider, PageWrapper, GamesGrid } from "../../components";
import { Button, Grid, Link, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  Game,
  NAME_RGX,
  PlayerWithDecks,
  callAPI,
  fakePlayer,
} from "../../helpers";
import { IsLoadingContext } from "../../App";

export default function SinglePlayerPage() {
  const { setIsLoading } = useContext(IsLoadingContext);
  const { playerId } = useParams();

  const [games, setGames] = useState<Game[]>([]);
  const [player, setPlayer] = useState<PlayerWithDecks>({
    ...fakePlayer,
    decks: [],
  });
  const [gameWinCt, setGameWinCt] = useState<number>(0);

  const [isEditing, setIsEditing] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  useEffect(() => {
    const fetchPlayer = async () => {
      const resp = await callAPI(`/players/${playerId}`);
      const player = (await resp.json()) as PlayerWithDecks;
      setPlayer(player);
      setNewPlayerName(player.name);
    };
    const fetchGames = async () => {
      const resp = await callAPI(`/games/player/${playerId}`);
      const games = (await resp.json()) as Game[];
      setGames(games);
    };
    const fetchData = async () => {
      setIsLoading(true);
      await fetchPlayer();
      await fetchGames();
      setIsLoading(false);
    };
    fetchData();
  }, [playerId, setIsLoading]);

  useEffect(() => {
    const gamesWon = games.filter(
      (game) =>
        game.game_player_decks.find((gpd) => gpd.is_winner === 1)?.player.id ===
        player.id
    );
    setGameWinCt(gamesWon.length);
  }, [games, player]);

  const handleChangeNewName: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setNewPlayerName(e.target.value);
  };

  const handleSubmitNewName: React.MouseEventHandler = async () => {
    if (!newPlayerName.match(NAME_RGX)) {
      window.alert("Invalid deck name");
      return;
    }

    const resp = await callAPI("/players/" + player.id + "/edit", {
      method: "POST",
      body: { name: newPlayerName },
    });
    const json = await resp.json();
    if (json.success === true) {
      window.location.reload();
    } else {
      window.alert(json.message);
    }
  };

  return (
    <PageWrapper>
      {player.id > 0 ? (
        <>
          {isEditing ? (
            <TextField
              size="small"
              value={newPlayerName}
              onChange={handleChangeNewName}
            />
          ) : (
            <Typography variant="h5" className="underline">
              {player.name}
            </Typography>
          )}
          {isEditing ? (
            <Button
              size="small"
              variant="contained"
              color="success"
              style={{ marginTop: "0.25rem" }}
              onClick={handleSubmitNewName}
            >
              Submit name change
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="info"
              onClick={() => setIsEditing(true)}
            >
              Edit player name
            </Button>
          )}
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
