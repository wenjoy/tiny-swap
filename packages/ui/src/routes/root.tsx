import {
  Alert,
  AlertTitle,
  AppBar,
  Box,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Account from '../components/Account';
import { CHAIN_ID_SEPOLIA } from '../utils/const';

function Root() {
  const routes = [
    { href: '/swap', name: 'Swap' },
    { href: '/pool', name: 'Pool' },
  ];

  const [networkError, setNetworkError] = useState(false);
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum
        .request({ method: 'eth_chainId' })
        .then((chainId: string) => {
          if (chainId !== CHAIN_ID_SEPOLIA) {
            setNetworkError(true);
          }
        });
    }
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Tinyswap</Typography>
          <Box sx={{ flexGrow: 1 }}>
            {routes.map(({ href, name }) => (
              <NavLink key={name} to={href} style={{ textDecoration: 'none' }}>
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
      {networkError && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          This app only works on <strong>Sepolia</strong>, please change your
          network in <strong>Metamask</strong>
        </Alert>
      )}
      <Box>
        <Outlet />
      </Box>
    </>
  );
}

export default Root;
