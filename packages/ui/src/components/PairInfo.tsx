import { Box, Divider, Paper, Stack, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { TOKEN, getPairAddress, getReserves } from '../utils';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function PairInfo({ token0, token1, refresh }: { token0: TOKEN, token1: TOKEN, refresh: number }) {
  const [reserves, setReserves] = useState<BigInt[]>([])
  useEffect(() => {
    async function fetchAddress() {
      const pair = await getPairAddress(token0, token1)
      const reserves = await getReserves(pair);
      console.log('Stats-15-reserves', reserves)
      setReserves(reserves)
    }
    fetchAddress().catch(err => console.error(err))
  }, [refresh])
  return <Box>
    <Divider sx={{ mb: 4 }} />
    <Stack direction="row" spacing={8} justifyContent="center"
      divider={<Divider orientation="vertical" flexItem />}
    >
      <Item>
        <Typography fontWeight={700}>Reserver0</Typography>
        <Typography>{reserves[0]?.toString()}</Typography>
      </Item>
      <Item>
        <Typography fontWeight={700}>Reserver1</Typography>
        <Typography>{reserves[1]?.toString()}</Typography>
      </Item>
    </Stack>
  </Box>
}

export default PairInfo