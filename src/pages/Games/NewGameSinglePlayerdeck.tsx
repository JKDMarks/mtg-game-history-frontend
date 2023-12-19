import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  createFilterOptions,
} from "@mui/material";

import { Deck, Player } from "../../helpers/types";
import { NewPlayerdeck, SetNewPlayerdeckFunctionType } from "./NewGamePage";

const filter = createFilterOptions<Player>();

type NewGameSinglePlayerdeckProps = {
  index: number;
  newPlayerdeck: NewPlayerdeck;
  selectedPlayerIds: Set<number>;
  selectedDeckIds: Set<number>;
  players: Player[];
  decks: Deck[];
  setNewPlayerdeck: SetNewPlayerdeckFunctionType;
  openNewPlayerDialog: (newPlayerName: string, index: number) => void;
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
        // freeSolo
        renderInput={(params) => <TextField {...params} label="Player" />}
        options={players}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option: Player | AutocompleteOption) => {
          if ("label" in option) return option.label;
          if ("name" in option) return option.name;
          return "please report this bug";
        }}
        value={currPlayerId >= 0 ? newPlayerdeck.player : null}
        getOptionDisabled={(player) => selectedPlayerIds.has(player.id)}
        onChange={(_, option: Player | AutocompleteOption | null) => {
          if (typeof option === "string") {
            openNewPlayerDialog(option, index);
          } else if (option !== null && "inputValue" in option) {
            openNewPlayerDialog(option.inputValue, index);
          } else {
            setNewPlayerdeck({ player: option });
          }
        }}
        filterOptions={(options, params) => {
          const filtered: (Player | AutocompleteOption)[] = filter(
            options,
            params
          );

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              label: `Add new player "${params.inputValue}"`,
            });
          }

          // don't worry about it, it works
          return filtered as Player[];
        }}
        className="mb-4"
      />
      <Autocomplete
        disabled={currPlayerId < 0}
        renderInput={(params) => <TextField {...params} label="Deck" />}
        options={orderedDecks}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(deck) =>
          deck.Player.id === currPlayerId
            ? deck.name
            : `${deck.Player.name}'s ${deck.name}`
        }
        groupBy={(deck) =>
          deck.Player.id === currPlayerId
            ? `${newPlayerdeck.player.name}'s own decks`
            : "Other players' decks"
        }
        value={newPlayerdeck.deck.id >= 0 ? newPlayerdeck.deck : null}
        getOptionDisabled={(deck) => selectedDeckIds.has(deck.id)}
        onChange={(_, deck) => setNewPlayerdeck({ deck })}
      />
    </Grid>
  );
}
