import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container, CssBaseline } from '@mui/material';
import React, { Dispatch, SetStateAction, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import AddLiquidity from './pages/AddLiquidity';
import ErrorPage from './pages/ErrorPage';
import RemoveLiquidity from './pages/RemoveLiquidity';
import Stats from './pages/Stats';
import reportWebVitals from './reportWebVitals';
import Pool from './routes/pool';
import Root, { Severity } from './routes/root';
import Swap from './routes/swap';

export type AlertContext = {
  alert: {
    severity: Severity;
    message: string;
  };
  setAlert: Dispatch<SetStateAction<{ severity: Severity; message: string }>>;
};
export const RefreshContext = createContext(null);
export const AlertContext = createContext<AlertContext>(null!);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      cacheTime: 0,
      retry: 0,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Navigate to="/swap" /> },
        { path: '/swap', element: <Swap /> },
        {
          path: '/stats',
          element: <Stats />,
          children: [{ path: ':account', element: <Stats /> }],
        },
        {
          path: '/pool',
          element: <Pool />,
          children: [
            { index: true, element: <Navigate to="/pool/add-liquidity" /> },
            { path: '/pool/add-liquidity', element: <AddLiquidity /> },
            { path: '/pool/remove-liquidity', element: <RemoveLiquidity /> },
          ],
        },
      ],
    },
  ],
  {
    basename: '/tiny-swap',
  }
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Container maxWidth="md">
        <RouterProvider router={router} />
      </Container>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
