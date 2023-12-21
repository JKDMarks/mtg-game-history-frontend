export type Game = {
  id: number;
  date: string;
  gameNum: number;
  locationId: number;
  notes: string | null;
  Location: GameLocation;
  GamePlayerDecks?: GamePlayerDeck[];
};
type LocationType = "HOUSE" | "STORE";

export type GameLocation = {
  id: number;
  name: string;
  type: LocationType;
  Games?: Game[];
};

export type Player = {
  id: number;
  name: string;
  username?: string;
  Decks?: Deck[];
};

export type Deck = {
  id: number;
  name: string;
  Player: Player;
};

export type GamePlayerDeck = {
  isWinner: boolean | null;
  GameId: number;
  Player: Player;
  Deck: Deck;
};
