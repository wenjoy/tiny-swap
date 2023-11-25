import Button from '@mui/material/Button';
import TokenForm from './TokenForm'
import { Container, Typography } from '@mui/material';
import { createPair, getSigner, mint, tokenTransfer} from '../utils';

function AddLiquidity() {
  const token0Address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  const token1Address = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

  async function addLiquidity() {
    const value = 1100
    const pairAddress = await createPair(token0Address, token1Address);
    console.log('AddLiquidity-11-pairAddress', pairAddress)
    const signer = await getSigner()
    
    await tokenTransfer(token0Address, value, pairAddress)
    await tokenTransfer(token1Address, value, pairAddress)

    const result = await mint(pairAddress, signer)
    console.log('AddLiquidity-14-result', result)
  }

  return <div className='AddLiquidity'>
    <Container>
      <Typography variant='h4'>Add liquidity</Typography>
      <TokenForm token={token0Address}/>
      <TokenForm token={token1Address}/>
      <Button variant='outlined' onClick={addLiquidity}>Add</Button>
    </Container>
  </div>
}
export default AddLiquidity