import { useEffect, useState } from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { PageWrapper } from "../../components";
import { fetchGames, Game } from "../../helpers";
import { Link } from "@mui/material";

export default function AllGamesPage() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchGames(setGames);
  }, []);

  const getCellClassName = (params: GridCellParams, idx: number) => {
    return params.row.winnerIdx === idx ? "bg-green-100" : "";
  };

  const getPlayerCellComponent = (
    params: GridRenderCellParams,
    accessorStr: string
  ) => {
    return (
      <Link href={`/players/${params.row[accessorStr]}`}>
        {params.formattedValue}
      </Link>
    );
  };

  const getDeckCellComponent = (
    params: GridRenderCellParams,
    accessorStr: string
  ) => {
    return (
      <Link href={`/decks/${params.row[accessorStr]}`}>
        {params.formattedValue}
      </Link>
    );
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 55 },
    {
      field: "date",
      headerName: "Date",
      width: 175,
    },
    {
      field: "player1",
      headerName: "Player 1",
      width: 175,
      cellClassName: (params) => getCellClassName(params, 0),
      renderCell: (params) => getPlayerCellComponent(params, "player1Id"),
    },
    {
      field: "deck1",
      headerName: "Deck 1",
      width: 175,
      cellClassName: (params) => getCellClassName(params, 0),
      renderCell: (params) => getDeckCellComponent(params, "deck1Id"),
    },
    {
      field: "player2",
      headerName: "Player 2",
      width: 175,
      cellClassName: (params) => getCellClassName(params, 1),
      renderCell: (params) => getPlayerCellComponent(params, "player2Id"),
    },
    {
      field: "deck2",
      headerName: "Deck 2",
      width: 175,
      cellClassName: (params) => getCellClassName(params, 1),
      renderCell: (params) => getDeckCellComponent(params, "deck2Id"),
    },
    {
      field: "player3",
      headerName: "Player 3",
      width: 175,
      cellClassName: (params) => getCellClassName(params, 2),
      renderCell: (params) => getPlayerCellComponent(params, "player3Id"),
    },
    {
      field: "deck3",
      headerName: "Deck 3",
      width: 175,
      cellClassName: (params) => getCellClassName(params, 2),
      renderCell: (params) => getDeckCellComponent(params, "deck3Id"),
    },
    {
      field: "player4",
      headerName: "Player 4",
      width: 175,
      cellClassName: (params) => getCellClassName(params, 3),
      renderCell: (params) => getPlayerCellComponent(params, "player4Id"),
    },
    {
      field: "deck4",
      headerName: "Deck 4",
      width: 175,
      cellClassName: (params) => getCellClassName(params, 3),
      renderCell: (params) => getDeckCellComponent(params, "deck4Id"),
    },
    // {
    //   field: "fullName",
    //   headerName: "Full name",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (value, row) =>
    //     `${row.firstName || ""} ${row.lastName || ""}`,
    // },
    { field: "notes", headerName: "Notes", width: 150, sortable: false },
  ];

  const rows = games.map(({ id, date, game_player_decks, notes }) => {
    const winnerIdx = game_player_decks.findIndex((gpd) => gpd.is_winner);
    return {
      id,
      date,
      notes,

      player1: game_player_decks[0]?.player.name,
      deck1: game_player_decks[0]?.deck.name,
      player1Id: game_player_decks[0]?.player.id,
      deck1Id: game_player_decks[0]?.deck.id,

      player2: game_player_decks[1]?.player.name,
      deck2: game_player_decks[1]?.deck.name,
      player2Id: game_player_decks[1]?.player.id,
      deck2Id: game_player_decks[1]?.deck.id,

      player3: game_player_decks[2]?.player.name,
      deck3: game_player_decks[2]?.deck.name,
      player3Id: game_player_decks[2]?.player.id,
      deck3Id: game_player_decks[2]?.deck.id,

      player4: game_player_decks[3]?.player.name,
      deck4: game_player_decks[3]?.deck.name,
      player4Id: game_player_decks[3]?.player.id,
      deck4Id: game_player_decks[3]?.deck.id,

      winnerIdx,
    };
  });

  return (
    <PageWrapper>
      <DataGrid
        columns={columns}
        rows={rows}
        sx={{ "& .MuiDataGrid-scrollbar": { left: 0 } }}
      ></DataGrid>
    </PageWrapper>
  );
}
