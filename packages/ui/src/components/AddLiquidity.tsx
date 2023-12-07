import { Card, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import {
  TOKEN, TOKENS,
  calculateMinTokenAmountForLiquidity, getPairAddress, getSigner,
  mint,
  tokenTransfer
} from '../utils';
import TokenForm from './TokenForm';

function AddLiquidity() {

  const [token0, setToken0] = useState<TOKEN>(TOKENS[0])
  const [token1, setToken1] = useState<TOKEN>(TOKENS[1])
  const [token0Value, setToken0Value] = useState('')
  const [token1Value, setToken1Value] = useState('')
  
  function token0ChangeHandler (token: TOKEN) {
    setToken0(token);

    //TODO: token change should recalculate value also
    if(token === token1) {
      setToken1(token0)
    }
   }
  function token1ChangeHandler (token: TOKEN) {
    setToken1(token);

    if(token === token0) {
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
    if(otherValue) {
      setOtherFn(otherValue)
    }
  }

  async function addLiquidity() {
    const pairAddress = await getPairAddress(token0, token1);
    const signer = await getSigner()
    
    await tokenTransfer(token0, token0Value, pairAddress)
    await tokenTransfer(token1, token1Value, pairAddress)

    const result = await mint(pairAddress, signer)
    console.log('AddLiquidity-14-result', result)
  }
  
  const disabled = parseFloat(token0Value)* parseFloat(token1Value)=== 0
  return <div className='AddLiquidity'>
    <Card sx={{padding: '20px'}}>
      <Typography variant='h4'>Add liquidity</Typography>
      <TokenForm token={token0} onTokenChange={token0ChangeHandler} tokenValue={token0Value} onTokenValueChange={token0ValueChangeHandler} />
      <TokenForm token={token1} onTokenChange={token1ChangeHandler} tokenValue={token1Value} onTokenValueChange={token1ValueChangeHandler}/>
      <Button variant='outlined' onClick={addLiquidity} disabled={disabled}>
        {disabled ? 'Please input value': 'Add'}
      </Button>
    </Card>
  </div>
}
export default AddLiquidity