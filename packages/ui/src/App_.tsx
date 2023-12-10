//TODO: get rid of this after adding uint test
import { AppBar, Box, Container, Grid, Link, Toolbar, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Account from './components/Account';
import AddLiquidity from './pages/AddLiquidity';
import RemoveLiquidity from './pages/RemoveLiquidity';
import Stats from './pages/Stats';
import Swap from './routes/swap';

function App() {
  const routes = [
    { href: '/swap', name: 'Swap' },
    { href: '/pool', name: 'Pool' },
  ]

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6'>Tinyswap</Typography>
            <Box sx={{ flexGrow: 1 }}>
              {routes.map(({ href, name }) =>
                <Link key={name} sx={{ ml: 2 }} href={href} color="#fff" underline='none'>{name}</Link>
              )}
            </Box>
            <Account />
          </Toolbar>
        </AppBar>

        <Grid container spacing={3} sx={{ mt: '20px' }}>
          <Grid item xs={6}>
            <AddLiquidity />
          </Grid>
          <Grid item xs={6}>
            <RemoveLiquidity />
          </Grid>
          <Grid item xs={6}>
            <Swap />
          </Grid>
          <Grid item xs={6}>
            <Stats />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
