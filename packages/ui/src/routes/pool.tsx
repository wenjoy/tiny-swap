import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../components/TabPanel';
import AddLiquidity from '../pages/AddLiquidity';
import RemoveLiquidity from '../pages/RemoveLiquidity';
import Stats from '../pages/Stats';

function Pool() {
  const [currentTab, setCurrentTab] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return <Box>
    <Box>
      <Tabs value={currentTab} onChange={handleChange}>
        <Tab label="Add liquidity" />
        <Tab label="Remove liquidity" />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
        <AddLiquidity />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <RemoveLiquidity />
      </TabPanel>
      <Stats />
    </Box>
  </Box>
}

export default Pool