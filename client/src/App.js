import React, { useState, useEffect } from "react";

import DataTable from "./Components/DataTable/DataTable";

import "./App.css";

function App() {
  const [displayedAPIs, setDisplayedAPIs] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setDisplayedAPIs([]);
    let url = '/api';
    if (!!query) {
      url += `?API=${query}`
    }
    const fetchAndStoreDisplayedAPIs = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        setDisplayedAPIs(data);
        setIsLoading(false);
      }
      catch (error) {
        console.error(error);
      }
    }
    fetchAndStoreDisplayedAPIs();
  }, [query])


  return (
    <div className="App">
      <DataTable
        rows={displayedAPIs}
        handleSearch={setQuery}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;