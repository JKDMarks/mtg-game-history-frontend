import { Card, Deck, Game, Player } from "./types";

export const NAME_RGX = /^[a-z0-9\s,.'\-)(]+$/i;

export const fakeGame: Game = {
  id: -1,
  user_id: -1,
  date: "YYYY-MM-DD",
  notes: "",
  game_player_decks: [],
};

export const fakePlayer: Player = {
  id: -1,
  name: "",
};

export const fakeDeck: Deck = {
  id: -1,
  name: "",
  player: { ...fakePlayer },
};

export const fakeCard: Card = {
  name: "",
  turn_played: null,
};

export type NewPlayerDeck = {
  player: Player;
  deck: Deck;
  cards: Card[];
};
export const emptyNewPlayerDeck: NewPlayerDeck = {
  player: { ...fakePlayer },
  deck: { ...fakeDeck },
  cards: [],
};

export type SetNewPlayerDeckFunctionType = ({
  player,
  deck,
  cards,
}: {
  player?: Player | null;
  deck?: Deck | null;
  cards?: Card[] | null;
}) => void;

export type NewGamePlayerDeckError = { player: string; deck: string };
export type NewGameErrors = {
  playerDecks: NewGamePlayerDeckError[];
};
export const emptyNewGamePlayerDeckError = { player: "", deck: "" };
