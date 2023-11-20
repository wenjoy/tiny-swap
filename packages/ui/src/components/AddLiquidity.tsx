import Button from '@mui/material/Button';
import TokenForm from './TokenForm'
import { Container, Typography } from '@mui/material';

function AddLiquidity () {
  return <div className='AddLiquidity'>
    <Container>
      <Typography variant='h4'>Add liquidity</Typography>
      <TokenForm />
      <TokenForm />
      <Button variant='outlined'>Add</Button>
    </Container>
  </div>
}
export default AddLiquidity