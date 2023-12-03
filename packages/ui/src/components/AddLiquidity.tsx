import { Card, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { TOKEN, TOKENS, getPairAddress, getSigner, mint, tokenTransfer } from '../utils';
import TokenForm from './TokenForm';

function AddLiquidity() {

  const [token0, setToken0] = useState<TOKEN>(TOKENS[0])
  const [token1, setToken1] = useState<TOKEN>(TOKENS[1])
  const [token0Value, setToken0Value] = useState(0)
  const [token1Value, setToken1Value] = useState(0)
  
  function token0ChangeHandler (token: TOKEN) {
    setToken0(token);
  }

  function token1ChangeHandler (token: TOKEN) {
    setToken1(token);
  }
  
  function token0ValueChangeHandler(value: number) {
    setToken0Value(value)
  }
  function token1ValueChangeHandler(value: number) {
    setToken1Value(value)
  }

  async function addLiquidity() {
    const pairAddress = await getPairAddress(token0, token1);
    const signer = await getSigner()
    
    await tokenTransfer(token0, token0Value, pairAddress)
    await tokenTransfer(token1, token1Value, pairAddress)

    const result = await mint(pairAddress, signer)
    console.log('AddLiquidity-14-result', result)
  }
  
  const disabled = token0Value * token1Value === 0
  return <div className='AddLiquidity'>
    <Card sx={{padding: '20px'}}>
      <Typography variant='h4'>Add liquidity</Typography>
      <TokenForm token={token0} onTokenChange={token0ChangeHandler} onTokenValueChange={token0ValueChangeHandler} />
      <TokenForm token={token1} onTokenChange={token1ChangeHandler} onTokenValueChange={token1ValueChangeHandler}/>
      <Button variant='outlined' onClick={addLiquidity} disabled={disabled}>
        {disabled ? 'Please input value': 'Add'}
      </Button>
    </Card>
  </div>
}
export default AddLiquidity