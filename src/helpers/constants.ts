import { Deck, Game, Player, GameLocation } from "./types";

export const fakeLocation: GameLocation = {
  id: -1,
  name: "",
  type: "HOUSE",
};

export const fakeGame: Game = {
  id: -1,
  date: "YYYY-MM-DD",
  gameNum: -1,
  locationId: -1,
  notes: "",
  Location: { ...fakeLocation },
};

export const fakePlayer: Player = {
  id: -1,
  name: "",
};

export const fakeDeck: Deck = {
  id: -1,
  name: "",
  Player: { ...fakePlayer },
};

export type NewPlayerDeck = {
  player: Player;
  deck: Deck;
};
export const emptyNewPlayerDeck: NewPlayerDeck = {
  player: { ...fakePlayer },
  deck: { ...fakeDeck },
};

export type SetNewPlayerDeckFunctionType = ({
  player,
  deck,
}: {
  player?: Player | null;
  deck?: Deck | null;
}) => void;

export type NewGamePlayerDeckError = { player: string; deck: string };
export type NewGameErrors = {
  location: string;
  playerDecks: NewGamePlayerDeckError[];
};
export const emptyNewGamePlayerDeckError = { player: "", deck: "" };
