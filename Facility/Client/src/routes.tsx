import { useRoutes, Navigate } from "react-router-dom";

//layouts
import AppLayout from "./layouts/App/App";

//pages
import Dashboard from "./layouts/App/components/Dashboard";
import Facility from "./pages/Facility";
import Classifications from "./pages/Classifications/Classifications";
import { NotFound } from "./layouts/App/pages/NotFound";
import SetClassification from "./pages/Classifications/SetClassification";
import FacilityFileImport from "./pages/FacilityFileImport";
import ClassificationFileImport from "./pages/ClassificationFileImport";
import FacilityStructure from "./pages/FacilityStructure/FacilityStructure";
import SetFacilityStructure from "./pages/FacilityStructure/SetFacilityStructure";
import FormBuilder from "./pages/FormBuilder/FormBuilder";
import FormBuilderCreate from "./pages/FormBuilder/FormBuilderCreate";
import FormGenerate from "./pages/Form/FormGenerate";
// import Main from './pages/Main';

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "facility", element: <Facility /> },
        { path: "classifications", element: <Classifications /> },
        { path: "facilitystructure", element: <FacilityStructure /> },
        { path: "formbuilder", element: <FormBuilder /> },
        { path: "formgenerate", element: <FormGenerate />},
      ],
    },
    {
      path: "/classifications",
      element: <AppLayout />,
      children: [{ path: ":id", element: <SetClassification /> }],
    },
    {
      path: "/facilitystructure",
      element: <AppLayout />,
      children: [{ path: ":id", element: <SetFacilityStructure /> }],
    },
    {
      path: "/facility",
      element: <AppLayout />,
      children: [{ path: "fileimport", element: <FacilityFileImport /> }],
    },
    {
      path: "/classifications",
      element: <AppLayout />,
      children: [{ path: "fileimport", element: <ClassificationFileImport /> }],
    },
    {
      path: "/formbuilder",
      element: <AppLayout />,
      children: [{ path: "create", element: <FormBuilderCreate/> }],
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
