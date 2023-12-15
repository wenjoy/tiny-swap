import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container, CssBaseline } from '@mui/material';
import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AddLiquidity from './pages/AddLiquidity';
import ErrorPage from './pages/ErrorPage';
import RemoveLiquidity from './pages/RemoveLiquidity';
import reportWebVitals from './reportWebVitals';
import Pool from './routes/pool';
import Root from './routes/root';
import Swap from './routes/swap';

export const RefreshContext = createContext(null);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      cacheTime: 0,
      retry: 0,
    },
  },
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/", element: <Root />, errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to='/swap' /> },
      { path: "/swap", element: <Swap /> },
      {
        path: "/pool", element: <Pool />, children: [
          { index: true, element: <Navigate to='/pool/add-liquidity' /> },
          { path: "/pool/add-liquidity", element: <AddLiquidity /> },
          { path: "/pool/remove-liquidity", element: <RemoveLiquidity /> }
        ]
      }
    ]
  },
])
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <CssBaseline />
        <Container maxWidth="md">
          <RouterProvider router={router} />
        </Container>
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
