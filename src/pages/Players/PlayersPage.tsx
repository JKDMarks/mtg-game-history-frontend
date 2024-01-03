import { useEffect, useState } from "react";
import { PageWrapper } from "../../components";
import { Player, fetchPlayers } from "../../helpers";
import { Box, Link, Typography } from "@mui/material";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetchPlayers(setPlayers);
  }, []);

  return (
    <PageWrapper>
      <>
        <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
          Players
        </Typography>
        <Box className="flex justify-center">
          <Box className="flex flex-col space-y-3 w-64">
            {players.length > 0 &&
              players.map((player, pIdx) => (
                <Box key={pIdx} className="w-full h-full">
                  <Box className="border border-solid border-gray-400 rounded flex flex-col items-start px-2 py-0.5 text-left">
                    <Link href={`/players/${player.id}`}>{player.name}</Link>

                    {!!player.Decks && player.Decks.length > 0 ? (
                      <ul
                        style={{
                          listStyleType: "disc",
                          marginLeft: "20px",
                        }}
                      >
                        {player.Decks.map((deck, dIdx) => (
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
                </Box>
              ))}
          </Box>
        </Box>
      </>
    </PageWrapper>
  );
}
