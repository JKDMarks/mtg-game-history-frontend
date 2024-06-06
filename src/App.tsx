import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from "react-router-dom";

import {
  AboutPage,
  AllGamesPage,
  DeckPage,
  GamePage,
  HomePage,
  LoginPage,
  NewOrEditGamePage,
  NotFoundPage,
  PlayersPage,
  ProfilePage,
  SignupPage,
  SinglePlayerPage,
} from "./pages";
import { callAPI, fetchAllCardNames } from "./helpers";
import { createContext, useState } from "react";
import "./App.css";

export const ROOT_ROUTE_ID = "root";
export const GAMES_ROUTE_ID = "games";

const redirectHome = () => redirect("/");

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      id={ROOT_ROUTE_ID}
      loader={
        async (/*{ request }*/) => {
          // const urlPathname = getURLPathnameFromRequest(request);
          // if (!["/login", "/signup"].includes(urlPathname)) {
          //   const resp = await callAPI("/test");
          //   if (resp.status !== 200) {
          //     return redirect("/login");
          //   }
          // }
          const resp = await callAPI("/me");
          return await resp.json();
        }
      }
    >
      <Route path="" element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route
        path="games"
        id={GAMES_ROUTE_ID}
        loader={async () => await fetchAllCardNames()}
      >
        <Route index element={<AllGamesPage />} />
        <Route path="new" element={<NewOrEditGamePage />} />
        <Route path=":gameId/edit" element={<NewOrEditGamePage isEditing />} />
        <Route path=":gameId" element={<GamePage />} />
      </Route>
      <Route path="players">
        <Route index element={<PlayersPage />} />
        <Route path=":playerId" element={<SinglePlayerPage />} />
      </Route>
      <Route path="decks">
        <Route index loader={redirectHome} />
        <Route path=":deckId" element={<DeckPage />} />
      </Route>
      <Route path="profile" element={<ProfilePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

interface IsLoadingContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}
export const IsLoadingContext = createContext<IsLoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isLoadingContext = { isLoading, setIsLoading };

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2147483647,
          }}
        >
          <img
            src="/WUBRG.png"
            className="spin"
            height="150px"
            width="150px"
            alt="spinning mana pentagon"
          />
        </div>
      )}

      <IsLoadingContext.Provider value={isLoadingContext}>
        <RouterProvider router={router} />
      </IsLoadingContext.Provider>
    </>
  );
}

export default App;
