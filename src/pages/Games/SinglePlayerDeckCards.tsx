import { Box, Button, FormLabel, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Card, fakeCard } from "../../helpers";
import CardNamesAutocomplete from "./CardNamesAutocomplete";

interface SinglePlayerDeckCardsProps {
  cards: Card[];
  setCards: (cards: Card[]) => void;
}

export const NAME_WIDTH_PCT = 70;

export default function SinglePlayerDeckCards({
  cards,
  setCards,
}: SinglePlayerDeckCardsProps) {
  const handleClearClick = (idx: number) => {
    const newCards = [...cards.slice(0, idx), ...cards.slice(idx + 1)];
    setCards(newCards);
  };

  const handleChangeName = (value: string | null, idx: number) => {
    const newCards = [...cards];
    const newCard = { ...newCards[idx] };
    newCard.name = value ?? "";
    newCards[idx] = newCard;
    setCards(newCards);
  };

  const handleChangeTurnPlayed = (value: number, idx: number) => {
    const newCards = [...cards];
    const newCard = { ...newCards[idx] };
    newCard.turn_played = value > 0 ? value : null;
    newCards[idx] = newCard;
    setCards(newCards);
  };

  const handleAddCard = () => {
    const newCards = [...cards];
    newCards.push({ ...fakeCard });
    setCards(newCards);
  };

  return (
    <Box sx={{ marginTop: "10px" }}>
      {cards.length > 0 && (
        <Box
          sx={{
            width: `100%`,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: "35px",
            paddingRight: "5px",
          }}
        >
          <FormLabel sx={{ fontSize: "0.75rem" }}>
            <br />
            Card Name
          </FormLabel>
          <FormLabel sx={{ fontSize: "0.75rem" }}>
            Turn #<br />
            (optional)
          </FormLabel>
        </Box>
      )}
      {cards.map((card, idx) => (
        <Box key={`card-${idx}`} sx={{ display: "flex", flexDirection: "row" }}>
          <IconButton
            color="error"
            onClick={() => handleClearClick(idx)}
            sx={{ paddingX: "0" }}
          >
            <ClearIcon />
          </IconButton>
          <CardNamesAutocomplete
            card={card}
            handleChange={(value) => handleChangeName(value, idx)}
          />
          <TextField
            type="number"
            value={card.turn_played ?? ""}
            onChange={(e) =>
              handleChangeTurnPlayed(Number(e.target.value), idx)
            }
            sx={{ width: `${100 - NAME_WIDTH_PCT}%` }}
          />
        </Box>
      ))}
      <Button onClick={handleAddCard}>+ Add card played</Button>
    </Box>
  );
}
