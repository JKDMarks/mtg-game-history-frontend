import { useContext, useEffect, useState } from "react";
import { PageWrapper } from "../../components";
import { PlayerWithDecks, fetchPlayers } from "../../helpers";
import { Box, Grid, Link, Typography } from "@mui/material";
import { IsLoadingContext } from "../../App";

export default function PlayersPage() {
  const { setIsLoading } = useContext(IsLoadingContext);
  const [players, setPlayers] = useState<PlayerWithDecks[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchPlayers(setPlayers);
      setIsLoading(false);
    };
    fetchData();
  }, [setIsLoading]);

  return (
    <PageWrapper>
      <>
        <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
          Players
        </Typography>
        <Grid container columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {players.length > 0 &&
            players.map((player, pIdx) => (
              <Grid item xs={1}>
                <Box className="border border-solid border-gray-400 rounded flex flex-col items-start text-left p-1 h-100 w-100">
                  <Link href={`/players/${player.id}`}>{player.name}</Link>

                  {!!player.decks && player.decks.length > 0 ? (
                    <ul
                      style={{
                        listStyleType: "disc",
                        marginLeft: "20px",
                      }}
                    >
                      {player.decks.map((deck, dIdx) => (
                        <li
                          key={`p-${pIdx}-d-${dIdx}`}
                          style={{ marginTop: "4px" }}
                        >
                          <Link href={`/decks/${deck.id}`}>{deck.name}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Box className="text-gray-400">No decks</Box>
                  )}
                </Box>
              </Grid>
            ))}
        </Grid>
      </>
    </PageWrapper>
  );
}
