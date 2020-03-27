import React from 'react';
import './App.css';

import GlobalMap from './components/GlobalMap';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <GlobalMap />
      <Sidebar />
    </div>
  );
}

export default App;
