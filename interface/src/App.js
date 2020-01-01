import React from 'react';
import './App.css';
import Body from './components/navigation/Body';
import Navigation from './components/navigation/Navigation';

function App() {
  return (
    <React.Fragment>
        <Navigation />
        <Body />
    </React.Fragment>
  );
}

export default App;
