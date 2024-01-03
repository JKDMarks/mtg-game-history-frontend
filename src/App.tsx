import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from "react-router-dom";

import {
  DeckPage,
  GamePage,
  HomePage,
  LoginPage,
  NewGamePage,
  NotFoundPage,
  PlayersPage,
  SignupPage,
  SinglePlayerPage,
} from "./pages";
import { callAPI, getURLPathnameFromRequest } from "./helpers";

export const ROOT_ROUTE_ID = "root";

const redirectHome = () => redirect("/");

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      id={ROOT_ROUTE_ID}
      loader={async ({ request }) => {
        const urlPathname = getURLPathnameFromRequest(request);
        if (!["/login", "/signup"].includes(urlPathname)) {
          const resp = await callAPI("/test");
          if (resp.status !== 200) {
            return redirect("/login");
          }
        }
        const resp2 = await callAPI("/players/me");
        return await resp2.json();
      }}
    >
      <Route path="" element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="games">
        <Route index loader={redirectHome} />
        <Route path="new" element={<NewGamePage />} />
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
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
