import React from 'react';
import './App.css';

import GlobalMap from './components/GlobalMap';
import Sidebar from './components/Sidebar';

const App = () => {

  const [dates, setDates] = React.useState([]);
  const [onPred, setOnPred] = React.useState(false);

  return (
    <div className="App">
      <GlobalMap 
        mapDates={dates}
        mapPred={onPred}
      />
      <Sidebar
        setSidebarOnPred={setOnPred} 
        setSidebarDates={setDates}
      />
    </div>
  );
}

export default App;
