import { Card, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { ethers } from 'ethers';
import { useState } from 'react';
import {
  TOKEN, TOKENS,
  calculateMinTokenAmountForLiquidity, getPairAddress, getSigner,
  mint, tokenDeciamls, tokenTransfer
} from '../utils';
import TokenForm from './TokenForm';

function AddLiquidity() {

  const [token0, setToken0] = useState<TOKEN>(TOKENS[0])
  const [token1, setToken1] = useState<TOKEN>(TOKENS[1])
  const [token0Value, setToken0Value] = useState('')
  const [token1Value, setToken1Value] = useState('')
  
  function token0ChangeHandler (token: TOKEN) {
    setToken0(token);
  }

  function token1ChangeHandler (token: TOKEN) {
    setToken1(token);
  }
  
  async function token0ValueChangeHandler(value: string) {
    setToken0Value(value)
    const token1Value = await calculateMinTokenAmountForLiquidity(token0, token1, value)
    setToken1Value(token1Value)
  }
  async function token1ValueChangeHandler(value: string) {
    setToken1Value(value)
    const token0Value = await calculateMinTokenAmountForLiquidity(token0, token1, value)
    setToken0Value(token0Value)
  }
  
  //TODO: refactor
  async function tokenValueChangeHandler(value: number) {

  }

  async function addLiquidity() {
    const pairAddress = await getPairAddress(token0, token1);
    const signer = await getSigner()
    const token0Decimal = await tokenDeciamls(token0)
    const token1Decimal = await tokenDeciamls(token1)
    
    const amount0In = ethers.parseUnits(token0Value, token0Decimal);
    const amount1In = ethers.parseUnits(token1Value, token1Decimal);
    
    await tokenTransfer(token0, amount0In, pairAddress)
    await tokenTransfer(token1, amount1In, pairAddress)

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