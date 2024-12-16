import { useParams } from "react-router-dom";
import { PageWrapper, GamesGrid, Divider } from "../../components";
import { useContext, useEffect, useState } from "react";
import {
  DeckWithCards,
  Game,
  NAME_RGX,
  callAPI,
  fakeDeck,
} from "../../helpers";
import { Button, Link, TextField, Typography } from "@mui/material";
import { IsLoadingContext } from "../../App";

export default function DeckPage() {
  const { setIsLoading } = useContext(IsLoadingContext);
  const { deckId } = useParams();

  const [deck, setDeck] = useState<DeckWithCards>({ ...fakeDeck, cards: [] });
  const [games, setGames] = useState<Game[]>([]);
  const [gameWinCt, setGameWinCt] = useState<number>(0);

  const [isEditing, setIsEditing] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");

  useEffect(() => {
    const fetchDeck = async () => {
      const resp = await callAPI(`/decks/${deckId}`);
      const deck = await resp.json();
      setDeck(deck);
      setNewDeckName(deck.name);
    };
    const fetchGames = async () => {
      const resp = await callAPI(`/games/deck/${deckId}`);
      const games = await resp.json();
      setGames(games);
    };
    const fetchData = async () => {
      setIsLoading(true);
      await fetchDeck();
      await fetchGames();
      setIsLoading(false);
    };
    fetchData();
  }, [deckId, setIsLoading]);

  useEffect(() => {
    const gamesWon = games.filter(
      (game) =>
        game.game_player_decks.find((gpd) => gpd.is_winner === 1)?.deck.id ===
        deck.id
    );
    setGameWinCt(gamesWon.length);
  }, [games, deck]);

  const handleChangeNewName: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setNewDeckName(e.target.value);
  };

  const handleSubmitNewName: React.MouseEventHandler = async () => {
    if (!newDeckName.match(NAME_RGX)) {
      window.alert("Invalid deck name");
      return;
    }

    const resp = await callAPI("/decks/" + deck.id + "/edit", {
      method: "POST",
      body: { name: newDeckName },
    });
    const json = await resp.json();
    if (json.success === true) {
      window.location.reload();
    } else {
      window.alert(json.message);
    }
  };

  const archiveOrUnarchiveDeck = async () => {
    const alertText = `${
      deck.is_archived ? "Unarchive" : "Archive"
    } this deck? Archiving a deck will prevent it from being added to new games, but will not delete its data.`;
    const confirm = window.confirm(alertText);
    if (!confirm) {
      return;
    }

    const resp = await callAPI("/decks/" + deck.id + "/edit", {
      method: "POST",
      body: { is_archived: !deck.is_archived },
    });
    const json = await resp.json();
    if (json.success === true) {
      if (json.redirect) {
        window.location.pathname = json.redirect;
      } else {
        window.location.reload();
      }
    } else {
      window.alert(json.message);
    }
  };

  return (
    <PageWrapper>
      {deck.id > 0 ? (
        <>
          {isEditing ? (
            <TextField
              size="small"
              value={newDeckName}
              onChange={handleChangeNewName}
            />
          ) : (
            <Typography variant="h5" className="underline">
              <Link href={"/players/" + deck.player.id}>
                {deck.player.name}
              </Link>
              's {deck.name} {deck.is_archived ? "(Archived)" : ""}
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
              Edit deck name
            </Button>
          )}
          <br />
          <Button
            size="small"
            variant="contained"
            color="secondary"
            style={{ margin: "0.25rem 0" }}
            onClick={() => archiveOrUnarchiveDeck()}
          >
            {deck.is_archived ? "Unarchive" : "Archive"} Deck
          </Button>
          <Typography
            className="text-gray-600"
            sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
          >
            Played in {games.length} games
          </Typography>
          <Typography className="text-gray-600">
            Won {gameWinCt} games (
            {((gameWinCt / games.length) * 100).toFixed(2)}%)
          </Typography>
          {deck.cards?.length > 0 && (
            <>
              <Divider margins />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Cards in deck
              </Typography>
              <ul>
                {deck.cards.map((cardName, i) => (
                  <li key={i}>{cardName}</li>
                ))}
              </ul>
              <Divider margins />
            </>
          )}
          <GamesGrid games={games} shouldShowPrivateGames />
        </>
      ) : (
        <></>
      )}
    </PageWrapper>
  );
}
