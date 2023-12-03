import { Button, Card, Typography } from '@mui/material'
import { useState } from 'react'
import { TOKEN, TOKENS, getOther, getPairAddress, swap, tokenTransfer } from '../utils'
import TokenForm from './TokenForm'

function Swap() {
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

  async function swapHandler() {
    const pair = await getPairAddress(token0, token1)
    // console.log(await tokenBalnce(token0Address, pair))
    // console.log(await tokenBalnce(token1Address, pair))
    // console.log(await getReserves(pair))
    const other = getOther()
    await tokenTransfer(token0, 0, pair, 'from other');
    await swap(0, 521, other, pair)
  }

  return <Card>
    <Typography variant='h4'>Swap</Typography>
      <TokenForm token={token0} onTokenChange={token0ChangeHandler} onTokenValueChange={token0ValueChangeHandler} />
      <TokenForm token={token1} onTokenChange={token1ChangeHandler} onTokenValueChange={token1ValueChangeHandler}/>
      <Button variant='outlined' onClick={swapHandler}>Swap</Button>
  </Card>  
}

export default Swap