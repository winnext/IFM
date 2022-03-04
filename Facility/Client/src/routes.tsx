import { useRoutes, Navigate } from 'react-router-dom';

//pages
import Main from './pages/Main';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [{ path: '', element: <Main /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
