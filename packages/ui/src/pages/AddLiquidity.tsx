import { Container } from '@mui/material';
import { useContext, useEffect, useReducer, useState } from 'react';
import ReactGA from 'react-ga';
import { AlertContext, RefreshContext } from '..';
import ProgressDialog from '../components/ProgressDialog';
import TokenPair from '../components/TokenPair';
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
  const { setAlertError } = useContext<AlertContext>(AlertContext);
  const [refresh, forceUpdate] = useReducer((x) => x + 1, 0);
  const totalStage = 3;
  const [currentStage, setCurrentStage] = useState(0);
  const [currentField, setCurrentField] = useState<TokenField>();
  const [isInternelState, setIsInternelState] = useState(false);

  useEffect(() => {
    async function tokenValueHandler() {
      resetAlertError();

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

  function resetAlertError() {
    setAlertError({ message: '' });
  }

  function token0ChangeHandler(token: TOKEN) {
    setToken0(token);
    setCurrentField(TokenField.Token0);
    setIsInternelState(false);

    if (token === token1) {
      setToken1(token0);
    }
    ReactGA.event({
      category: 'Input',
      action: 'change token 0',
      label: 'Core logic',
    });
  }

  function token1ChangeHandler(token: TOKEN) {
    setToken1(token);
    setCurrentField(TokenField.Token1);
    setIsInternelState(false);

    if (token === token0) {
      setToken0(token1);
    }
    ReactGA.event({
      category: 'Input',
      action: 'change token 1',
      label: 'Core logic',
    });
  }

  function token0ValueChangeHandler(value: string) {
    setCurrentField(TokenField.Token0);
    setIsInternelState(false);
    setToken0Value(value);
    ReactGA.event({
      category: 'Input',
      action: 'change token 0 value',
      label: 'Core logic',
    });
  }

  function token1ValueChangeHandler(value: string) {
    setCurrentField(TokenField.Token1);
    setIsInternelState(false);
    setToken1Value(value);
    ReactGA.event({
      category: 'Input',
      action: 'change token 1 value',
      label: 'Core logic',
    });
  }

  async function addLiquidity() {
    ReactGA.event({
      category: 'Input',
      action: 'add liquidity',
      label: 'Core logic',
    });
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
      setAlertError({ message: 'Transaction failed, please try again later' });
    }
    setCurrentStage(0);
    resetTokenValue();
    forceUpdate();
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
