import { Box, FormControl, Grid, Typography } from "@mui/material";

import { PageWrapper } from "../../hocs";
import React, { useEffect, useState } from "react";
import {
  Deck,
  Player,
  callAPI,
  fetchDecks,
  fetchMostRecentGameOrCurrentPlayer,
  fetchPlayers,
  NewPlayerdeck,
  SetNewPlayerdeckFunctionType,
  emptyNewPlayerdeck,
  fakeDeck,
  fakePlayer,
} from "../../helpers";

import NewGameSinglePlayerdeck from "./NewGameSinglePlayerdeck";
import NewPlayerDialog from "./NewPlayerDialog";
import NewDeckDialog from "./NewDeckDialog";

export default function NewGamePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [newPlayerdecks, setNewPlayerdecks] = useState<NewPlayerdeck[]>([
    { ...emptyNewPlayerdeck },
    { ...emptyNewPlayerdeck },
    { ...emptyNewPlayerdeck },
    { ...emptyNewPlayerdeck },
  ]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(
    new Set()
  );
  const [selectedDeckIds, setSelectedDeckIds] = useState<Set<number>>(
    new Set()
  );

  // fetch players and decks on first load
  useEffect(() => {
    fetchPlayers(setPlayers);
    fetchDecks(setDecks);
  }, []);

  useEffect(() => {
    let shouldContinue = true;
    for (const pd of newPlayerdecks) {
      if (pd.player.id > 0 || pd.deck.id > 0) {
        shouldContinue = false;
        break;
      }
    }
    if (shouldContinue && players.length > 0 && decks.length > 0) {
      fetchMostRecentGameOrCurrentPlayer(setNewPlayerdecks);
    }
  }, [players, decks, newPlayerdecks]);

  // unique player and deck ids; used to disallow multiples
  useEffect(() => {
    const tempSelectedPlayerIds = new Set<number>();
    const tempSelectedDeckIds = new Set<number>();
    newPlayerdecks.forEach((newPlayerdeck) => {
      tempSelectedPlayerIds.add(newPlayerdeck.player.id);
      tempSelectedDeckIds.add(newPlayerdeck.deck.id);
    });
    setSelectedPlayerIds(tempSelectedPlayerIds);
    setSelectedDeckIds(tempSelectedDeckIds);
  }, [newPlayerdecks]);

  const setNthNewPlayerdeckFactory =
    (n: number): SetNewPlayerdeckFunctionType =>
    ({ player, deck }) => {
      const tempNewPlayerdecks = [...newPlayerdecks];

      if (player) {
        tempNewPlayerdecks[n].player = player;
      } else if (player === null) {
        tempNewPlayerdecks[n].player = { ...fakePlayer };
      }

      if (deck) {
        tempNewPlayerdecks[n].deck = deck;
      } else if (deck === null) {
        tempNewPlayerdecks[n].deck = { ...fakeDeck };
      }

      setNewPlayerdecks(tempNewPlayerdecks);
    };

  // NEW PLAYER DIALOG FUNCTIONALITY
  const [isNewPlayerDialogOpen, setIsNewPlayerDialogOpen] =
    useState<boolean>(false);
  const [newPlayerDialogPlayerName, setNewPlayerDialogPlayerName] =
    useState<string>("");
  const [newPlayerDialogOpenedFromIndex, setNewPlayerDialogOpenedFromIndex] =
    useState<number>(-1);

  const handleOpenNewPlayerDialog = (playerName: string, index: number) => {
    setNewPlayerDialogPlayerName(playerName);
    setNewPlayerDialogOpenedFromIndex(index);
    setIsNewPlayerDialogOpen(true);
  };
  const handleCloseNewPlayerDialog = () => {
    setIsNewPlayerDialogOpen(false);
    setNewPlayerDialogPlayerName("");
    setNewPlayerDialogOpenedFromIndex(-1);
  };
  const handleSubmitNewPlayerDialog = async (e: React.FormEvent) => {
    e.preventDefault();
    const resp = await callAPI("/players", {
      method: "POST",
      body: { name: newPlayerDialogPlayerName },
    });
    const newPlayer = await resp.json();
    const tempNewPlayerdecks = { ...newPlayerdecks };
    tempNewPlayerdecks[newPlayerDialogOpenedFromIndex].player = newPlayer;
    setNewPlayerdecks(tempNewPlayerdecks);
    fetchPlayers(setPlayers);
    handleCloseNewPlayerDialog();
  };

  // NEW DECK DIALOG FUNCTIONALITY
  const [isNewDeckDialogOpen, setIsNewDeckDialogOpen] =
    useState<boolean>(false);
  const [newDeckDialogPlayer, setNewDeckDialogPlayer] = useState<Player>({
    ...fakePlayer,
  });
  const [newDeckDialogDeckName, setNewDeckDialogDeckName] =
    useState<string>("");
  const [newDeckDialogOpenedFromIndex, setNewDeckDialogOpenedFromIndex] =
    useState<number>(-1);

  const handleOpenNewDeckDialog = (
    player: Player,
    deckName: string,
    index: number
  ) => {
    setNewDeckDialogPlayer(player);
    setNewDeckDialogDeckName(deckName);
    setNewDeckDialogOpenedFromIndex(index);
    setIsNewDeckDialogOpen(true);
  };
  const handleCloseNewDeckDialog = () => {
    setNewDeckDialogPlayer({ ...fakePlayer });
    setIsNewDeckDialogOpen(false);
    setNewDeckDialogDeckName("");
    setNewDeckDialogOpenedFromIndex(-1);
  };
  const handleSubmitNewDeckDialog = async (e: React.FormEvent) => {
    e.preventDefault();
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
                openNewPlayerDialog={handleOpenNewPlayerDialog}
                openNewDeckDialog={handleOpenNewDeckDialog}
              />
            ))}
          </Grid>
        </FormControl>
      </Box>
      <NewPlayerDialog
        open={isNewPlayerDialogOpen}
        newPlayerName={newPlayerDialogPlayerName}
        setNewPlayerName={setNewPlayerDialogPlayerName}
        handleClose={handleCloseNewPlayerDialog}
        handleSubmit={handleSubmitNewPlayerDialog}
      />
      <NewDeckDialog
        open={isNewDeckDialogOpen}
        players={players}
        newDeckName={newDeckDialogDeckName}
        newDeckPlayer={newDeckDialogPlayer}
        setNewDeckName={setNewDeckDialogDeckName}
        setNewDeckPlayer={setNewDeckDialogPlayer}
        handleClose={handleCloseNewDeckDialog}
        handleSubmit={handleSubmitNewDeckDialog}
      />
    </PageWrapper>
  );
}
