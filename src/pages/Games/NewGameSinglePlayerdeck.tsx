import { Autocomplete, Grid, MenuItem, Select, TextField } from "@mui/material";
import { Deck, Player } from "../../helpers/types";
import { getPlayerName } from "../../helpers/utils";
import { NewPlayerdeck, SetNewPlayerdeckFunctionType } from "./NewGamePage";
import { ReactNode, useState } from "react";

type NewGameSinglePlayerdeckProps = {
  index: number;
  newPlayerdeck: NewPlayerdeck;
  selectedPlayerIds: Set<number>;
  selectedDeckIds: Set<number>;
  players: Player[];
  decks: Deck[];
  setNewPlayerdeck: SetNewPlayerdeckFunctionType;
};

export default function NewGameSinglePlayerdeck({
  index,
  newPlayerdeck,
  selectedPlayerIds,
  selectedDeckIds,
  players,
  decks,
  setNewPlayerdeck,
}: NewGameSinglePlayerdeckProps) {
  const [isNewPlayer, setIsNewPlayer] = useState<boolean>(false);
  const [isNewDeck, setIsNewDeck] = useState<boolean>(false);

  const orderedDecks = [...decks].sort((d1, d2) => {
    if (newPlayerdeck.player.id < 0) {
      return 0;
    }
    return 0;
  });

  //   const [player, setPlayer] = useState<Player | null>(null);
  //   const [deckId, setDeckId] = useState<number | null>(null);

  return (
    <Grid item xs={1}>
      <Grid container columns={1}>
        <Grid item xs={1}>
          <Autocomplete
            renderInput={(params) => <TextField {...params} label="Player" />}
            options={players}
            getOptionLabel={(player) => player.name}
            value={newPlayerdeck.player.id >= 0 ? newPlayerdeck.player : null}
            getOptionDisabled={(player) => selectedPlayerIds.has(player.id)}
            onChange={(_, player) => setNewPlayerdeck({ player })}
            className="mb-4"
          />
          <Autocomplete
            disabled={newPlayerdeck.player.id < 0}
            renderInput={(params) => <TextField {...params} label="Deck" />}
            options={decks}
            getOptionLabel={(deck) =>
              deck.id === newPlayerdeck.player.id
                ? deck.name
                : `${deck.Player.name}'s ${deck.name}`
            }
            groupBy={(deck) => deck.Player.name}
            value={newPlayerdeck.deck.id >= 0 ? newPlayerdeck.deck : null}
            getOptionDisabled={(deck) => selectedDeckIds.has(deck.id)}
            onChange={(_, deck) => setNewPlayerdeck({ deck })}
          />
          {/* <Select label="Player 1" sx={{ width: "100%" }}>
            {players.map((player) => (
              <MenuItem value={player.username}>
                {getPlayerName(player)}
              </MenuItem>
            ))}
          </Select> */}
        </Grid>
        <Grid item xs={1}>
          bottom
        </Grid>
      </Grid>
    </Grid>
  );
}
