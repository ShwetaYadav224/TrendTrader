import { useState, useEffect } from 'react';

function DataView() {
  const [activeView, setActiveView] = useState('products');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/debug/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      setError('Error fetching products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/debug/customers`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        setError('Failed to fetch customers');
      }
    } catch (error) {
      setError('Error fetching customers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCustomers(customers.filter(customer => customer.id !== customerId));
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete customer');
      }
    } catch (error) {
      setError('Error deleting customer: ' + error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== productId));
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete product');
      }
    } catch (error) {
      setError('Error deleting product: ' + error.message);
    }
  };

  useEffect(() => {
    if (activeView === 'products') {
      fetchProducts();
    } else {
      fetchCustomers();
    }
  }, [activeView]);

  const refreshData = () => {
    if (activeView === 'products') {
      fetchProducts();
    } else {
      fetchCustomers();
    }
  };

  return (
    <div className="data-view">
      <h2>View Data</h2>
      
      <div className="view-tabs">
        <button 
          className={activeView === 'products' ? 'active' : ''}
          onClick={() => setActiveView('products')}
        >
          📦 Products
        </button>
        <button 
          className={activeView === 'customers' ? 'active' : ''}
          onClick={() => setActiveView('customers')}
        >
          👥 Customers
        </button>
        <button onClick={refreshData} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="data-table-container">
          {activeView === 'products' && (
            <div className="data-table">
              <h3>Products ({products.length})</h3>
              {products.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Cost</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.price}</td>
                        <td>${product.cost}</td>
                        <td>{new Date(product.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Delete product"
                          >
                           Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No products found.</p>
              )}
            </div>
          )}

          {activeView === 'customers' && (
            <div className="data-table">
              <h3>Customers ({customers.length})</h3>
              {customers.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.first_name}</td>
                        <td>{customer.last_name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.city}</td>
                        <td>{customer.state}</td>
                        <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteCustomer(customer.id)}
                            title="Delete customer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No customers found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DataView;