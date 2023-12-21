import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Player } from "../../helpers";
import { useState } from "react";

type NewDeckDialogProps = {
  open: boolean;
  players: Player[];
  newDeckName: string;
  newDeckPlayer: Player;
  setNewDeckName: (name: string) => void;
  setNewDeckPlayer: (player: Player) => void;
  handleClose: () => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function NewDeckDialog({
  open,
  players,
  newDeckName,
  newDeckPlayer,
  setNewDeckName,
  setNewDeckPlayer,
  handleClose,
  handleSubmit,
}: NewDeckDialogProps) {
  const [errorMsg, setErrorMsg] = useState<string>("");

  const checkErrorsAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const nameRgx = /^[a-z ,.'-]+$/i;
    if (!newDeckName) {
      setErrorMsg("Name can't be empty");
      return;
    } else if (newDeckName.length >= 128 || !newDeckName.match(nameRgx)) {
      setErrorMsg("Invalid name");
      return;
    }
    handleSubmit(e);
  };

  const resetErrorsAndClose = () => {
    setErrorMsg("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={resetErrorsAndClose} maxWidth="xs">
      <form onSubmit={checkErrorsAndSubmit}>
        <DialogTitle>Add a new deck</DialogTitle>
        <DialogContent className="flex flex-col space-y-4">
          <DialogContentText>
            Deck names should be in the format
            <br />
            [Commander Name] [Short Description]
            <br />
            e.g. Atraxa Infect or Korvold Treasure
          </DialogContentText>
          <Autocomplete
            disableClearable
            id="new-deck-dialog-new-player"
            renderInput={(params) => <TextField {...params} label="Player" />}
            options={players}
            isOptionEqualToValue={(player, value) => player.id === value.id}
            getOptionLabel={(player) => player.name}
            value={newDeckPlayer}
            onChange={(_, player) => setNewDeckPlayer(player)}
          />
          <TextField
            autoFocus
            id="new-deck-dialog-new-deck-name"
            className="w-full mt-2"
            value={newDeckName}
            onChange={(event) => setNewDeckName(event.target.value)}
            label="New deck name"
            type="text"
          />
          {errorMsg && (
            <DialogContentText sx={{ color: "red" }}>
              {errorMsg}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={resetErrorsAndClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
