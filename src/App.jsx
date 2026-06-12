import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

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
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

/**
 * App — Root component with client-side routing
 */
export default function App() {
  return <RouterProvider router={router} />;
}
