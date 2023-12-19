import { Box, FormControl, Grid, Typography } from "@mui/material";

import { PageWrapper } from "../../hocs";
import React, { useEffect, useState } from "react";
import { Deck, Game, Player } from "../../helpers/types";
import { callAPI } from "../../helpers/utils";
import { fakeDeck, fakePlayer } from "../../helpers/constants";

import NewGameSinglePlayerdeck from "./NewGameSinglePlayerdeck";
import NewPlayerDialog from "./NewPlayerDialog";
import NewDeckDialog from "./NewDeckDialog";
import moment from "moment";

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

  const fetchMostRecentGameOrCurrentPlayer = async () => {
    const resp = await callAPI("/games/recent");
    const mostRecentGame: Game = await resp.json();
    const todaysDate = moment().format("YYYY-MM-DD");

    if (
      mostRecentGame &&
      // mostRecentGame.date === todaysDate &&
      mostRecentGame.GamePlayerDecks
    ) {
      const tempNewPlayerdecks = mostRecentGame.GamePlayerDecks.map(
        ({ Player, Deck }) => ({
          player: Player,
          deck: Deck,
        })
      );
      setNewPlayerdecks(tempNewPlayerdecks);
    }

    console.log("***me", mostRecentGame);
    // const tempNewPlayerdecks = structuredClone(newPlayerdecks);
    // tempNewPlayerdecks[0].player = me;
    // setNewPlayerdecks(tempNewPlayerdecks);
  };
  const fetchPlayers = async (firstLoad: boolean = false) => {
    const resp = await callAPI("/players");
    const players: Player[] = await resp.json();
    const sortedPlayers = [...players].sort((p1, p2) =>
      p1.name.localeCompare(p2.name)
    );
    setPlayers(sortedPlayers);
    if (firstLoad) {
      await fetchMostRecentGameOrCurrentPlayer();
    }
  };
  const fetchDecks = async () => {
    const resp = await callAPI("/decks");
    const decks: Deck[] = await resp.json();
    const sortedDecks = [...decks].sort(
      (d1, d2) => d1.Player.id - d2.Player.id || d1.name.localeCompare(d2.name)
    );
    setDecks(sortedDecks);
  };
  // fetch players and decks on first load
  useEffect(() => {
    fetchPlayers(true);
    fetchDecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // unique player and deck ids; used to disallow multiples
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
    const tempNewPlayerdecks = structuredClone(newPlayerdecks);
    tempNewPlayerdecks[newPlayerDialogOpenedFromIndex].player = newPlayer;
    setNewPlayerdecks(tempNewPlayerdecks);
    fetchPlayers();
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
        handleClose={handleCloseNewDeckDialog}
        handleSubmit={handleSubmitNewDeckDialog}
      />
    </PageWrapper>
  );
}
