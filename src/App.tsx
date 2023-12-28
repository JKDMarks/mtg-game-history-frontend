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
  SignupPage,
} from "./pages";
import { callAPI, getURLPathnameFromRequest } from "./helpers";
import { PlayerPage } from "./pages/Players";

export const ROOT_ROUTE_ID = "root";

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
          const resp2 = await callAPI("/players/me");
          return await resp2.json();
        }

        return null;
      }}
    >
      <Route path="" element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="games">
        <Route path="new" element={<NewGamePage />} />
        <Route path=":gameId" element={<GamePage />} />
      </Route>
      <Route path="players">
        <Route path="me" element={<PlayerPage me />} />
        <Route path=":playerId" element={<PlayerPage />} />
      </Route>
      <Route path="decks">
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
