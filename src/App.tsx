import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from "react-router-dom";
import { HomePage, LoginPage, NotFoundPage } from "./pages";
import { callAPI, getPlayerAuth, getURLPathnameFromRequest } from "./utils";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      loader={async ({ request }) => {
        const urlPathname = getURLPathnameFromRequest(request);
        if (!["/login", "/signup"].includes(urlPathname)) {
          const playerAuth = getPlayerAuth();
          if (!playerAuth) {
            return redirect("/login");
          }
          const resp = await callAPI(
            "/auth/is-authed?playerId=" + encodeURIComponent(playerAuth)
          );
          const isAuthed = resp.text();
          if (!isAuthed) {
            return redirect("/login");
          }
        }

        return null;
      }}
    >
      <Route path="" element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
