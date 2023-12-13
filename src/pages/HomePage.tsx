import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <Box className="p-5">
      <div>
        <Button
          variant="contained"
          onClick={async () => {
            navigate("/login");
          }}
        >
          hi
        </Button>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button
          variant="contained"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div
        style={{
          height: "300px",
          border: "1px solid black",
          backgroundColor: "white",
        }}
      >
        hi
      </div>
    </Box>
  );
}

export default HomePage;
