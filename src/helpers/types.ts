export type ChildrenPropType = JSX.Element | JSX.Element[];

export interface User {
  id: number;
  username: string;
  user_level: number;
}

export interface Game {
  id: number;
  user_id: number;
  date: string;
  notes: string | null;
  game_player_decks: GamePlayerDeck[];
}

export interface Player {
  id: number;
  user_id?: number;
  name: string;
}

export interface PlayerWithDecks extends Player {
  decks: Deck[];
}

export interface Deck {
  id: number;
  // player_id: number;
  user_id?: number;
  name: string;
  player: Player;
}

export interface DeckWithCards extends Deck {
  cards: string[];
}

export interface GamePlayerDeck {
  id: number;
  is_winner: 0 | 1;
  deck: Deck;
  player: Player;
  cards: Card[];
  first_player: 0 | 1;
  mulligan_count: number;
}

export interface Card {
  id?: number;
  name: string;
  turn_played: number | null;
}

export enum USER_LEVEL {
  BANNED = 0,
  RESTRICTED = 2,
  REGULAR_USER = 5,
  ADMIN = 9,
}

export const MULLIGANS = {
  0: "7",
  1: "2nd 7",
  2: "6",
  3: "5",
  4: "4",
  5: "3",
  6: "2",
  7: "1",
  8: "0",
};

// const game_player_decks: GamePlayerDeck[] = [
//   {
//     deck: {
//       id: 1,
//       name: "5C Omnath Landfall",
//       player: {
//         id: 1,
//         name: "Jeff Marks",
//       },
//     },
//     player: {
//       id: 1,
//       name: "Jeff Marks",
//     },
//     is_winner: 1,
//   },
// ];
// game_player_decks;
