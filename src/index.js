import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


function Display(){
  return(
    <App/>
  )
}

ReactDOM.render(<Display />,document.getElementById('root'))