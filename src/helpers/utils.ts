import moment from "moment";
import { Deck, Game, GameLocation, Player } from "./types";
import { NewPlayerDeck, emptyNewPlayerDeck, fakeDeck } from "./constants";

export type HTTPMethod = "GET" | "POST";

export async function callAPI(
  route: string,
  options?: { method?: HTTPMethod; body?: object }
) {
  const headers = options?.body
    ? { "Content-Type": "application/json" }
    : undefined;

  return await fetch(import.meta.env.VITE_API_URL + route, {
    method: options?.method ?? "GET",
    mode: "cors",
    credentials: "include",
    body: options?.body ? JSON.stringify(options.body) : null,
    headers: {
      ...headers,
    },
  });
}

export const getURLPathnameFromRequest = (request: Request) =>
  new URL(request.url).pathname;

export const getTodaysDate = () => moment().format("YYYY-MM-DD");

export const fetchMostRecentGameOrCurrentPlayer = async (
  setNewPlayerDecks: (newPlayerDecks: NewPlayerDeck[]) => void,
  setLocation: (location: GameLocation) => void
) => {
  const resp = await callAPI("/games/recent");
  const mostRecentGame: Game = await resp.json();
  console.log("***mostRecentGame", mostRecentGame);

  if (
    mostRecentGame &&
    // CHANGEME: undo this comment
    mostRecentGame.date === getTodaysDate() &&
    mostRecentGame.GamePlayerDecks
  ) {
    const tempNewPlayerDecks = mostRecentGame.GamePlayerDecks.map(
      ({ Player, Deck }) => ({
        player: Player,
        deck: Deck,
      })
    );
    setNewPlayerDecks(tempNewPlayerDecks);
    setLocation({ ...mostRecentGame.Location });
  } else {
    const resp2 = await callAPI("/players/me");
    const me: Player = await resp2.json();
    const tempNewPlayerDecks: NewPlayerDeck[] = [
      { player: me, deck: { ...fakeDeck } },
      { ...emptyNewPlayerDeck },
      { ...emptyNewPlayerDeck },
      { ...emptyNewPlayerDeck },
    ];
    setNewPlayerDecks(tempNewPlayerDecks);
  }
};

export const fetchPlayers = async (setPlayers: (players: Player[]) => void) => {
  const resp = await callAPI("/players");
  const players: Player[] = await resp.json();
  const sortedPlayers = [...players].sort((p1, p2) =>
    p1.name.localeCompare(p2.name)
  );
  setPlayers(sortedPlayers);
};

export const fetchDecks = async (setDecks: (decks: Deck[]) => void) => {
  const resp = await callAPI("/decks");
  const decks: Deck[] = await resp.json();
  const sortedDecks = [...decks].sort(
    (d1, d2) => d1.Player.id - d2.Player.id || d1.name.localeCompare(d2.name)
  );
  setDecks(sortedDecks);
};

export const fetchLocations = async (
  setLocations: (locations: GameLocation[]) => void
) => {
  const resp = await callAPI("/locations");
  const locations: GameLocation[] = await resp.json();
  const sortedLocations = [...locations].sort((l1, l2) =>
    l1.name.localeCompare(l2.name)
  );
  setLocations(sortedLocations);
};
