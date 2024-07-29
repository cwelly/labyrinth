import React,{useState} from 'react';
import Canva from './components/Canvas';


function App() {
  const [size , setSize]  = useState([1,1,1]);
  return (
    <div className="App" style={{ width: '100%', height: '100%' }}>
      <Canva/>
    </div>
  );
}

export default App;
