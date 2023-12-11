import { Container } from '@mui/material';
import { useState } from 'react';
import TokenPair from '../components/TokenPair';
import {
  TOKEN, TOKENS,
  calculateMinTokenAmountForLiquidity, getPairAddress, getSigner,
  mint,
  tokenTransfer
} from '../utils';

function AddLiquidity({ onLiquidityAdded }: { onLiquidityAdded: () => void }) {
  const [token0, setToken0] = useState<TOKEN>(TOKENS[0])
  const [token1, setToken1] = useState<TOKEN>(TOKENS[1])
  const [token0Value, setToken0Value] = useState('')
  const [token1Value, setToken1Value] = useState('')

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
    const otherValue = await calculateMinTokenAmountForLiquidity(token0, token1, value)
    setTokensValue(setToken0Value, setToken1Value, value, otherValue)
  }
  async function token1ValueChangeHandler(value: string) {
    const otherValue = await calculateMinTokenAmountForLiquidity(token1, token0, value)
    setTokensValue(setToken1Value, setToken0Value, value, otherValue)
  }

  async function setTokensValue(setFn: (value: React.SetStateAction<string>) => void, setOtherFn: (value: React.SetStateAction<string>) => void, value: string, otherValue: string) {
    setFn(value);
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
    console.log('AddLiquidity14-result', result)
    resetTokenValue()
    onLiquidityAdded()
  }

  return <Container maxWidth='sm'>
    <TokenPair {...{
      token0, token0Value, token0ChangeHandler, token0ValueChangeHandler,
      token1, token1Value, token1ChangeHandler, token1ValueChangeHandler,
      submitHandler: addLiquidity,
      submitButtonText: 'Add'
    }} />
  </Container >
}
export default AddLiquidity