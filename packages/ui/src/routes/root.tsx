import {
  Alert,
  AlertTitle,
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AlertContext } from '..';
import Account from '../components/Account';
import { CHAIN_ID_SEPOLIA } from '../utils/const';

export enum Severity {
  Error = 'error',
  Success = 'success',
}

function Root() {
  const routes = [
    { href: '/swap', name: 'Swap' },
    { href: '/pool', name: 'Pool' },
  ];

  const [alert, setAlert] = useState({
    message: '',
    severity: Severity.Success,
  });
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum
        .request({ method: 'eth_chainId' })
        .then((chainId: string) => {
          if (chainId !== CHAIN_ID_SEPOLIA) {
            setAlert({
              severity: Severity.Error,
              message: `
            This app only works on <strong>Sepolia</strong>, please change your network in <strong>Metamask</strong>
            `,
            });
          }
        });
    }

    window.onerror = (error) => {
      console.error(error);

      setOpenDialog(true);
    };
  }, []);

  return (
    <>
      <AlertContext.Provider value={{ alert, setAlert }}>
        <Dialog open={openDialog}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Unexpect error happend, please refresh page and try again
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </DialogActions>
        </Dialog>
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
        {alert.message && (
          <Alert severity={alert.severity}>
            <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
            <div dangerouslySetInnerHTML={{ __html: alert.message }}></div>
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
