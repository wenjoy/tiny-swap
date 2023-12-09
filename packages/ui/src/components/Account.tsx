import { Avatar, Box, Tooltip } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { getSigner } from '../utils';

function Account() {
  const [account, setAccount] = useState('')
  useEffect(() => {
    async function fetchAccount() {
      const account = await getSigner()
      console.log('Account-10-account', account)
      setAccount(account.address)
    }

    fetchAccount().catch(err => console.error(err))
  }, [])
  return <Box>
    <Tooltip title={account}>
      <Avatar sx={{ bgcolor: deepOrange[500] }}>{account.substring(0, 4)}</Avatar>
    </Tooltip>
  </Box>
}

export default Account;