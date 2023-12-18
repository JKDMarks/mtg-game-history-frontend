import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { PageWrapper } from "../../hocs";
import { useEffect, useState } from "react";
import { Deck, Player } from "../../helpers/types";
import { callAPI } from "../../helpers/utils";
import { fakeDeck, fakePlayer } from "../../helpers/constants";

import NewGameSinglePlayerdeck from "./NewGameSinglePlayerdeck";

export type NewPlayerdeck = {
  player: Player;
  deck: Deck;
};

const emptyNewPlayerdeck: NewPlayerdeck = {
  player: { ...fakePlayer },
  deck: { ...fakeDeck },
};

export type SetNewPlayerdeckFunctionType = ({
  player,
  deck,
}: {
  player?: Player | null;
  deck?: Deck | null;
}) => void;

export default function NewGamePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [newPlayerdecks, setNewPlayerdecks] = useState<NewPlayerdeck[]>([
    structuredClone(emptyNewPlayerdeck),
    structuredClone(emptyNewPlayerdeck),
    structuredClone(emptyNewPlayerdeck),
    structuredClone(emptyNewPlayerdeck),
  ]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(
    new Set()
  );
  const [selectedDeckIds, setSelectedDeckIds] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    const newSelectedPlayerIds = new Set<number>();
    const newSelectedDeckIds = new Set<number>();
    newPlayerdecks.forEach((newPlayerdeck) => {
      newSelectedPlayerIds.add(newPlayerdeck.player.id);
      newSelectedDeckIds.add(newPlayerdeck.deck.id);
    });
    setSelectedPlayerIds(newSelectedPlayerIds);
    setSelectedDeckIds(newSelectedDeckIds);
  }, [newPlayerdecks]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const resp = await callAPI("/players");
      const players: Player[] = await resp.json();
      const sortedPlayers = [...players].sort((p1, p2) =>
        p1.name.localeCompare(p2.name)
      );
      setPlayers(sortedPlayers);
    };
    const fetchDecks = async () => {
      const resp = await callAPI("/decks");
      const decks: Deck[] = await resp.json();
      const sortedDecks = [...decks].sort(
        (d1, d2) =>
          d1.Player.id - d2.Player.id || d1.name.localeCompare(d2.name)
      );
      setDecks(sortedDecks);
    };

    fetchPlayers();
    fetchDecks();
  }, []);

  const setNthNewPlayerdeckFactory =
    (n: number): SetNewPlayerdeckFunctionType =>
    ({ player, deck }) => {
      const tempNewPlayerdecks = structuredClone(newPlayerdecks);

      if (player) {
        tempNewPlayerdecks[n].player = player;
      } else if (player === null) {
        tempNewPlayerdecks[n].player = structuredClone(fakePlayer);
      }

      if (deck) {
        tempNewPlayerdecks[n].deck = deck;
      } else if (deck === null) {
        tempNewPlayerdecks[n].deck = structuredClone(fakeDeck);
      }

      setNewPlayerdecks(tempNewPlayerdecks);
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <PageWrapper>
      <Box className="flex flex-col">
        <Typography
          variant="h5"
          className="underline"
          sx={{ marginBottom: "0.75rem" }}
        >
          Create New Game
        </Typography>
        <FormControl component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 1, md: 2, lg: 4 }}>
            {newPlayerdecks.map((newPlayerdeck, i) => (
              <NewGameSinglePlayerdeck
                index={i}
                key={`player-${i}`}
                newPlayerdeck={newPlayerdeck}
                setNewPlayerdeck={setNthNewPlayerdeckFactory(i)}
                players={players}
                decks={decks}
                selectedPlayerIds={selectedPlayerIds}
                selectedDeckIds={selectedDeckIds}
              />
            ))}
          </Grid>
        </FormControl>
      </Box>
    </PageWrapper>
  );
}
