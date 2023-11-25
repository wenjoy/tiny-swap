import { StarBorder } from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { getPairLength } from '../utils';

function PairList () {
  const [pairTotal, setPairTotal] = useState(0)
  const list = [
    {name: 'USDC/ETH'}
  ]
  useEffect(() => {
    async function fetchPairLength() {
      const total = await getPairLength()
      setPairTotal(total.toString())
    }
    fetchPairLength().catch(err => console.error(err))
  }, [])
  return <List
          subheader={<Typography>Totals pairs: {pairTotal}</Typography>}
          >
    {list.map(({name}) => <>
          <ListItemButton>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
    </>
    )}
  </List>
}

export default PairList