import { Delete, StarBorder } from '@mui/icons-material';
import { Box, Card, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { burn, getPairAddress, getPairLength, getPairShare, getSigner } from '../utils';

function PairList () {
  const [pairTotal, setPairTotal] = useState(0)
  const [share, setShare] = useState(0)
  const token0 = 'DAI'
  const token1 = 'DOGE'

  const list = [
    {name: 'DAI/DOGE'}
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
  }, [])
  
  async function removeLiquidity() {
    const pairAddress = await getPairAddress(token0, token1);
    const signer = await getSigner()
    await burn(pairAddress, signer)
  }
  return <Card sx={{padding: '20px'}}>
    <List
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
  </Card>
}

export default PairList