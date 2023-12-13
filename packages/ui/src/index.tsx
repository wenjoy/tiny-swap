import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container, CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AddLiquidity from './pages/AddLiquidity';
import ErrorPage from './pages/ErrorPage';
import RemoveLiquidity from './pages/RemoveLiquidity';
import reportWebVitals from './reportWebVitals';
import Pool from './routes/pool';
import Root from './routes/root';
import Swap from './routes/swap';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/", element: <Root />, errorElement: <ErrorPage />,
    children: [
      { path: "/swap", element: <Swap /> },
      {
        path: "/pool", element: <Pool />, children: [
          { path: "/pool/add-liquidity", element: <AddLiquidity /> },
          { path: "/pool/remove-liquidity", element: <RemoveLiquidity /> }
        ]
      }
    ]
  },
])
root.render(
  <React.StrictMode>
    <CssBaseline />
    <Container maxWidth="md">
      <RouterProvider router={router} />
    </Container>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
