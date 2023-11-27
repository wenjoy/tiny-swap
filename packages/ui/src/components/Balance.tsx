import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { tokenBalnce } from '../utils'

function Balance ({token}: {token: string}) {
  const [balance, setBalance]= useState(0)
  
  useEffect(() => {
    async function fetchBalance() {
      const balance = await tokenBalnce(token)
      setBalance(balance)
      setTimeout(() => {
        fetchBalance().catch(err => console.error(err))
      }, 10000);
    }
    fetchBalance().catch(err => console.error(err))
  }, [])

  return <Typography>Balance: {balance.toString()}</Typography>
}

export default Balance