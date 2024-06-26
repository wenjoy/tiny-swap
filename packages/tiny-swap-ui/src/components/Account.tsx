import { Avatar, Box, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { getSigner } from '../utils';

function Account() {
  const [account, setAccount] = useState('');
  useEffect(() => {
    async function fetchAccount() {
      const account = await getSigner();
      setAccount(account.address);
    }

    fetchAccount().catch((err) => console.error(err));
  }, []);
  return (
    <Box>
      <Tooltip title={account}>
        <Avatar sx={{ bgcolor: '#FFC436' }}>{account.substring(0, 4)}</Avatar>
      </Tooltip>
    </Box>
  );
}

export default Account;
