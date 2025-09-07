import { useState } from 'react';
import ProductForm from './ProductForm';
import CustomerForm from './CustomerForm';

function DataInputInterface() {
  const [activeTab, setActiveTab] = useState('product');

  return (
    <div className="data-input-interface">
      <h2>Data Input Interface</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === 'product' ? 'active' : ''}
          onClick={() => setActiveTab('product')}
        >
          Add Product
        </button>
        <button 
          className={activeTab === 'customer' ? 'active' : ''}
          onClick={() => setActiveTab('customer')}
        >
          Add Customer
        </button>
        <button 
          className={activeTab === 'order' ? 'active' : ''}
          onClick={() => setActiveTab('order')}
        >
          Add Order
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'product' && <ProductForm />}
        {activeTab === 'customer' && <CustomerForm />}
        {activeTab === 'order' && (
          <div className="data-form">
            <h3>Add New Order</h3>
            <p style={{color: '#666', fontStyle: 'italic'}}>
              Order creation interface coming soon. For now, use the seed script or database tools to add orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataInputInterface;