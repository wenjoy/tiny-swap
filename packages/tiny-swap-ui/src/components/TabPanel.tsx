import { Box } from '@mui/material';

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  index: number;
  value: number;
}) {
  return <Box sx={{ p: { xs: 0, sm: 2 } }}>{value === index && children}</Box>;
}

export default TabPanel;
