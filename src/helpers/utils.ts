import moment from "moment";
import { Deck, Game, Player } from "./types";
import { NewPlayerdeck, emptyNewPlayerdeck, fakeDeck } from "./constants";

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

export const getPlayerName = (player?: Player) =>
  player?.name ?? player?.username;

export const fetchMostRecentGameOrCurrentPlayer = async (
  setNewPlayerdecks: (newPlayerdecks: NewPlayerdeck[]) => void
) => {
  const resp = await callAPI("/games/recent");
  const mostRecentGame: Game = await resp.json();
  const todaysDate = moment().format("YYYY-MM-DD");

  if (
    mostRecentGame &&
    // CHANGEME: undo this comment
    // mostRecentGame.date === todaysDate &&
    mostRecentGame.GamePlayerDecks
  ) {
    const tempNewPlayerdecks = mostRecentGame.GamePlayerDecks.map(
      ({ Player, Deck }) => ({
        player: Player,
        deck: Deck,
      })
    );
    setNewPlayerdecks(tempNewPlayerdecks);
  } else {
    const resp2 = await callAPI("/players/me");
    const me: Player = await resp2.json();
    const tempNewPlayerdecks: NewPlayerdeck[] = [
      { player: me, deck: { ...fakeDeck } },
      { ...emptyNewPlayerdeck },
      { ...emptyNewPlayerdeck },
      { ...emptyNewPlayerdeck },
    ];
    setNewPlayerdecks(tempNewPlayerdecks);
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
