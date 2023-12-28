export type Game = {
  id: number;
  date: string;
  gameNum: number;
  locationId: number;
  notes: string | null;
  Location: GameLocation;
  GamePlayerDecks?: GamePlayerDeck[];
};
// type LocationType = "HOUSE" | "STORE";

export type GameLocation = {
  id: number;
  name: string;
  isPublic: boolean;
  // type: LocationType;
  Games?: Game[];
};

export enum USER_LEVEL {
  BANNED = 0,
  RESTRICTED = 1,
  REGULAR_USER = 2,
  ADMIN = 9,
}

export type Player = {
  id: number;
  name: string;
  username?: string;
  userLevel?: number;
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
