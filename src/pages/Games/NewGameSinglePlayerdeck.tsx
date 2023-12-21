import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  createFilterOptions,
} from "@mui/material";
import {
  Deck,
  NewPlayerdeck,
  Player,
  SetNewPlayerdeckFunctionType,
} from "../../helpers";

const playerFilter = createFilterOptions<Player>();
const deckFilter = createFilterOptions<Deck>();

type NewGameSinglePlayerdeckProps = {
  index: number;
  newPlayerdeck: NewPlayerdeck;
  selectedPlayerIds: Set<number>;
  selectedDeckIds: Set<number>;
  players: Player[];
  decks: Deck[];
  setNewPlayerdeck: SetNewPlayerdeckFunctionType;
  openNewPlayerDialog: (newPlayerName: string, index: number) => void;
  openNewDeckDialog: (player: Player, deckName: string, index: number) => void;
};

type AutocompleteOption = {
  inputValue: string;
  label: string;
};

export default function NewGameSinglePlayerdeck({
  index,
  newPlayerdeck,
  selectedPlayerIds,
  selectedDeckIds,
  players,
  decks,
  setNewPlayerdeck,
  openNewPlayerDialog,
  openNewDeckDialog,
}: NewGameSinglePlayerdeckProps) {
  const currPlayerId = newPlayerdeck.player.id;
  const orderedPlayerIds = [
    currPlayerId,
    ...players.map((player) => player.id),
  ];
  const orderedDecks = [...decks].sort((d1, d2) =>
    currPlayerId < 0
      ? 0
      : orderedPlayerIds.indexOf(d1.Player.id) -
        orderedPlayerIds.indexOf(d2.Player.id)
  );

  return (
    <Grid item xs={1}>
      <Box>Player {index + 1}</Box>
      <Autocomplete
        className="mb-4"
        // freeSolo
        renderInput={(params) => <TextField {...params} label="Player" />}
        options={players}
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
        value={currPlayerId >= 0 ? newPlayerdeck.player : null}
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
            setNewPlayerdeck({ player: option });
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
        disabled={currPlayerId < 0}
        renderInput={(params) => <TextField {...params} label="Deck" />}
        options={orderedDecks}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => {
          if ("label" in option && typeof option.label === "string") {
            return option.label;
          }
          if ("name" in option) {
            return option.Player.id === currPlayerId
              ? option.name
              : `${option.Player.name}'s ${option.name}`;
          }
          return "please report this bug";
        }}
        groupBy={(deck) => {
          if ("inputValue" in deck) return "Add new deck";
          return deck.Player.id === currPlayerId
            ? `${newPlayerdeck.player.name}'s own decks`
            : "Other players' decks";
        }}
        value={newPlayerdeck.deck.id >= 0 ? newPlayerdeck.deck : null}
        getOptionDisabled={(deck) => selectedDeckIds.has(deck.id)}
        onChange={(_, option) => {
          if (typeof option === "string") {
            openNewDeckDialog(newPlayerdeck.player, option, index);
          } else if (
            option !== null &&
            "inputValue" in option &&
            typeof option.inputValue === "string"
          ) {
            openNewDeckDialog(newPlayerdeck.player, option.inputValue, index);
          } else {
            setNewPlayerdeck({ deck: option });
          }
        }}
        // onChange={(_, deck) => setNewPlayerdeck({ deck })}
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
