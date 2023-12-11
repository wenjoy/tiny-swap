import { Paper, Tab, Tabs } from '@mui/material';
import { useReducer, useState } from 'react';
import TabPanel from '../components/TabPanel';
import AddLiquidity from '../pages/AddLiquidity';
import RemoveLiquidity from '../pages/RemoveLiquidity';
import Stats from '../pages/Stats';

function Pool() {
  const [currentTab, setCurrentTab] = useState(0)
  const [refresh, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return <Paper>
    <Tabs value={currentTab} onChange={handleChange}>
      <Tab label="Add liquidity" />
      <Tab label="Remove liquidity" />
    </Tabs>
    <TabPanel value={currentTab} index={0}>
      <AddLiquidity onLiquidityAdded={forceUpdate} />
      <Stats refresh={refresh} />
    </TabPanel>
    <TabPanel value={currentTab} index={1}>
      <RemoveLiquidity onLiquidityRemoved={forceUpdate} />
      <Stats refresh={refresh} />
    </TabPanel>
  </Paper>
}

export default Pool