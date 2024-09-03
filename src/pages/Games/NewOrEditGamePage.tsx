import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { PageWrapper } from "../../components";
import React, { useContext, useEffect, useState } from "react";
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
  Game,
  canCurrUserViewGame,
  User,
} from "../../helpers";

import NewGameSinglePlayerDeck from "./NewGameSinglePlayerDeck";
import NewPlayerDialog from "./NewPlayerDialog";
import NewDeckDialog from "./NewDeckDialog";
import { useParams, useRouteLoaderData } from "react-router-dom";
import { IsLoadingContext, ROOT_ROUTE_ID } from "../../App";
import { isMobile } from "react-device-detect";

export default function NewOrEditGamePage({
  isEditing = false,
}: {
  isEditing?: boolean;
}) {
  const currUser = useRouteLoaderData(ROOT_ROUTE_ID) as User;
  const { setIsLoading } = useContext(IsLoadingContext);

  const { gameId } = useParams();

  const theme = useTheme();
  const isSmOrSmaller = useMediaQuery(theme.breakpoints.down("sm"));

  const [players, setPlayers] = useState<Player[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);

  const [firstLoadComplete, setFirstLoadComplete] = useState<boolean>(false);

  const [newPlayerDecks, setNewPlayerDecks] = useState<NewPlayerDeck[]>([
    { ...emptyNewPlayerDeck },
    { ...emptyNewPlayerDeck },
    { ...emptyNewPlayerDeck },
    { ...emptyNewPlayerDeck },
  ]);
  const [notes, setNotes] = useState("");
  const [firstPlayerIdx, setFirstPlayerIdx] = useState<number>(-1);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(
    new Set()
  );
  const [selectedDeckIds, setSelectedDeckIds] = useState<Set<number>>(
    new Set()
  );
  const [gpdIds, setGpdIds] = useState<Array<number | null>>(
    new Array(newPlayerDecks.length).fill(null)
  );

  const [winnerIdx, setWinnerIdx] = useState(-1);

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
    if (firstLoadComplete || players.length === 0 || decks.length === 0) return;

    const fetchGameData = async () => {
      const resp = await callAPI("/games/" + gameId);
      const game: Game = await resp.json();
      if (!canCurrUserViewGame(currUser, game)) {
        window.location.pathname = "/";
      }
      setNewPlayerDecks(game.game_player_decks);
      setGpdIds(game.game_player_decks.map((gpd) => gpd.id));
      game.game_player_decks.forEach((gpd, i) => {
        if (gpd.is_winner) {
          setWinnerIdx(i);
        }
        if (gpd.first_player) {
          setFirstPlayerIdx(i);
        }
      });
      if (game.notes) {
        setNotes(game.notes);
      }
    };
    const fetchData = async () => {
      setIsLoading(true);
      if (isEditing && gameId !== undefined && !isNaN(Number(gameId))) {
        await fetchGameData();
      } else if (players.length > 0 && decks.length > 0) {
        await fetchMostRecentGame(setNewPlayerDecks);
      }
      setIsLoading(false);
    };

    // fakePlayer.id == -1; fakeDeck.id == -1;
    // const shouldNotContinue = newPlayerDecks.some(
    //   (pd) => pd.player.id > 0 || pd.deck.id > 0
    // );
    if (firstLoadComplete) return;
    setFirstLoadComplete(true);
    fetchData();
  }, [
    players,
    decks,
    newPlayerDecks,
    gameId,
    isEditing,
    currUser,
    setIsLoading,
  ]);

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
  const resetGame = () => {
    const confirm = window.confirm(
      "Reset this game? This will remove all players, decks, and cards from this game."
    );
    if (!confirm) {
      return;
    }
    setWinnerIdx(-1);
    setNewPlayerDecks([
      { ...emptyNewPlayerDeck },
      { ...emptyNewPlayerDeck },
      { ...emptyNewPlayerDeck },
      { ...emptyNewPlayerDeck },
    ]);
  };

  const clearNthPlayer = (index: number) => {
    const confirm = window.confirm(`Clear player ${index + 1} and all cards?`);
    if (!confirm) return;
    const tempNewPDs = [...newPlayerDecks];
    tempNewPDs[index] = { ...emptyNewPlayerDeck };
    setNewPlayerDecks(tempNewPDs);
    setWinnerIdx(-1);
  };

  const handleMulligan = (playerIdx: number, mulliganTo: number) => {
    const tempNewPDs = [...newPlayerDecks];
    tempNewPDs[playerIdx].mulligan_count = mulliganTo;
    setNewPlayerDecks(tempNewPDs);
  };

  const setNthNewPlayerDeckFactory =
    (n: number): SetNewPlayerDeckFunctionType =>
    ({ player, deck, cards }) => {
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

      if (cards) {
        tempNewPDs[n].cards = cards;
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
    setErrorMsg("");
    setIsNewPlayerDialogOpen(false);
    setNewPlayerDialogPlayerName("");
    setNewPlayerDialogOpenedFromIndex(-1);
  };
  const handleSubmitNewPlayerDialog = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    const resp = await callAPI("/players", {
      method: "POST",
      body: { name: newPlayerDialogPlayerName.trim() },
    });
    const newPlayer = await resp.json();
    setIsLoading(false);
    if (newPlayer.message) {
      setErrorMsg(newPlayer.message);
      return;
    }
    setTimeout(() => (document.activeElement as HTMLElement)?.blur(), 100);
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
    setErrorMsg("");
    setNewDeckDialogPlayer({ ...fakePlayer });
    setIsNewDeckDialogOpen(false);
    setNewDeckDialogDeckName("");
    setNewDeckDialogOpenedFromIndex(-1);
  };
  const handleSubmitNewDeckDialog = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    const resp = await callAPI("/decks", {
      method: "POST",
      body: {
        player_id: newDeckDialogPlayer.id,
        name: newDeckDialogDeckName.trim(),
      },
    });
    const newDeck = await resp.json();
    setIsLoading(false);
    if (newDeck.message) {
      setErrorMsg(newDeck.message);
      return;
    }
    setTimeout(() => (document.activeElement as HTMLElement)?.blur(), 100);
    const tempNewPDs = [...newPlayerDecks];
    tempNewPDs[newDeckDialogOpenedFromIndex].deck = newDeck;
    setNewPlayerDecks(tempNewPDs);
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

    if (winnerIdx < 0) {
      const shouldSubmit = confirm("Submit this game with no winner?");
      if (!shouldSubmit) {
        return;
      }
    }

    const body = {
      date: getTodaysDate(),
      player_decks: newPlayerDecks.map((pd, i) => ({
        id: isEditing ? gpdIds[i] : undefined,
        player_id: pd.player.id,
        deck_id: pd.deck.id,
        first_player: firstPlayerIdx === i,
        is_winner: winnerIdx === i,
        mulligan_count: pd.mulligan_count,
        cards: pd.cards.filter((card) => !!card.name),
      })),
      notes,
    };
    const apiRoute = isEditing ? `/games/${gameId}/edit` : "/games";
    const resp = await callAPI(apiRoute, {
      method: "POST",
      body,
    });
    const newGame = await resp.json();
    if (newGame.id) {
      window.location.pathname = `/games/${newGame.id}`;
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
          {isEditing ? "Edit Game " + gameId : "Record a New Game"}
          {!isEditing && (
            <>
              <br />
              <Button
                variant="contained"
                size="small"
                color="error"
                sx={{ maxWidth: "150px", zIndex: "99" }}
                onClick={resetGame}
              >
                Reset Game
              </Button>
            </>
          )}
        </Typography>
        <FormControl component="form" onSubmit={handleSubmitNewGame}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            // className="space-y-6"
          >
            <Grid
              container
              spacing={4}
              columns={{ xs: 1, md: 2, lg: 4 }}
              rowSpacing={2}
              sx={{ justifyContent: "center" }}
            >
              {newPlayerDecks.map((newPlayerDeck, i) => {
                return (
                  <NewGameSinglePlayerDeck
                    index={i}
                    key={`player-${i}`}
                    newPlayerDeck={newPlayerDeck}
                    setNewPlayerDeck={setNthNewPlayerDeckFactory(i)}
                    players={players}
                    decks={decks}
                    firstPlayer={firstPlayerIdx === i}
                    handleFirstPlayerSwitch={(checked) =>
                      setFirstPlayerIdx(checked ? i : -1)
                    }
                    clearNthPlayer={clearNthPlayer}
                    handleMulligan={(mulliganCount: number) =>
                      handleMulligan(i, mulliganCount)
                    }
                    selectedPlayerIds={selectedPlayerIds}
                    selectedDeckIds={selectedDeckIds}
                    openNewPlayerDialog={handleOpenNewPlayerDialog}
                    openNewDeckDialog={handleOpenNewDeckDialog}
                    isEditing={isEditing}
                    errors={errors}
                  />
                );
              })}
              <Grid item xs={4} sx={{ padding: "0 !important" }} />
              <Grid
                item
                xs={1}
                className="flex flex-row items-center space-x-1"
              >
                <Box>⭐</Box>
                <FormControl fullWidth>
                  <InputLabel htmlFor="winner-select">Winner</InputLabel>
                  {isMobile ? (
                    <NativeSelect
                      inputProps={{ id: "winner-select" }}
                      disabled={
                        selectedPlayerIds.has(-1) ||
                        selectedPlayerIds.size < newPlayerDecks.length
                      }
                      value={winnerIdx}
                      onChange={(e) => setWinnerIdx(Number(e.target.value))}
                    >
                      <option disabled value={-1}>
                        Winner
                      </option>
                      {newPlayerDecks.map((newPD, i) => (
                        <option key={i} value={i}>
                          {newPD.player.name}
                        </option>
                      ))}
                    </NativeSelect>
                  ) : (
                    <Select
                      size="small"
                      disabled={
                        selectedPlayerIds.has(-1) ||
                        selectedPlayerIds.size < newPlayerDecks.length
                      }
                      value={winnerIdx}
                      onChange={(e: SelectChangeEvent<number>) =>
                        setWinnerIdx(Number(e.target.value))
                      }
                    >
                      <MenuItem disabled value={-1}>
                        Winner
                      </MenuItem>
                      {newPlayerDecks.map((newPD, i) => (
                        <MenuItem key={i} value={i}>
                          {newPD.player.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
                <Box>⭐</Box>
              </Grid>
              <Grid item xs={4} sx={{ padding: "0 !important" }} />
              <Grid item xs={1} lg={2}>
                <TextField
                  id="notes"
                  label="Notes"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
            </Grid>

            {errorMsg && <FormHelperText error>{errorMsg}</FormHelperText>}
            <Button
              type="submit"
              variant="contained"
              sx={{
                marginTop: "2rem",
                paddingX: "2rem",
                letterSpacing: "0.125rem",
              }}
            >
              {isEditing ? "Submit Edited Game" : "Submit New Game"}
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
        errorMsg={errorMsg}
        isSmOrSmaller={isSmOrSmaller}
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
        errorMsg={errorMsg}
        isSmOrSmaller={isSmOrSmaller}
      />
    </PageWrapper>
  );
}
