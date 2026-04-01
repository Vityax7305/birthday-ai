import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Chat } from "./pages/Chat";
import { Planner } from "./pages/Planner";
import { Ideas } from "./pages/Ideas";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "chat", element: <Chat /> },
      { path: "planner", element: <Planner /> },
      { path: "ideas", element: <Ideas /> },
    ],
  },
]);