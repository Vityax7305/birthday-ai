import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { PlannerProvider } from "./context/PlannerContext";

export default function App() {
  return (
    <PlannerProvider>
      <RouterProvider router={router} />
    </PlannerProvider>
  );
}