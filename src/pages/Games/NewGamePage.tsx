import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Typography,
} from "@mui/material";

import { PageWrapper } from "../../components";
import React, { useEffect, useState } from "react";
import {
  Deck,
  Player,
  callAPI,
  fetchDecks,
  fetchMostRecentGame,
  fetchPlayers,
  NewPlayerDeck,
  SetNewPlayerDeckFunctionType,
  emptyNewPlayerDeck,
  fakeDeck,
  fakePlayer,
  NewGamePlayerDeckError,
  emptyNewGamePlayerDeckError,
  NewGameErrors,
  getTodaysDate,
} from "../../helpers";

import NewGameSinglePlayerDeck from "./NewGameSinglePlayerDeck";
import NewPlayerDialog from "./NewPlayerDialog";
import NewDeckDialog from "./NewDeckDialog";
import { useNavigate } from "react-router-dom";

export default function NewGamePage() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);

  const [newPlayerDecks, setNewPlayerDecks] = useState<NewPlayerDeck[]>([
    { ...emptyNewPlayerDeck },
    { ...emptyNewPlayerDeck },
    { ...emptyNewPlayerDeck },
    { ...emptyNewPlayerDeck },
  ]);
  const [winnerIndex, setWinnerIndex] = useState<number>(-1);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(
    new Set()
  );
  const [selectedDeckIds, setSelectedDeckIds] = useState<Set<number>>(
    new Set()
  );

  const [errorMsg, setErrorMsg] = useState<string>("");

  ////////////////
  // useEffects //
  ////////////////
  // fetch players and decks on first load
  useEffect(() => {
    fetchPlayers(setPlayers);
    fetchDecks(setDecks);
  }, []);

  useEffect(() => {
    let shouldContinue = true;
    for (const pd of newPlayerDecks) {
      if (pd.player.id > 0 || pd.deck.id > 0) {
        shouldContinue = false;
        break;
      }
    }
    if (shouldContinue && players.length > 0 && decks.length > 0) {
      fetchMostRecentGame(setNewPlayerDecks);
    }
  }, [players, decks, newPlayerDecks]);

  // unique player and deck ids; used to disallow multiples
  useEffect(() => {
    const tempSelectedPlayerIds = new Set<number>();
    const tempSelectedDeckIds = new Set<number>();
    newPlayerDecks.forEach((newPD) => {
      tempSelectedPlayerIds.add(newPD.player.id);
      tempSelectedDeckIds.add(newPD.deck.id);
    });
    setSelectedPlayerIds(tempSelectedPlayerIds);
    setSelectedDeckIds(tempSelectedDeckIds);
  }, [newPlayerDecks]);

  /////////////
  // Helpers //
  /////////////
  const setNthNewPlayerDeckFactory =
    (n: number): SetNewPlayerDeckFunctionType =>
    ({ player, deck }) => {
      const tempNewPDs = [...newPlayerDecks];

      if (player) {
        tempNewPDs[n].player = player;
      } else if (player === null) {
        tempNewPDs[n].player = { ...fakePlayer };
      }

      if (deck) {
        tempNewPDs[n].deck = deck;
      } else if (deck === null) {
        tempNewPDs[n].deck = { ...fakeDeck };
      }

      setNewPlayerDecks(tempNewPDs);
    };

  ///////////////////////////////////
  // NewPlayerDialog functionality //
  ///////////////////////////////////
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
    const tempNewPDs = [...newPlayerDecks];
    tempNewPDs[newPlayerDialogOpenedFromIndex].player = newPlayer;
    setNewPlayerDecks(tempNewPDs);
    fetchPlayers(setPlayers);
    handleCloseNewPlayerDialog();
  };

  /////////////////////////////////
  // NewDeckDialog Functionality //
  /////////////////////////////////
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
    const resp = await callAPI("/decks", {
      method: "POST",
      body: {
        playerId: newDeckDialogPlayer.id,
        name: newDeckDialogDeckName,
      },
    });
    const newDeck: Deck = await resp.json();
    const tempNewPDs = [...newPlayerDecks];
    tempNewPDs[newDeckDialogOpenedFromIndex].deck = newDeck;
    fetchDecks(setDecks);
    handleCloseNewDeckDialog();
  };

  /////////////////////
  // Submit New Game //
  /////////////////////
  const getEmptyErrors = (): NewGameErrors => {
    const tempPDErrors: NewGamePlayerDeckError[] = new Array(
      newPlayerDecks.length
    )
      .fill(0)
      .map(() => ({ ...emptyNewGamePlayerDeckError }));

    return {
      playerDecks: tempPDErrors,
    };
  };

  const [errors, setErrors] = useState<NewGameErrors>(getEmptyErrors());

  const handleSubmitNewGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors = getEmptyErrors();
    let dontContinue = false;
    for (const [i, pd] of newPlayerDecks.entries()) {
      if (pd.player.id < 0) {
        tempErrors.playerDecks[i].player = "No player selected";
        dontContinue = true;
      } else if (pd.deck.id < 0) {
        tempErrors.playerDecks[i].deck = "No deck selected";
        dontContinue = true;
      }
    }
    setErrors(tempErrors);
    if (dontContinue) {
      return;
    }

    if (winnerIndex < 0) {
      const shouldSubmit = confirm("Submit this game with no winner?");
      if (!shouldSubmit) {
        return;
      }
    }

    const body = {
      date: getTodaysDate(),
      player_decks: newPlayerDecks.map((pd, i) => ({
        player_id: pd.player.id,
        deck_id: pd.deck.id,
        is_winner: winnerIndex === i,
      })),
    };
    const resp = await callAPI("/games", {
      method: "POST",
      body,
    });
    const newGame = await resp.json();
    if (newGame.id) {
      navigate(`/games/${newGame.id}`);
    } else {
      setErrorMsg(newGame.message);
    }
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
        <FormControl component="form" onSubmit={handleSubmitNewGame}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className="space-y-4"
          >
            <Grid container spacing={4} columns={{ xs: 1, md: 2, lg: 4 }}>
              {newPlayerDecks.map((newPlayerDeck, i) => {
                return (
                  <NewGameSinglePlayerDeck
                    index={i}
                    key={`player-${i}`}
                    newPlayerDeck={newPlayerDeck}
                    setNewPlayerDeck={setNthNewPlayerDeckFactory(i)}
                    players={players}
                    decks={decks}
                    isWinner={winnerIndex === i}
                    handleChangeIsWinnerSwitch={(checked) =>
                      setWinnerIndex(checked ? i : -1)
                    }
                    selectedPlayerIds={selectedPlayerIds}
                    selectedDeckIds={selectedDeckIds}
                    openNewPlayerDialog={handleOpenNewPlayerDialog}
                    openNewDeckDialog={handleOpenNewDeckDialog}
                    errors={errors}
                  />
                );
              })}
            </Grid>
            {errorMsg && <FormHelperText error>{errorMsg}</FormHelperText>}
            <Button
              type="submit"
              variant="contained"
              sx={{
                // marginTop: "2rem",
                paddingX: "2rem",
                letterSpacing: "0.125rem",
              }}
            >
              Submit New Game
            </Button>
          </Box>
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
