import './App.css';
import Routings from './components/Routings';
import Maintain from './components/Maintain';

function App() {
  const web_status = false;
  if (web_status) {
    return (
      <Routings />
    );
  }
  else{
    return(<Maintain/>)
  }
}

export default App;
