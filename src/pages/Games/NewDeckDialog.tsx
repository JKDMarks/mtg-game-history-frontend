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
  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add a new film</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Did you miss any film in our list? Please, add it!
          </DialogContentText>
          <Autocomplete
            id="player"
            disableClearable
            renderInput={(params) => <TextField {...params} label="Player" />}
            options={players}
            isOptionEqualToValue={(player, value) => player.id === value.id}
            getOptionLabel={(player) => player.name}
            value={newDeckPlayer}
            onChange={(_, player) => setNewDeckPlayer(player)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="deck-name"
            value={newDeckName}
            onChange={(event) => setNewDeckName(event.target.value)}
            label="New deck name"
            type="text"
            // variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
