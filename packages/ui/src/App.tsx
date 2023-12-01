import { Grid } from '@mui/material';
import './App.css';
import AddLiquidity from './components/AddLiquidity';
import PairList from './components/PairList';
import Stats from './components/Stats';
import Swap from './components/Swap';
import useEthers from './hooks/useEthers';

function App() {
  useEthers().then(() => {console.log('success')}).catch((err) => {console.log(err)});
  return (
    <div className="App">
      <header className="App-header">
        <span className="logo">Uniswap</span>
        <div className="menu">
        <span className="menu-item"><a href="/swap">Swap</a></span>
        <span className="menu-item"><a href="/pool">Pool</a></span>
        </div>
      </header>

      <Grid container spacing={3} sx={{mt: '20px'}}>
          <Grid item xs={6}>
            <AddLiquidity />
          </Grid>
          <Grid item xs={6}>
            <PairList />
          </Grid>
          <Grid item xs={6}>
            <Swap />
          </Grid>
          <Grid item xs={6}>
            <Stats />
          </Grid>
        </Grid>
    </div>
  );
}

export default App;
