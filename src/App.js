import { BrowserRouter as Router, Route, } from 'react-router-dom'
import RedPacket from './views/RedPacket';
import Nav from './views/Nav';
import './App.scss'
function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/demo1" component={RedPacket}/>
        <Route path="/" exact component={Nav}/>
      </Router>
    </div>
  );
}

export default App;
