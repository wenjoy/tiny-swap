import { Paper, Tab, Tabs } from '@mui/material';
import { Link, Outlet, useMatch } from 'react-router-dom';
import TabPanel from '../components/TabPanel';

function Pool() {
  const match = useMatch('/pool/add-liquidity');

  const currentTab = match ? 0 : 1;

  return (
    <Paper
      sx={{
        p: { xs: 0, sm: 2 },
        height: { xm: '90vh', xs: 'auto' },
        borderTop: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <Tabs value={currentTab}>
        <Tab label="Add liquidity" to="/pool/add-liquidity" component={Link} />
        <Tab
          label="Remove liquidity"
          to="/pool/remove-liquidity"
          component={Link}
        />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
        <Outlet />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <Outlet />
      </TabPanel>
    </Paper>
  );
}

export default Pool;
