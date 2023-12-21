import { Container } from '@mui/material';
import { useContext, useEffect, useReducer, useState } from 'react';
import { AlertContext, RefreshContext } from '..';
import ProgressDialog from '../components/ProgressDialog';
import TokenPair from '../components/TokenPair';
import { Severity } from '../routes/root';
import {
  calculateMinTokenAmountForLiquidity,
  getPairAddress,
  getSigner,
  mint,
  tokenTransfer,
} from '../utils';
import { TOKEN, TOKENS, TokenField } from '../utils/const';

function AddLiquidity() {
  const [token0, setToken0] = useState<TOKEN>(TOKENS[0]);
  const [token1, setToken1] = useState<TOKEN>(TOKENS[1]);
  const [token0Value, setToken0Value] = useState('');
  const [token1Value, setToken1Value] = useState('');
  const [token0ValueLoading, setToken0ValueLoading] = useState(false);
  const [token1ValueLoading, setToken1ValueLoading] = useState(false);
  const { setAlert } = useContext<AlertContext>(AlertContext);
  const [refresh, forceUpdate] = useReducer((x) => x + 1, 0);
  const totalStage = 3;
  const [currentStage, setCurrentStage] = useState(0);
  const [currentField, setCurrentField] = useState<TokenField>();
  const [isInternelState, setIsInternelState] = useState(false);

  useEffect(() => {
    async function tokenValueHandler() {
      if (isInternelState) return;

      if (currentField === TokenField.Token0) {
        setToken1ValueLoading(true);
        const otherValue = await calculateMinTokenAmountForLiquidity(
          token0,
          token1,
          token0Value
        );
        if (otherValue) {
          setToken1Value(otherValue);
        }
        setIsInternelState(true);
        setToken1ValueLoading(false);
      }

      if (currentField === TokenField.Token1) {
        setToken0ValueLoading(true);
        const otherValue = await calculateMinTokenAmountForLiquidity(
          token1,
          token0,
          token1Value
        );
        if (otherValue) {
          setToken0Value(otherValue);
        }
        setIsInternelState(true);
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
    setIsInternelState(false);

    if (token === token1) {
      setToken1(token0);
    }
  }

  function token1ChangeHandler(token: TOKEN) {
    resetAlert();
    setToken1(token);
    setCurrentField(TokenField.Token1);
    setIsInternelState(false);

    if (token === token0) {
      setToken0(token1);
    }
  }

  function token0ValueChangeHandler(value: string) {
    resetAlert();
    setCurrentField(TokenField.Token0);
    setIsInternelState(false);
    setToken0Value(value);
  }

  function token1ValueChangeHandler(value: string) {
    resetAlert();
    setCurrentField(TokenField.Token1);
    setIsInternelState(false);
    setToken1Value(value);
  }

  async function addLiquidity() {
    setCurrentStage(totalStage - 2);

    try {
      const pairAddress = await getPairAddress(token0, token1);
      const signer = await getSigner();
      await tokenTransfer(token0, token0Value, pairAddress);
      setCurrentStage(totalStage - 1);
      await tokenTransfer(token1, token1Value, pairAddress);
      setCurrentStage(totalStage);

      const result = await mint(pairAddress, signer);
    } catch (error) {
      setAlert({
        severity: Severity.Error,
        message: 'Transaction failed, please try again later',
      });
    }
    setCurrentStage(0);
    resetTokenValue();
    forceUpdate();
    setAlert({
      severity: Severity.Success,
      message: 'Congratulation! Swap successfully!',
    });
  }

  return (
    <Container maxWidth="sm">
      <ProgressDialog totalStage={totalStage} currentStage={currentStage} />
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
            submitHandler: addLiquidity,
            submitButtonText: 'Add',
            refresh,
            token0ValueLoading,
            token1ValueLoading,
          }}
        />
      </RefreshContext.Provider>
    </Container>
  );
}
export default AddLiquidity;
