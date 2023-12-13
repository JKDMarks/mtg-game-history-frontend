import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from "react-router-dom";
import { HomePage, LoginPage, NotFoundPage, SignupPage } from "./pages";
import { callAPI, getURLPathnameFromRequest } from "./utils";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      loader={async ({ request }) => {
        const urlPathname = getURLPathnameFromRequest(request);
        if (!["/login", "/signup"].includes(urlPathname)) {
          const resp = await callAPI("/test");
          if (resp.status !== 200) {
            return redirect("/login");
          }
        }

        return null;
      }}
    >
      <Route path="" element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
