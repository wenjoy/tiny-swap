import { Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { RefreshContext } from '..';
import { tokenBalance } from '../utils';

function Balance({
  token: tokenAddress,
  owner,
  simple,
}: {
  token: string;
  owner?: string;
  simple?: boolean;
}) {
  const [balance, setBalance] = useState('');
  const refresh = useContext(RefreshContext);

  useEffect(() => {
    async function fetchBalance() {
      const balance = await tokenBalance(tokenAddress, owner);
      setBalance(balance);
      // Disable continously fetch temporarily
      // setTimeout(() => {
      //   fetchBalance().catch(err => console.error(err))
      // }, 10000);
    }
    fetchBalance().catch((err) => console.error(err));
  }, [tokenAddress, refresh]);

  return (
    <Typography align="right">
      {simple ? '' : 'Balance: '}
      {balance}
    </Typography>
  );
}

export default Balance;
