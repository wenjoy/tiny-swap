import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { tokenBalance } from '../utils'

function Balance ({token: tokenAddress, owner, simple}: {token: string, owner?: string, simple?: boolean}) {
  const [balance, setBalance]= useState('')
  
  useEffect(() => {
    async function fetchBalance() {
      const balance = await tokenBalance(tokenAddress, owner)
      setBalance(balance)
      // Disable continously fetch temporarily
      // setTimeout(() => {
      //   fetchBalance().catch(err => console.error(err))
      // }, 10000);
    }
    fetchBalance().catch(err => console.error(err))
  }, [tokenAddress])

  return <Typography>{simple? '': 'Balance: '}{balance}</Typography>
}

export default Balance