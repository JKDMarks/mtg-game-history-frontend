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
  name: null,
  username: "x",
};

export const fakeDeck: Deck = {
  id: -1,
  name: "very cool deck but it is not real",
  Player: { ...fakePlayer },
};
