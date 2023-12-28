import { useParams } from "react-router-dom";
import { PageWrapper, GamesGrid } from "../../components";
import { useEffect, useState } from "react";
import { Deck, Game, callAPI, fakeDeck } from "../../helpers";
import { Typography } from "@mui/material";

export default function DeckPage() {
  const { deckId } = useParams();

  const [deck, setDeck] = useState<Deck>({ ...fakeDeck });
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchDeck = async () => {
      const resp = await callAPI(`/decks/${deckId}`);
      const deck = await resp.json();
      setDeck(deck);
    };
    const fetchGames = async () => {
      const resp = await callAPI(`/games/deck/${deckId}`);
      const games = await resp.json();
      setGames(games);
    };
    fetchDeck();
    fetchGames();
  }, [deckId]);

  return (
    <PageWrapper>
      {deck.id > 0 && games.length ? (
        <>
          <Typography variant="h5" className="underline">
            {deck.Player.name}'s {deck.name}
          </Typography>
          <Typography className="text-gray-600" sx={{ marginBottom: "0.5rem" }}>
            Played in {games.length} games
          </Typography>
          <GamesGrid games={games} />
        </>
      ) : (
        <></>
      )}
    </PageWrapper>
  );
}
