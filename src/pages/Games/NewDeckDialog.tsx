import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

export default function NewDeckDialog({ open, handleClose, handleSubmit }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add a new film</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Did you miss any film in our list? Please, add it!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={"asdf"}
            // onChange={(event) =>
            //   setDialogValue({
            //     ...dialogValue,
            //     title: event.target.value,
            //   })
            // }
            label="title"
            type="text"
            variant="standard"
          />
          <TextField
            margin="dense"
            id="name"
            value={1222}
            // onChange={(event) =>
            //   setDialogValue({
            //     ...dialogValue,
            //     year: event.target.value,
            //   })
            // }
            label="year"
            type="number"
            variant="standard"
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
