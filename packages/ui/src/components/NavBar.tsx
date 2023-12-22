import { CurrencyExchange, Waves } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Account from './Account';

export type RouteData = {
  href: string;
  name: string;
};

function NavBar({ routes }: { routes: RouteData[] }) {
  const handleOpenNavMenu = () => {
    setOpenMenu(true);
  };
  const handleCloseNavMenu = () => {
    setOpenMenu(false);
  };
  const [openMenu, setOpenMenu] = useState(false);
  const ref = useRef(null);

  function renderNavlink(routes: RouteData[]) {
    return routes.map(({ href, name }) => (
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
    ));
  }
  function renderMenulink(routes: RouteData[]) {
    return routes.map(({ href, name }) => (
      <MenuItem key={name} onClick={handleCloseNavMenu}>
        <NavLink key={name} to={href} style={{ textDecoration: 'none' }}>
          {({ isActive, isPending, isTransitioning }) => {
            const color = isActive ? '#ffd28f' : '#000';
            return (
              <ListItemIcon sx={{ alignItems: 'center' }}>
                {name === 'Swap' ? (
                  <CurrencyExchange sx={{ color }} fontSize="inherit" />
                ) : (
                  <Waves sx={{ color }} fontSize="inherit" />
                )}
                <Typography color={color} sx={{ ml: 1 }}>
                  {name}
                </Typography>
              </ListItemIcon>
            );
          }}
        </NavLink>
      </MenuItem>
    ));
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 'auto' }}>
          <IconButton
            ref={ref}
            onClick={handleOpenNavMenu}
            size="large"
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={ref.current}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={openMenu}
          >
            {renderMenulink(routes)}
          </Menu>
        </Box>
        <Typography variant="h6" sx={{ mr: 'auto' }}>
          Tinyswap
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {renderNavlink(routes)}
        </Box>
        <Account />
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
