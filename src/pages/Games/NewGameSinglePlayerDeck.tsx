import {
  Autocomplete,
  Box,
  Grid,
  Popper,
  Switch,
  TextField,
  createFilterOptions,
} from "@mui/material";
import {
  Card,
  Deck,
  NewGameErrors,
  NewPlayerDeck,
  Player,
  SetNewPlayerDeckFunctionType,
} from "../../helpers";
import SinglePlayerDeckCards from "./SinglePlayerDeckCards";
import { useState } from "react";

const playerFilter = createFilterOptions<Player>();
const deckFilter = createFilterOptions<Deck>();

type NewGameSinglePlayerDeckProps = {
  index: number;
  newPlayerDeck: NewPlayerDeck;
  isWinner: boolean;
  handleChangeIsWinnerSwitch: (checked: boolean) => void;
  selectedPlayerIds: Set<number>;
  selectedDeckIds: Set<number>;
  players: Player[];
  decks: Deck[];
  errors: NewGameErrors;
  setNewPlayerDeck: SetNewPlayerDeckFunctionType;
  openNewPlayerDialog: (newPlayerName: string, index: number) => void;
  openNewDeckDialog: (player: Player, deckName: string, index: number) => void;
};

type AutocompleteOption = {
  inputValue: string;
  label: string;
};

export default function NewGameSinglePlayerDeck({
  index,
  newPlayerDeck,
  isWinner,
  handleChangeIsWinnerSwitch,
  selectedPlayerIds,
  selectedDeckIds,
  players,
  decks,
  errors,
  setNewPlayerDeck,
  openNewPlayerDialog,
  openNewDeckDialog,
}: NewGameSinglePlayerDeckProps) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isDeckOpen, setIsDeckOpen] = useState(false);

  const currPlayerId = newPlayerDeck.player.id;
  const orderedPlayerIds = [
    currPlayerId,
    ...players.map((player) => player.id),
  ];
  const orderedDecks = [...decks].sort((d1, d2) =>
    currPlayerId < 0
      ? 0
      : orderedPlayerIds.indexOf(d1.player.id) -
        orderedPlayerIds.indexOf(d2.player.id)
  );

  const PLAYER_LISTBOX_STYLING = {
    height: `${16 + 48 * players.length}px`,
    minHeight: "64px",
    maxHeight: "200px",
  };
  const DECK_LISTBOX_STYLING = {
    height: `${64 + 48 * decks.length}px`,
    minHeight: "112px",
    maxHeight: "200px",
  };

  const scrollIntoView = (event: React.FocusEvent<HTMLDivElement>) => {
    // event.stopPropagation();
    // event.target.focus({ preventScroll: true });
    const domRect = event.target.getBoundingClientRect();
    const eltDistToTopOfScreen = domRect.top;
    setTimeout(() => {
      window.scrollTo({ top: window.scrollY + eltDistToTopOfScreen });
    }, 200);
  };

  return (
    <Grid item xs={1}>
      <Box>
        <Box>Player {index + 1}</Box>
        <Box className="flex flex-row justify-center items-center">
          <Box>Winner</Box>
          <Switch
            checked={isWinner}
            onChange={(_, checked) => handleChangeIsWinnerSwitch(checked)}
          />
        </Box>
      </Box>
      <Autocomplete
        // open/close
        open={isPlayerOpen}
        onOpen={() => setIsPlayerOpen(true)}
        onClose={() => setIsPlayerOpen(false)}
        onMouseDownCapture={(e) => e.stopPropagation()}
        onFocus={(e) => {
          setIsPlayerOpen(true);
          scrollIntoView(e);
        }}
        selectOnFocus={false}
        onBlur={() => setIsPlayerOpen(false)}
        // styling
        className="mb-4"
        noOptionsText="Start typing to add a new player"
        clearIcon={null}
        ListboxProps={{ style: { ...PLAYER_LISTBOX_STYLING } }}
        PopperComponent={({ style, ...props }) => (
          <Popper {...props} style={{ ...style, height: 0 }} />
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Player"
            error={!!errors.playerDecks[index]?.player}
          />
        )}
        // functionality
        options={players}
        value={currPlayerId > 0 ? newPlayerDeck.player : null}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionDisabled={(player) => selectedPlayerIds.has(player.id)}
        getOptionLabel={(option) => {
          if ("label" in option && typeof option.label === "string") {
            return option.label;
          }
          if ("name" in option) {
            return option.name;
          }
          return "please report this bug";
        }}
        onChange={(_, option) => {
          if (typeof option === "string") {
            openNewPlayerDialog(option, index);
          } else if (
            option !== null &&
            "inputValue" in option &&
            typeof option.inputValue === "string"
          ) {
            openNewPlayerDialog(option.inputValue, index);
          } else {
            setIsPlayerOpen(false);
            setNewPlayerDeck({ player: option });
          }
        }}
        filterOptions={(options, params) => {
          const filtered: (Player | AutocompleteOption)[] = playerFilter(
            options,
            params
          );
          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              label: `Add new player "${params.inputValue}"`,
            });
          }
          return filtered as Player[];
        }}
      />
      <Autocomplete
        // open/close
        open={isDeckOpen}
        disabled={currPlayerId < 0}
        onOpen={() => setIsDeckOpen(true)}
        onClose={() => setIsDeckOpen(false)}
        onMouseDownCapture={(e) => e.stopPropagation()}
        onFocus={(e) => {
          setIsDeckOpen(true);
          scrollIntoView(e);
        }}
        selectOnFocus={false}
        onBlur={() => setIsDeckOpen(false)}
        // styling
        noOptionsText="Start typing to add a new deck"
        clearIcon={null}
        ListboxProps={{ style: { ...DECK_LISTBOX_STYLING } }}
        PopperComponent={({ style, ...props }) => (
          <Popper {...props} style={{ ...style, height: 0 }} />
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Deck"
            error={!!errors.playerDecks[index]?.deck}
          />
        )}
        // functionality
        options={orderedDecks}
        value={newPlayerDeck.deck.id > 0 ? newPlayerDeck.deck : null}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionDisabled={(deck) => selectedDeckIds.has(deck.id)}
        getOptionLabel={(option) => {
          if ("label" in option && typeof option.label === "string") {
            return option.label;
          }
          if ("name" in option) {
            return option.player.id === currPlayerId
              ? option.name
              : `${option.player.name}'s ${option.name}`;
          }
          return "please report this bug";
        }}
        groupBy={(deck) => {
          if ("inputValue" in deck) return "Add new deck";
          return deck.player.id === currPlayerId
            ? `${newPlayerDeck.player.name}'s own decks`
            : "Other players' decks";
        }}
        onChange={(_, option) => {
          if (typeof option === "string") {
            openNewDeckDialog(newPlayerDeck.player, option, index);
          } else if (
            option !== null &&
            "inputValue" in option &&
            typeof option.inputValue === "string"
          ) {
            openNewDeckDialog(newPlayerDeck.player, option.inputValue, index);
          } else {
            setNewPlayerDeck({ deck: option });
          }
        }}
        filterOptions={(options, params) => {
          const filtered: (Deck | AutocompleteOption)[] = deckFilter(
            options,
            params
          );
          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              label: `Add new deck "${params.inputValue}"`,
            });
          }
          return filtered as Deck[];
        }}
      />
      <SinglePlayerDeckCards
        cards={newPlayerDeck.cards}
        setCards={(cards: Card[]) => setNewPlayerDeck({ cards })}
      />
    </Grid>
  );
}
