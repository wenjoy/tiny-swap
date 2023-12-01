import { Delete, StarBorder } from '@mui/icons-material';
import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { burn, getPairAddress, getPairLength, getPairShare, getSigner } from '../utils';

function PairList () {
  const [pairTotal, setPairTotal] = useState(0)
  const [share, setShare] = useState(0)
  const token0Address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  const token1Address = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

  const list = [
    {name: 'USDC/ETH'}
  ]

  useEffect(() => {
    async function fetchPairLength() {
      const pairAddress = await getPairAddress(token0Address, token1Address);
      const total = await getPairLength()
      setPairTotal(total.toString())
      const share = await getPairShare(pairAddress)
      setShare(share)
    }
    fetchPairLength().catch(err => console.error(err))
  }, [])
  
  async function removeLiquidity() {
    const pairAddress = await getPairAddress(token0Address, token1Address);
    const signer = await getSigner()
    await burn(pairAddress, signer)
  }
  return <List
          subheader={<Box>
             <Typography variant='h4'>Pool list</Typography>           
             <Typography>Totals pairs: {pairTotal}</Typography>           
          </Box>
          }
          >
    {list.map(({name}) => <ListItem
          key={name}
          secondaryAction={<IconButton onClick={removeLiquidity}>
            <Delete />
          </IconButton>}
        >
          <ListItemButton>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary={name} />
            <ListItemText primary={`Share: ${share.toString()}`} />
          </ListItemButton>
        </ListItem>
    )}
  </List>
}

export default PairList