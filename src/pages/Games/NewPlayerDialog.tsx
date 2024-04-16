import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { NAME_RGX } from "../../helpers";

type NewPlayerDialogProps = {
  open: boolean;
  newPlayerName: string;
  setNewPlayerName: (name: string) => void;
  handleClose: () => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function NewPlayerDialog({
  open,
  newPlayerName,
  setNewPlayerName,
  handleClose,
  handleSubmit,
}: NewPlayerDialogProps) {
  const [errorMsg, setErrorMsg] = useState<string>("");

  const checkErrorsAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!newPlayerName) {
      setErrorMsg("Name can't be empty");
      return;
    } else if (newPlayerName.length >= 64 || !newPlayerName.match(NAME_RGX)) {
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
      <form onSubmit={(e) => checkErrorsAndSubmit(e)}>
        <DialogTitle>Add a new player</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remember to add the player's last name or last initial!
          </DialogContentText>
          <TextField
            autoFocus
            id="new-player-dialog-new-name"
            value={newPlayerName}
            onChange={(event) => setNewPlayerName(event.target.value)}
            label="name"
            type="text"
            sx={{ width: "100%" }}
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
