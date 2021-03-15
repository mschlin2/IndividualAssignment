import React, { useState, useEffect } from 'react';
import './App.css';
import MyTable from './Table.js'

function App() {
  const [database, setDatabase] = useState(null);

  useEffect(() => {
    fetch('/createDB').then(response => response.json()).then(data => {
      setDatabase(data);
    }).catch(error => {
      console.log(error)
    })

  }, []);

  return (
    <div className="App">
      <div>{database ? 
        <MyTable db={database.data} />
        :
        <p>Loading...</p>
      }</div>
    </div>
  );
}

export default App;