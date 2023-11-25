import { Grid } from '@mui/material';
import './App.css';
import AddLiquidity from './components/AddLiquidity';
import PairList from './components/PairList';
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <AddLiquidity />
        </Grid>
        <Grid item xs={6}>
          <PairList />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
