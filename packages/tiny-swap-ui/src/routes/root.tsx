import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AlertContext } from '..';
import NavBar from '../components/NavBar';
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
  const [noteDialog, setNoteDialog] = useState(true);

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

        <Dialog open={noteDialog}>
          <DialogTitle>NOTE</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This app is specifically designed for mastering Uniswap. If you're
              keen on trying it out, please send me an email, and I'll provide
              you with some test tokens.
            </DialogContentText>
            <DialogContentText>
              <Link href="mailto:laojiaodaoniu@gmail.com">Send email</Link>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNoteDialog(false)}>Dismiss</Button>
          </DialogActions>
          <Typography></Typography>
        </Dialog>

        <NavBar routes={routes} />
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
