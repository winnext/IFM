import { useRoutes, Navigate } from "react-router-dom";

//layouts
import AppLayout from "./layouts/App/App";

//pages
import Dashboard from "./layouts/App/components/Dashboard";
import { NotFound } from "./layouts/App/pages/NotFound";
import FormBuilder from "./pages/FormBuilder/FormBuilder";
import FormBuilderCreate from "./pages/FormBuilder/FormBuilderCreate";
import EditForm from "./pages/TestForm/EditForm";
import TestForm from "./pages/TestForm/TestForm";
import FormTree from "./pages/FormTree/FormTree";
import SetFormTree from "./pages/FormTree/SetFormTree";
// import Main from './pages/Main';

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "formbuilder", element: <FormBuilder /> },
        { path: "test-form", element: <TestForm /> },
        { path: "formtree", element: <FormTree /> },
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
      path: "/formtree",
      element: <AppLayout />,
      children: [{ path: ":id", element: <SetFormTree /> }],
    },
    {
      path: "/test-form",
      element: <AppLayout />,
      children: [{ path: "edit-form", element: <EditForm/> }],
    },
    {
      path: "/404",
      element: <NotFound />,
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
