import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NewsFeed from "./NewsFeed";
import Login from "./Login";
import Register from "./Register";
import Authentication from "./Authentication";
import OAuthCallback from "./OAuthCallback";

let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ path: "home", element: <NewsFeed /> }],
  },
  {
    path: "/auth",
    element: <Authentication />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Register />,
      },
      { path: "callback", element: <OAuthCallback /> },
    ],
  },
]);

export default router;
