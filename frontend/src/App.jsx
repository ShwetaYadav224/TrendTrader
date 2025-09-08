import { useState, useEffect } from 'react';
import './App.css';
import DataInputInterface from './components/DataInputInterface';

function App() {
  const [message, setMessage] = useState('');
  const [totalSales, setTotalSales] = useState(0);
  const [activeTab, setActiveTab] = useState('data');
  const [productCount, setProductCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  // Fetch data from the backend API when the component loads
  useEffect(() => {
    // Fetch the welcome message
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/test`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching message:', error));

    // Fetch the total sales data
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/total-sales`)
      .then((response) => response.json())
      .then((data) => setTotalSales(data.total_sales))
      .catch((error) => console.error('Error fetching sales:', error));

    // Fetch product count
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/debug/products`)
      .then((response) => response.json())
      .then((data) => setProductCount(data.length))
      .catch((error) => console.error('Error fetching products:', error));

    // Fetch customer count
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/debug/customers`)
      .then((response) => response.json())
      .then((data) => setCustomerCount(data.length))
      .catch((error) => console.error('Error fetching customers:', error));
  }, []);

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">${typeof totalSales === 'number' ? totalSales.toFixed(2) : '0.00'}</p>
        </div>
        <div className="stat-card">
          <h3>Products</h3>
          <p className="stat-value">{productCount}</p>
        </div>
        <div className="stat-card">
          <h3>Customers</h3>
          <p className="stat-value">{customerCount}</p>
        </div>
      </div>
      
      <div className="welcome-section">
        <h2>Welcome to TrendTrader Dashboard</h2>
        <p>Manage your e-commerce data with ease. Track sales, add products, and manage customers all in one place.</p>
        <p className="backend-status">
          <strong>Backend Status:</strong> {message}
        </p>
      </div>
    </div>
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1>TrendTrader</h1>
      </header>

      <nav className="main-tabs">
        <button
          className={activeTab === 'data' ? 'active' : ''}
          onClick={() => setActiveTab('data')}
        >
          📝 Data Entry
        </button>
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'data' && <DataInputInterface />}
      </main>
    </div>
  );
}

export default App;