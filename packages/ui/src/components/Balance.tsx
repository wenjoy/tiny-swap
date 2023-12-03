import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { TOKEN, tokenBalnce } from '../utils'

function Balance ({token, owner, simple}: {token: TOKEN, owner?: string, simple?: boolean}) {
  const [balance, setBalance]= useState(0)
  
  useEffect(() => {
    async function fetchBalance() {
      const balance = await tokenBalnce(token, owner)
      setBalance(balance)
      // Disable continously fetch temporarily
      // setTimeout(() => {
      //   fetchBalance().catch(err => console.error(err))
      // }, 10000);
    }
    fetchBalance().catch(err => console.error(err))
  }, [])

  return <Typography>{simple? '': 'Balance: '}{balance.toString()}</Typography>
}

export default Balance