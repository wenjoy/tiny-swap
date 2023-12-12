import { Paper, Tab, Tabs } from '@mui/material';
import { useReducer, useState } from 'react';
import TabPanel from '../components/TabPanel';
import AddLiquidity from '../pages/AddLiquidity';
import RemoveLiquidity from '../pages/RemoveLiquidity';

function Pool() {
  const [currentTab, setCurrentTab] = useState(0)
  const [refresh, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return <Paper sx={{ p: 2, height: '90vh', borderTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
    <Tabs value={currentTab} onChange={handleChange}>
      <Tab label="Add liquidity" />
      <Tab label="Remove liquidity" />
    </Tabs>
    <TabPanel value={currentTab} index={0}>
      <AddLiquidity onLiquidityAdded={forceUpdate} refresh={refresh} />
    </TabPanel>
    <TabPanel value={currentTab} index={1}>
      <RemoveLiquidity onLiquidityRemoved={forceUpdate} />
    </TabPanel>
  </Paper>
}

export default Pool