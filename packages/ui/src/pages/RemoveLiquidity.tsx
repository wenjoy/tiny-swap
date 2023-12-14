import { Delete } from '@mui/icons-material';
import { Card, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import { burn, getLPTokenBalance, getPairAddress, getPairLength, getSigner } from '../utils';
import { TOKEN_A, TOKEN_B } from '../utils/const';

function RemoveLiquidity() {
  const [pairTotal, setPairTotal] = useState(0)
  const [lpToken, setLpToken] = useState('')
  const [refresh, forceUpdate] = useReducer(x => x + 1, 0)
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
      const balance = await getLPTokenBalance(pairAddress)
      setLpToken(balance)
    }
    fetchPairLength().catch(err => console.error(err))
  }, [token0, token1, refresh])

  async function removeLiquidity() {
    const pairAddress = await getPairAddress(token0, token1);
    const signer = await getSigner()
    const result = await burn(pairAddress, signer)
    forceUpdate()
  }
  return <Card sx={{ padding: '20px' }}>
    {pairTotal > 0 ?
      <List >
        <ListItem>
          <ListItemText primary={`Total pairs: ${pairTotal}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary="LP token" primaryTypographyProps={{ fontWeight: 700 }} />
          <ListItemText primary="Balance" primaryTypographyProps={{ fontWeight: 700 }} />
          <ListItemText primary="" sx={{ maxWidth: '80px' }} />
        </ListItem>
        {list.map(({ name }) => <ListItem
          key={name}
          secondaryAction={<IconButton onClick={removeLiquidity}>
            <Delete />
          </IconButton>}
        >
          <ListItemText primary={name} />
          <ListItemText primary={lpToken.toString()} />
        </ListItem>
        )}
      </List>
      : null}
  </Card>
}

export default RemoveLiquidity