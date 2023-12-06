import { Button, Card, Typography } from '@mui/material'
import { useState } from 'react'
import { TOKEN, TOKENS, getPairAddress, getSigner, swap, tokenTransfer } from '../utils'
import TokenForm from './TokenForm'

function Swap() {
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

  function token0ValueChangeHandler(value: string) {
    setToken0Value(value)
  }
  function token1ValueChangeHandler(value: string) {
    setToken1Value(value)
  }

  async function swapHandler() {
    const pair = await getPairAddress(token0, token1)
    const signer = await getSigner()
    await tokenTransfer(token0, BigInt(token0Value), pair);
    await swap(0, Number(token1Value), signer, pair)
  }

  const disabled = parseFloat(token0Value )* parseFloat(token1Value)=== 0
  return <Card sx={{padding: '20px'}}>
    <Typography variant='h4'>Swap</Typography>
      <TokenForm token={token0} onTokenChange={token0ChangeHandler}  tokenValue={token0Value} onTokenValueChange={token0ValueChangeHandler} />
      <TokenForm token={token1} onTokenChange={token1ChangeHandler}  tokenValue={token0Value} onTokenValueChange={token1ValueChangeHandler}/>
      <Button variant='outlined' onClick={swapHandler} disabled={disabled}>
        {disabled ? 'Please input value': 'Swap'}
      </Button>
  </Card>  
}

export default Swap