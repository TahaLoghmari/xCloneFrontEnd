import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NewsFeed from "./NewsFeed";
import Login from "./Login";
import Register from "./Register";
import Authentication from "./Authentication";
import PostPage from "./PostPage";
import Reply from "./Reply";

let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <NewsFeed />,
      },
      {
        path: ":creatorUserName/:creatorId/:postId",
        element: <PostPage />,
      },
    ],
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
    ],
  },
]);

export default router;
