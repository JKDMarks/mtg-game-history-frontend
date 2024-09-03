import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  NativeSelect,
  Select,
  Switch,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Card,
  Deck,
  NewGameErrors,
  NewPlayerDeck,
  Player,
  SetNewPlayerDeckFunctionType,
} from "../../helpers";
import SinglePlayerDeckCards from "./SinglePlayerDeckCards";

type NewGameSinglePlayerDeckProps = {
  index: number;
  newPlayerDeck: NewPlayerDeck;
  isWinner: boolean;
  handleChangeIsWinnerSwitch: (checked: boolean) => void;
  clearNthPlayer: (index: number) => void;
  selectedPlayerIds: Set<number>;
  selectedDeckIds: Set<number>;
  players: Player[];
  decks: Deck[];
  errors: NewGameErrors;
  setNewPlayerDeck: SetNewPlayerDeckFunctionType;
  openNewPlayerDialog: (newPlayerName: string, index: number) => void;
  openNewDeckDialog: (player: Player, deckName: string, index: number) => void;
};

interface SimplePlayer {
  name: string;
  decks: Deck[];
}

export default function NewGameSinglePlayerDeck({
  index,
  newPlayerDeck,
  isWinner,
  handleChangeIsWinnerSwitch,
  clearNthPlayer,
  selectedPlayerIds,
  selectedDeckIds,
  players,
  decks,
  errors,
  setNewPlayerDeck,
  openNewPlayerDialog,
  openNewDeckDialog,
}: NewGameSinglePlayerDeckProps) {
  const currPlayerId = newPlayerDeck.player.id;

  const [orderedPlayerIds, setOrderedPlayerIds] = useState<Array<number>>([]);
  const [orderedDeckObj, setOrderedDeckObj] = useState<
    Record<number, SimplePlayer>
  >({});

  useEffect(() => {
    const orderedPlayerIds = [
      currPlayerId,
      ...players.reduce<Array<number>>((acc, player) => {
        if (player.id !== currPlayerId) {
          acc.push(player.id);
        }
        return acc;
      }, []),
    ];
    const orderedDeckObj = decks.reduce<Record<number, SimplePlayer>>(
      (deckObj, deck) => {
        const { id: playerId, name: playerName } = deck.player;
        if (playerId in deckObj) {
          deckObj[playerId].decks.push(deck);
        } else {
          deckObj[playerId] = { name: playerName, decks: [deck] };
        }
        return deckObj;
      },
      {}
    );
    setOrderedPlayerIds(orderedPlayerIds);
    setOrderedDeckObj(orderedDeckObj);
  }, [currPlayerId, players, decks]);

  const ADD_PLAYER_VALUE = "__ADD_PLAYER";
  const ADD_DECK_VALUE = "__ADD_DECK";

  return (
    <Grid item xs={1}>
      <Box>
        {/* <Box>Player {index + 1}</Box> */}
        <Box className="flex flex-row justify-between items-center">
          <Box>Player {index + 1} Winner</Box>
          <Switch
            checked={isWinner}
            onChange={(_, checked) => handleChangeIsWinnerSwitch(checked)}
          />
          <IconButton
            color="error"
            onClick={() => clearNthPlayer(index)}
            sx={{ paddingX: "0" }}
          >
            <ClearIcon />
          </IconButton>
        </Box>
      </Box>

      {/* PLAYER SELECT */}
      <FormControl sx={{ width: "100%" }}>
        {isMobile ? (
          <>
            <InputLabel variant="standard" htmlFor={`player-${index}`}>
              Player {index + 1}
            </InputLabel>
            <NativeSelect
              // styling
              className="mb-3"
              sx={{ width: "100%" }}
              inputProps={{
                name: `player-${index + 1}-select`,
                id: `player-${index}`,
              }}
              // functionality
              error={!!errors.playerDecks[index]?.player}
              value={currPlayerId > 0 ? newPlayerDeck.player.id : ""}
              onChange={({ target: { value } }) => {
                if (value === "") {
                  setNewPlayerDeck({ player: null });
                } else if (value === ADD_PLAYER_VALUE) {
                  openNewPlayerDialog("", index);
                } else {
                  setNewPlayerDeck({
                    player: players.find(
                      (player) => player.id === Number(value)
                    ),
                  });
                }
              }}
            >
              <option disabled hidden value=""></option>
              <option value={ADD_PLAYER_VALUE} style={{ color: "red" }}>
                🆕 Add a new player
              </option>
              {players.map((player, i) => (
                <option
                  key={`select-${index}-player-${i}`}
                  value={player.id}
                  disabled={selectedPlayerIds.has(player.id)}
                >
                  {player.name}
                </option>
              ))}
            </NativeSelect>
          </>
        ) : (
          <>
            <InputLabel id={`player-${index}`}>Player {index + 1}</InputLabel>
            <Select
              // styling
              label="Player"
              labelId={`player-${index}`}
              className="mb-3"
              sx={{ width: "100%" }}
              // functionality
              error={!!errors.playerDecks[index]?.player}
              // value
              value={currPlayerId > 0 ? newPlayerDeck.player.id : ""}
              onChange={({ target: { value } }) => {
                if (value === ADD_PLAYER_VALUE) {
                  openNewPlayerDialog("", index);
                } else {
                  setNewPlayerDeck({
                    player: players.find((player) => player.id === value),
                  });
                }
              }}
            >
              <MenuItem value={ADD_PLAYER_VALUE}>🆕 Add a new player</MenuItem>
              {players.map((player, i) => (
                <MenuItem
                  key={`select-${index}-player-${i}`}
                  value={player.id}
                  disabled={selectedPlayerIds.has(player.id)}
                >
                  {player.name}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </FormControl>

      {/* DECK SELECT */}
      <FormControl sx={{ width: "100%" }}>
        {isMobile ? (
          <>
            <InputLabel variant="standard" htmlFor={`deck-${index}`}>
              Deck {index + 1}
            </InputLabel>
            <NativeSelect
              // styling
              inputProps={{
                name: `deck-${index + 1}-select`,
                id: `deck-${index}`,
              }}
              className="mb-3"
              sx={{ width: "100%" }}
              // functionality
              disabled={currPlayerId < 0}
              error={!!errors.playerDecks[index]?.deck}
              // value
              value={newPlayerDeck.deck.id > 0 ? newPlayerDeck.deck.id : ""}
              onChange={({ target: { value } }) => {
                if (value === ADD_DECK_VALUE) {
                  openNewDeckDialog(newPlayerDeck.player, "", index);
                } else {
                  setNewPlayerDeck({
                    deck: decks.find((deck) => deck.id === Number(value)),
                  });
                }
              }}
            >
              <option disabled hidden value=""></option>
              <option value={ADD_DECK_VALUE} style={{ color: "red" }}>
                🆕 Add a new deck
              </option>
              {Object.keys(orderedDeckObj).length > 0 &&
                orderedPlayerIds.map(
                  (playerId) =>
                    !!orderedDeckObj[playerId] && [
                      <optgroup
                        key={`select-${index}subheader-player-id-${playerId}`}
                        label={
                          playerId === currPlayerId
                            ? `${orderedDeckObj[playerId].name}'s own decks`
                            : orderedDeckObj[playerId].name
                        }
                      >
                        {orderedDeckObj[playerId].decks.map((deck) => (
                          <option
                            key={`select-${index}-deck-${deck.id}`}
                            value={deck.id}
                            disabled={selectedDeckIds.has(deck.id)}
                          >
                            {playerId !== currPlayerId &&
                              `${deck.player.name}'s `}
                            {deck.name}
                          </option>
                        ))}
                      </optgroup>,
                    ]
                )}
            </NativeSelect>
          </>
        ) : (
          <>
            <InputLabel id={`deck-${index}`}>Deck {index + 1}</InputLabel>
            <Select
              // styling
              label="Deck"
              labelId={`deck-${index}`}
              className="mb-3"
              sx={{ width: "100%" }}
              // functionality
              disabled={currPlayerId < 0}
              error={!!errors.playerDecks[index]?.deck}
              // value
              value={newPlayerDeck.deck.id > 0 ? newPlayerDeck.deck.id : ""}
              onChange={({ target: { value } }) => {
                if (value === ADD_DECK_VALUE) {
                  openNewDeckDialog(newPlayerDeck.player, "", index);
                } else {
                  setNewPlayerDeck({
                    deck: decks.find((deck) => deck.id === value),
                  });
                }
              }}
            >
              <MenuItem value={ADD_DECK_VALUE}>🆕 Add a new deck</MenuItem>
              {Object.keys(orderedDeckObj).length > 0 &&
                orderedPlayerIds.map(
                  (playerId) =>
                    !!orderedDeckObj[playerId] && [
                      <ListSubheader
                        key={`select-${index}subheader-player-id-${playerId}`}
                      >
                        {playerId === currPlayerId
                          ? `${orderedDeckObj[playerId].name}'s own decks`
                          : orderedDeckObj[playerId].name}
                      </ListSubheader>,
                      ...orderedDeckObj[playerId].decks.map((deck) => (
                        <MenuItem
                          key={`select-${index}-deck-${deck.id}`}
                          value={deck.id}
                          disabled={selectedDeckIds.has(deck.id)}
                        >
                          {playerId !== currPlayerId &&
                            `${deck.player.name}'s `}
                          {deck.name}
                        </MenuItem>
                      )),
                    ]
                )}
            </Select>
          </>
        )}
      </FormControl>

      {/* CARDS SELECT */}
      <SinglePlayerDeckCards
        cards={newPlayerDeck.cards}
        setCards={(cards: Card[]) => setNewPlayerDeck({ cards })}
      />
    </Grid>
  );
}
