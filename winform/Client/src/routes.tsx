import { useRoutes, Navigate } from "react-router-dom";

//layouts
import AppLayout from "./layouts/App/App";

//pages
import Dashboard from "./layouts/App/components/Dashboard";
import { NotFound } from "./layouts/App/pages/NotFound";
import FormBuilderCreate from "./pages/FormBuilder/FormBuilderCreate";
import SetFormTree from "./pages/FormTree/SetFormTree";
// import Main from './pages/Main';

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "formtree", element: <SetFormTree /> },
      ],
    },
    {
      path: "/formbuilder",
      element: <AppLayout />,
      children: [{ path: "create", element: <FormBuilderCreate/> }],
    },
    {
      path: "/formbuilder",
      element: <AppLayout />,
      children: [{ path: ":id", element: <FormBuilderCreate/> }],
    },
    {
      path: "/404",
      element: <NotFound />,
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
