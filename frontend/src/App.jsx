import { useState, useEffect } from 'react';
import './App.css';
import DataInputInterface from './components/DataInputInterface';

function App() {
  const [message, setMessage] = useState('');
  const [totalSales, setTotalSales] = useState(0);

  // Fetch data from the backend API when the component loads
useEffect(() => {
  // Fetch the welcome message (keep this if you want)
  fetch('http://localhost:5001/api/test')
    .then((response) => response.json())
    .then((data) => setMessage(data.message))
    .catch((error) => console.error('Error fetching message:', error));

  // NEW: Fetch the total sales data
  fetch('http://localhost:5001/api/total-sales')
    .then((response) => response.json())
    .then((data) => setTotalSales(data.total_sales))
    .catch((error) => console.error('Error fetching sales:', error));
}, []);

  return (
    <div className="App">
      <h1>TrendTrader Dashboard</h1>
      <p>Backend message: <strong>{message}</strong></p>
      <h2>Total Revenue: ${typeof totalSales === 'number' ? totalSales.toFixed(2) : 'Loading...'}</h2>
      
      <hr style={{margin: '20px 0', border: '1px solid #eee'}} />
      
      <DataInputInterface />
    </div>
  );
}

export default App;