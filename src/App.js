import './App.css';
import Test from './components/test'
import {BrowserRouter} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Test/>
      </BrowserRouter>
       
    </div>
  );
}

export default App;
