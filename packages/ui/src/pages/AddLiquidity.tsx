import { Container } from '@mui/material';
import { useReducer, useState } from 'react';
import { RefreshContext } from '..';
import TokenPair from '../components/TokenPair';
import {
  calculateMinTokenAmountForLiquidity, getPairAddress, getSigner,
  mint,
  tokenTransfer
} from '../utils';
import { TOKEN, TOKENS } from '../utils/const';

function AddLiquidity() {
  const [token0, setToken0] = useState<TOKEN>(TOKENS[0])
  const [token1, setToken1] = useState<TOKEN>(TOKENS[1])
  const [token0Value, setToken0Value] = useState('')
  const [token1Value, setToken1Value] = useState('')
  const [refresh, forceUpdate] = useReducer(x => x + 1, 0);
  const [token0ValueLoading, setToken0ValueLoading] = useState(false)
  const [token1ValueLoading, setToken1ValueLoading] = useState(false)

  function resetTokenValue() {
    setToken0Value('')
    setToken1Value('')
  }

  function token0ChangeHandler(token: TOKEN) {
    setToken0(token);

    //TODO: token change should recalculate value also
    if (token === token1) {
      setToken1(token0)
    }
  }
  function token1ChangeHandler(token: TOKEN) {
    setToken1(token);

    if (token === token0) {
      setToken0(token1)
    }
  }

  async function token0ValueChangeHandler(value: string) {
    setToken0Value(value)
    setToken1ValueLoading(true)
    const otherValue = await calculateMinTokenAmountForLiquidity(token0, token1, value)
    setTokensValue(setToken1Value, otherValue)
    setToken1ValueLoading(false)
  }
  async function token1ValueChangeHandler(value: string) {
    setToken1Value(value)
    setToken0ValueLoading(true)
    const otherValue = await calculateMinTokenAmountForLiquidity(token1, token0, value)
    setTokensValue(setToken0Value, otherValue)
    setToken0ValueLoading(false)
  }

  async function setTokensValue(setOtherFn: (value: React.SetStateAction<string>) => void, otherValue: string) {
    if (otherValue) {
      setOtherFn(otherValue)
    }
  }

  async function addLiquidity() {
    const pairAddress = await getPairAddress(token0, token1);
    const signer = await getSigner()

    await tokenTransfer(token0, token0Value, pairAddress)
    await tokenTransfer(token1, token1Value, pairAddress)

    const result = await mint(pairAddress, signer)
    resetTokenValue()
    forceUpdate()
  }

  return <Container maxWidth='sm'>
    <RefreshContext.Provider value={refresh}>
      <TokenPair {...{
        token0, token0Value, token0ChangeHandler, token0ValueChangeHandler,
        token1, token1Value, token1ChangeHandler, token1ValueChangeHandler,
        submitHandler: addLiquidity,
        submitButtonText: 'Add',
        refresh,
        token0ValueLoading,
        token1ValueLoading,
      }} />
    </RefreshContext.Provider>
  </Container >
}
export default AddLiquidity