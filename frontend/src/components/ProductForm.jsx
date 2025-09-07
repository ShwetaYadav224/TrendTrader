import { useState } from 'react';

function ProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    cost: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost)
        })
      });

      if (response.ok) {
        setMessage('Product added successfully!');
        setFormData({ name: '', category: '', price: '', cost: '' });
        if (onProductAdded) onProductAdded();
      } else {
        setMessage('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error adding product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-form">
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            step="0.01"
            name="cost"
            placeholder="Cost"
            value={formData.cost}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProductForm;