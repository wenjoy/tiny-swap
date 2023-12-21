import {
  Box,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { useQuery } from 'react-query';
import { getPairAddress, getReserves } from '../utils';
import { TOKEN } from '../utils/const';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

async function fetchAddress(token0: TOKEN, token1: TOKEN) {
  const pair = await getPairAddress(token0, token1);
  return await getReserves(pair);
}

function PairInfo({
  token0,
  token1,
  refresh,
}: {
  token0: TOKEN;
  token1: TOKEN;
  refresh: number;
}) {
  const {
    isLoading,
    error,
    data: reserves = [],
  } = useQuery({
    queryKey: ['reserves', refresh],
    queryFn: () => fetchAddress(token0, token1),
  });

  if (error) {
    return null;
  }

  return (
    <Box>
      <Divider sx={{ mb: 4 }} />
      <Stack
        direction="row"
        spacing={8}
        justifyContent="center"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Item>
          <Typography fontWeight={700}>Reserver0</Typography>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Typography>{reserves[0]?.toString()}</Typography>
          )}
        </Item>
        <Item>
          <Typography fontWeight={700}>Reserver1</Typography>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Typography>{reserves[1]?.toString()}</Typography>
          )}
        </Item>
      </Stack>
    </Box>
  );
}

export default PairInfo;
