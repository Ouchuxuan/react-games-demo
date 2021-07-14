import { BrowserRouter as Router, Route, } from 'react-router-dom'
import RedPacket from './views/RedPacket';
// import RedPacket2 from './views/RedPacket2';
import Demo3 from './views/Demo3';
import Nav from './views/Nav';
import './App.scss'
function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/demo1" component={RedPacket}/>
        {/* <Route path="/demo2" component={RedPacket2}/> */}
        <Route path="/demo3" component={Demo3}/>
        <Route path="/" exact component={Nav}/>
      </Router>
    </div>
  );
}

export default App;
