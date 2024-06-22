import { Container, Paper } from '@mui/material';
import { useContext, useEffect, useReducer, useState } from 'react';
import { AlertContext, RefreshContext } from '..';
import ProgressDialog from '../components/ProgressDialog';
import TokenPair from '../components/TokenPair';
import {
  getPairAddress,
  getProvider,
  getSigner,
  calculateTokenOutAmount,
  isNotSufficient,
  swap,
  tokenTransfer,
  wait,
  withDrawToken0,
} from '../utils';
import { TOKEN, TOKENS, TokenField } from '../utils/const';
import { Severity } from './root';

function Swap() {
  const [token0, setToken0] = useState<TOKEN>(TOKENS[0]);
  const [token1, setToken1] = useState<TOKEN>(TOKENS[1]);
  const [token0Value, setToken0Value] = useState('');
  const [token1Value, setToken1Value] = useState('');
  const [token0ValueLoading, setToken0ValueLoading] = useState(false);
  const [token1ValueLoading, setToken1ValueLoading] = useState(false);
  const [refresh, forceUpdate] = useReducer((x) => x + 1, 0);
  const { setAlert } = useContext<AlertContext>(AlertContext);
  const totalStage = 2;
  const [currentStage, setCurrentStage] = useState(0);
  const [isInternalState, setIsInternalState] = useState(false);
  const [currentField, setCurrentField] = useState<TokenField>();

  useEffect(() => {
    async function tokenValueHandler() {
      if (isInternalState) return;

      if (currentField === TokenField.Token0) {
        setToken1ValueLoading(true);
        const otherValue = await calculateTokenOutAmount(
          token0,
          token1,
          token0Value
        );
        if (otherValue) {
          setToken1Value(otherValue);
        }
        setIsInternalState(true);
        setToken1ValueLoading(false);
      }

      if (currentField === TokenField.Token1) {
        setToken0ValueLoading(true);
        const otherValue = await calculateTokenOutAmount(
          token1,
          token0,
          token1Value
        );
        if (otherValue) {
          setToken0Value(otherValue);
        }
        setIsInternalState(true);
        setToken0ValueLoading(false);
      }
    }
    tokenValueHandler();
  }, [token0, token1, token0Value, token1Value, currentField]);

  function resetTokenValue() {
    setToken0Value('');
    setToken1Value('');
  }
  function resetAlert() {
    setAlert({ severity: Severity.Success, message: '' });
  }

  function token0ChangeHandler(token: TOKEN) {
    resetAlert();
    setToken0(token);
    setCurrentField(TokenField.Token0);
    setIsInternalState(false);

    if (token === token1) {
      setToken1(token0);
    }
  }
  function token1ChangeHandler(token: TOKEN) {
    resetAlert();
    setToken1(token);
    setCurrentField(TokenField.Token1);
    setIsInternalState(false);

    if (token === token0) {
      setToken0(token1);
    }
  }

  async function token0ValueChangeHandler(value: string) {
    resetAlert();
    setCurrentField(TokenField.Token0);
    setIsInternalState(false);
    setToken0Value(value);
  }
  async function token1ValueChangeHandler(value: string) {
    resetAlert();
    setCurrentField(TokenField.Token1);
    setIsInternalState(false);
    setToken1Value(value);
  }

  async function swapHandler() {
    if (await isNotSufficient(token0, token1, token0Value, token1Value)) {
      setAlert({
        severity: Severity.Error,
        message: 'Token balance is not sufficient',
      });
      return;
    }
    setCurrentStage(totalStage - 1);

    //TODO: refine this error handling
    try {
      const pair = await getPairAddress(token0, token1);
      const to = await getSigner();
      const result = await tokenTransfer(token0, token0Value, pair);
      const provider = await getProvider();

      let receipt;
      while (!receipt) {
        receipt = await provider.getTransactionReceipt(result.hash);
        await wait(200);
      }

      try {
        await swap(token1, token1Value, to, pair);
        setCurrentStage(totalStage);
        forceUpdate();
        setAlert({
          severity: Severity.Success,
          message: 'Congratulation! Swap successfully!',
        });
      } catch (err) {
        setAlert({
          severity: Severity.Error,
          message: 'Swap failed, please try again later',
        });
        //TODO: manually revert is not right
        try {
          const result = await withDrawToken0(pair, token0, to, token0Value);
          setAlert({
            severity: Severity.Success,
            message: 'Congratulation! Swap successfully!',
          });
        } catch (err) {
          setAlert({
            severity: Severity.Error,
            message: 'Transaction failed, please try again later',
          });
        }
      }
    } catch (error) {
      setAlert({
        severity: Severity.Error,
        message: 'Transaction failed, please try again later',
      });
    }

    setCurrentStage(0);
    resetTokenValue();
  }

  return (
    <Paper
      sx={{
        p: { xs: 0, md: 2 },
        height: '90vh',
        borderTop: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <ProgressDialog totalStage={totalStage} currentStage={currentStage} />
      <Container
        maxWidth="xs"
        sx={{ mt: { md: 8, sm: 4, xs: 0 }, pr: { xs: 0 } }}
      >
        <RefreshContext.Provider value={refresh}>
          <TokenPair
            {...{
              token0,
              token0Value,
              token0ChangeHandler,
              token0ValueChangeHandler,
              token1,
              token1Value,
              token1ChangeHandler,
              token1ValueChangeHandler,
              submitHandler: swapHandler,
              submitButtonText: 'Swap',
              lock: true,
              refresh,
              token0ValueLoading,
              token1ValueLoading,
            }}
          />
        </RefreshContext.Provider>
      </Container>
    </Paper>
  );
}

export default Swap;
