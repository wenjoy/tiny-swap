import {
  Alert,
  AlertTitle,
  AppBar,
  Box,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AlertContext } from '..';
import Account from '../components/Account';
import { CHAIN_ID_SEPOLIA } from '../utils/const';

function Root() {
  const routes = [
    { href: '/swap', name: 'Swap' },
    { href: '/pool', name: 'Pool' },
  ];
  const location = useLocation();
  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  const [alertError, setAlertError] = useState({ message: '' });
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum
        .request({ method: 'eth_chainId' })
        .then((chainId: string) => {
          if (chainId !== CHAIN_ID_SEPOLIA) {
            setAlertError({
              message: `
            This app only works on <strong>Sepolia</strong>, please change your network in <strong>Metamask</strong>
            `,
            });
          }
        });
    }

    window.onerror = (error) => {
      console.error(error);

      setAlertError({
        message: 'Unexpect error happend, please refresh page and try again',
      });
    };
  }, []);

  return (
    <>
      <AlertContext.Provider value={{ alertError, setAlertError }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Tinyswap</Typography>
            <Box sx={{ flexGrow: 1 }}>
              {routes.map(({ href, name }) => (
                <NavLink
                  key={name}
                  to={href}
                  style={{ textDecoration: 'none' }}
                >
                  {({ isActive, isPending, isTransitioning }) => (
                    <Typography
                      sx={{
                        ml: 2,
                        display: 'inline',
                        ':hover': { color: '#f4dfc8' },
                      }}
                      color={isActive ? '#ffd28f' : '#fff'}
                    >
                      {name}
                    </Typography>
                  )}
                </NavLink>
              ))}
            </Box>
            <Account />
          </Toolbar>
        </AppBar>
        {alertError.message && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            <div dangerouslySetInnerHTML={{ __html: alertError.message }}></div>
          </Alert>
        )}
        <Box>
          <Outlet />
        </Box>
      </AlertContext.Provider>
    </>
  );
}

export default Root;
