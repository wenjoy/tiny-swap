import { Delete } from '@mui/icons-material';
import {
  Box,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Skeleton,
} from '@mui/material';
import { useContext, useReducer, useState } from 'react';
import { useQuery } from 'react-query';
import { AlertContext } from '..';
import ProgressDialog from '../components/ProgressDialog';
import { Severity } from '../routes/root';
import {
  burn,
  getLPTokenBalance,
  getPairAddress,
  getPairLength,
  getSigner,
} from '../utils';
import { TOKEN, TOKEN_A, TOKEN_B } from '../utils/const';

async function fetchPairInfo(token0: TOKEN, token1: TOKEN) {
  const pairAddress = await getPairAddress(token0, token1);
  const total = await getPairLength();
  const balance = await getLPTokenBalance(pairAddress);
  return { total, balance };
}

function RemoveLiquidity() {
  const [refresh, forceUpdate] = useReducer((x) => x + 1, 0);
  const { setAlert } = useContext<AlertContext>(AlertContext);
  const token0 = TOKEN_A;
  const token1 = TOKEN_B;
  const totalStage = 1;
  const [currentStage, setCurrentStage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['remove'],
    queryFn: () => fetchPairInfo(token0, token1),
  });

  const pairTotal = data?.total;
  const lpToken = data?.balance ?? 0;

  const list = [{ name: `${token0} / ${token1}` }];
  function resetAlert() {
    setAlert({ severity: Severity.Success, message: '' });
  }

  async function removeLiquidity() {
    resetAlert();
    setCurrentStage(totalStage);

    try {
      const pairAddress = await getPairAddress(token0, token1);
      const signer = await getSigner();
      const result = await burn(pairAddress, signer);
    } catch (error) {
      console.error(error);
      setAlert({
        severity: Severity.Error,
        message: 'Transaction failed, please try again later',
      });
    }

    setCurrentStage(0);
    forceUpdate();
    setAlert({
      severity: Severity.Success,
      message: 'Congratulation! Swap successfully!',
    });
  }
  return (
    <Card sx={{ padding: '20px' }}>
      {isLoading ? (
        <Box>
          <Skeleton variant="text" width={60} height={40} />
          <Skeleton variant="text" height={40} />
          <Skeleton variant="rounded" height={80} />
        </Box>
      ) : pairTotal > 0 ? (
        <Box>
          <ProgressDialog totalStage={totalStage} currentStage={currentStage} />
          <List>
            <ListItem>
              <ListItemText primary={`Total pairs: ${pairTotal}`} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="LP token"
                primaryTypographyProps={{ fontWeight: 700 }}
              />
              <ListItemText
                primary="Balance"
                primaryTypographyProps={{ fontWeight: 700 }}
              />
              <ListItemText primary="" sx={{ maxWidth: '80px' }} />
            </ListItem>
            {list.map(({ name }) => (
              <ListItem
                key={name}
                secondaryAction={
                  <IconButton onClick={removeLiquidity}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText primary={name} />
                <ListItemText primary={lpToken.toString()} />
              </ListItem>
            ))}
          </List>
        </Box>
      ) : null}
    </Card>
  );
}

export default RemoveLiquidity;
