
import './App.css';
import {BrowserRouter as Router, Route, Link } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';

function App() {
  return (
      <Router>
          <div className="App">
            <header style={{margin:30}}>
              <h1>Fib Cal using docker</h1>
              <Link to="/">Home</Link> &nbsp;
              <Link to="/otherpage">Other Page</Link>
            </header>

            <Route exact path="/" component={Fib} />
            <Route exact path="/otherpage" component={OtherPage}/>
          </div>
      </Router>

  );
}

export default App;
