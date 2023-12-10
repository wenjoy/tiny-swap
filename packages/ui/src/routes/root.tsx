import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import Account from '../components/Account';

function Root() {
  const routes = [
    { href: '/swap', name: 'Swap' },
    { href: '/pool', name: 'Pool' },
  ]

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>Tinyswap</Typography>
          <Box sx={{ flexGrow: 1 }}>
            {routes.map(({ href, name }) =>
              <NavLink key={name} to={href} style={{ textDecoration: 'none' }}>
                {({ isActive, isPending, isTransitioning }) =>
                  <Typography
                    sx={{ ml: 2, display: 'inline', ":hover": { color: '#f4dfc8' } }}
                    color={isActive ? '#ffd28f' : "#fff"}>
                    {name}
                  </Typography>
                }
              </NavLink>
            )}
          </Box>
          <Account />
        </Toolbar>
      </AppBar>

      <Box>
        <Outlet />
      </Box>
    </>
  );
}

export default Root