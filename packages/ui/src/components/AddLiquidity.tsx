import Button from '@mui/material/Button';
import TokenForm from './TokenForm'
import { Container, Typography } from '@mui/material';
import { createPair, getSigner, mint, tokenMint, tokenTransfer} from '../utils';

function AddLiquidity() {
  async function addLiquidity() {
    const token0Address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const token1Address = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
    const value = 1100
    const pairAddress = await createPair(token0Address, token1Address);
    console.log('AddLiquidity-11-pairAddress', pairAddress)
    const signer = await getSigner()
    
    await tokenMint(token0Address,  value)
    await tokenMint(token1Address,  value)
    await tokenTransfer(token0Address, value, pairAddress)
    await tokenTransfer(token1Address, value, pairAddress)

    const result = await mint(pairAddress, signer)
    console.log('AddLiquidity-14-result', result)
  }

  return <div className='AddLiquidity'>
    <Container>
      <Typography variant='h4'>Add liquidity</Typography>
      <TokenForm />
      <TokenForm />
      <Button variant='outlined' onClick={addLiquidity}>Add</Button>
    </Container>
  </div>
}
export default AddLiquidity