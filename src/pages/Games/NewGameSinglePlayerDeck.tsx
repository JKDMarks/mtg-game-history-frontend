import {
  Autocomplete,
  Box,
  Grid,
  Switch,
  TextField,
  createFilterOptions,
} from "@mui/material";
import {
  Deck,
  NewGameErrors,
  NewPlayerDeck,
  Player,
  SetNewPlayerDeckFunctionType,
} from "../../helpers";

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
  const minHeight = "200px";

  const scrollIntoView: React.FocusEventHandler = ({ target }) => {
    const domRect = target.getBoundingClientRect();
    const eltDistToTopOfScreen = domRect.top;
    window.scrollTo({ top: window.scrollY + eltDistToTopOfScreen });
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
        className="mb-4"
        noOptionsText="Start typing to add a new player"
        ListboxProps={{ style: { minHeight } }}
        selectOnFocus={false}
        onFocus={scrollIntoView}
        options={players}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Player"
            error={!!errors.playerDecks[index]?.player}
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => {
          if ("label" in option && typeof option.label === "string") {
            return option.label;
          }
          if ("name" in option) {
            return option.name;
          }
          return "please report this bug";
        }}
        value={currPlayerId > 0 ? newPlayerDeck.player : null}
        getOptionDisabled={(player) => selectedPlayerIds.has(player.id)}
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
        noOptionsText="Start typing to add a new deck"
        ListboxProps={{ style: { minHeight } }}
        selectOnFocus={false}
        onFocus={scrollIntoView}
        disabled={currPlayerId < 0}
        options={orderedDecks}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Deck"
            error={!!errors.playerDecks[index]?.deck}
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
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
        value={newPlayerDeck.deck.id > 0 ? newPlayerDeck.deck : null}
        getOptionDisabled={(deck) => selectedDeckIds.has(deck.id)}
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
    </Grid>
  );
}
