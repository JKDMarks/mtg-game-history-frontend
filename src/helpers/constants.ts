import { Deck, Game, Player } from "./types";

export const fakeGame: Game = {
  id: -1,
  date: "YYYY-MM-DD",
  gameNum: -1,
  locationId: -1,
  notes: "",
  Location: {
    name: "",
    type: "HOUSE",
  },
};

export const fakePlayer: Player = {
  id: -1,
  name: "",
  username: "",
};

export const fakeDeck: Deck = {
  id: -1,
  name: "",
  Player: { ...fakePlayer },
};

export type NewPlayerdeck = {
  player: Player;
  deck: Deck;
};

export const emptyNewPlayerdeck: NewPlayerdeck = {
  player: { ...fakePlayer },
  deck: { ...fakeDeck },
};

export type SetNewPlayerdeckFunctionType = ({
  player,
  deck,
}: {
  player?: Player | null;
  deck?: Deck | null;
}) => void;
