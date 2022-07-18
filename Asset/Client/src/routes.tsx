import { useRoutes, Navigate } from "react-router-dom";

//layouts
import AppLayout from "./layouts/App/App";

//pages
import Dashboard from "./layouts/App/components/Dashboard";
import { NotFound } from "./layouts/App/pages/NotFound";
import SetAsset from "./pages/Asset/SetAsset";
import FormGenerate from "./pages/FormGenerate/FormGenerate";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "assets", element: <SetAsset /> },
        { path: "formgenerate", element: <FormGenerate />},
      ],
    },
    {
      path: "/formgenerate",
      element: <AppLayout />,
      children: [{ path: ":id", element: <FormGenerate/> }],
    },
    {
      path: "/404",
      element: <NotFound />,
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
