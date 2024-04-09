import moment from "moment";
import { Deck, Game, PlayerWithDecks, User, USER_LEVEL } from "./types";
import { NewPlayerDeck } from "./constants";

export const canCurrUserViewGame = (currUser: User, game: Game) => {
  const currPlayerIsAdmin =
    currUser.user_level !== undefined &&
    currUser.user_level >= USER_LEVEL.ADMIN;

  return currPlayerIsAdmin || game.user_id === currUser.id;
};

export type HTTPMethod = "GET" | "POST";

export async function callAPI(
  route: string,
  options?: { method?: HTTPMethod; body?: object }
) {
  const headers = options?.body
    ? { "Content-Type": "application/json" }
    : undefined;

  return await fetch(process.env.API_URL + route, {
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

export const fetchMostRecentGame = async (
  setNewPlayerDecks: (newPlayerDecks: NewPlayerDeck[]) => void
) => {
  const resp = await callAPI("/games/recent");
  const mostRecentGame: Game = await resp.json();

  if (
    mostRecentGame &&
    mostRecentGame.date === getTodaysDate() &&
    mostRecentGame.game_player_decks
  ) {
    const tempNewPlayerDecks = mostRecentGame.game_player_decks.map(
      ({ player, deck }) => ({ player, deck })
    );
    setNewPlayerDecks(tempNewPlayerDecks);
  }
};

export const fetchPlayers = async (
  setPlayers: (players: PlayerWithDecks[]) => void
) => {
  const resp = await callAPI("/players");
  const players: PlayerWithDecks[] = await resp.json();
  const sortedPlayers = [...players].sort((p1, p2) =>
    p1.name.localeCompare(p2.name)
  );
  setPlayers(sortedPlayers);
};

export const fetchDecks = async (setDecks: (decks: Deck[]) => void) => {
  const resp = await callAPI("/decks");
  const decks: Deck[] = await resp.json();
  const sortedDecks = [...decks].sort(
    (d1, d2) => d1.player.id - d2.player.id || d1.name.localeCompare(d2.name)
  );
  setDecks(sortedDecks);
};

export const fetchGames = async (setGames: (games: Game[]) => void) => {
  const resp = await callAPI("/games");
  const games: Game[] = await resp.json();
  setGames(games);
};
