import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { tokenBalnce } from '../utils'

function Balance ({token, owner}: {token: string, owner?: string}) {
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

  // return <Typography>Balance: {balance.toString()}</Typography>
  return <Typography>{balance.toString()}</Typography>
}

export default Balance