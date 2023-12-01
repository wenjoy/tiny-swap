import { Button, Card, Typography } from '@mui/material'
import { getOther, getPairAddress, swap, tokenTransfer } from '../utils'
import TokenForm from './TokenForm'

function Swap() {
  const token0Address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  const token1Address = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

  async function swapHandler() {
    const pair = await getPairAddress(token0Address, token1Address)
    // console.log(await tokenBalnce(token0Address, pair))
    // console.log(await tokenBalnce(token1Address, pair))
    // console.log(await getReserves(pair))
    const other = getOther()
    await tokenTransfer(token0Address, 0, pair, 'from other');
    await swap(0, 521, other, pair)
  }

  return <Card>
    <Typography variant='h4'>Swap</Typography>
      <TokenForm token={token0Address}/>
      <TokenForm token={token1Address}/>
      <Button variant='outlined' onClick={swapHandler}>Swap</Button>
  </Card>  
}

export default Swap