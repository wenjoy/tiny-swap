import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getSigner } from '../utils';

function Account() {
  const [account, setAccount] = useState('')
  useEffect(() => {
    async function fetchAccount () {
      const account = await getSigner()
      console.log('Account-10-account', account)
      setAccount(account.address)
    }
    
    fetchAccount().catch(err => console.error(err))
  }, [])
  return <Box>
     <Typography>Account: {account}</Typography>
  </Box>
}

export default Account;