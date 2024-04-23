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
  errorMsg: string;
  isSmOrSmaller: boolean;
};

export default function NewPlayerDialog({
  open,
  newPlayerName,
  setNewPlayerName,
  handleClose,
  handleSubmit,
  errorMsg: parentErrorMsg,
  isSmOrSmaller,
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
    <Dialog
      open={open}
      onClose={resetErrorsAndClose}
      maxWidth="xs"
      sx={{
        "& .MuiDialog-container": {
          alignItems: isSmOrSmaller ? "flex-start" : "",
        },
        "& .MuiPaper-root": {
          marginTop: isSmOrSmaller ? "10px" : "",
        },
      }}
    >
      <form onSubmit={(e) => checkErrorsAndSubmit(e)}>
        <DialogTitle>Add a new player</DialogTitle>
        <DialogContent>
          <DialogContentText>Your excuse to ask for names!</DialogContentText>
          <TextField
            autoFocus
            id="new-player-dialog-new-name"
            value={newPlayerName}
            onChange={(event) => setNewPlayerName(event.target.value)}
            label="New player name"
            type="text"
            sx={{ width: "100%" }}
          />
          {(errorMsg || parentErrorMsg) && (
            <DialogContentText sx={{ color: "red" }}>
              {errorMsg}
              {parentErrorMsg}
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
