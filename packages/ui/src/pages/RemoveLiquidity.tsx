import { Delete } from '@mui/icons-material';
import { Card, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import { burn, getPairAddress, getPairLength, getPairShare, getSigner } from '../utils';
import { TOKEN_A, TOKEN_B } from '../utils/const';

function RemoveLiquidity({ onLiquidityRemoved }: { onLiquidityRemoved: () => void }) {
  const [pairTotal, setPairTotal] = useState(0)
  const [share, setShare] = useState(0)
  const token0 = TOKEN_A
  const token1 = TOKEN_B

  const list = [
    { name: `${token0} / ${token1}` }
  ]

  useEffect(() => {
    async function fetchPairLength() {
      const pairAddress = await getPairAddress(token0, token1);
      const total = await getPairLength()
      setPairTotal(total.toString())
      const share = await getPairShare(pairAddress)
      setShare(share)
    }
    fetchPairLength().catch(err => console.error(err))
  }, [token0, token1])

  async function removeLiquidity() {
    const pairAddress = await getPairAddress(token0, token1);
    const signer = await getSigner()
    const result = await burn(pairAddress, signer)
    console.log('RemoveLiquidity-32-result', result)
    onLiquidityRemoved()
  }
  return <Card sx={{ padding: '20px' }}>
    {pairTotal > 0 ?
      <List >
        <ListItem>
          <ListItemText primary={`Totals pairs: ${pairTotal}`} />
        </ListItem>
        {list.map(({ name }) => <ListItem
          key={name}
          secondaryAction={<IconButton onClick={removeLiquidity}>
            <Delete />
          </IconButton>}
        >
          <ListItemText primary={name} />
          <ListItemText primary={`Share: ${share.toString()}`} />
        </ListItem>
        )}
      </List>
      : null}
  </Card>
}

export default RemoveLiquidity