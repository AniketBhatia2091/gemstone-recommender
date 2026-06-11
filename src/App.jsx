import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/result',
    element: <Result />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

/**
 * App — Root component with client-side routing
 */
export default function App() {
  return <RouterProvider router={router} />;
}
