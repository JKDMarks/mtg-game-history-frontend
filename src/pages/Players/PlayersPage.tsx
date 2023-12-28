import { useEffect, useState } from "react";
import { PageWrapper } from "../../components";
import { Player, fetchPlayers } from "../../helpers";
import { Box, Link, Typography } from "@mui/material";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetchPlayers(setPlayers);
  }, []);

  // TODO: Make this page look better
  return (
    <PageWrapper>
      <>
        <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
          Players
        </Typography>
        <Box className="flex flex-col space-y-2">
          {players.length > 0 &&
            players.map((player) => (
              <Link href={`/players/${player.id}`}>{player.name}</Link>
            ))}
        </Box>
      </>
    </PageWrapper>
  );
}
