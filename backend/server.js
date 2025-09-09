const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const app = express();
const port = process.env.PORT; // Use 5001 to not conflict with React's dev server (3000)

// Add this near the top of server.js, after require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a pool of database connections (more efficient)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trendtrader_db',
  port: process.env.DB_PORT || 3308,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection on startup
pool.getConnection()
  .then(connection => {
    console.log(' Database connected successfully!');
    connection.release();
  })
  .catch(error => {
    console.error(' Database connection failed:', error.message);
    console.log('Please check your database configuration in .env file');
  });


// Middleware (MUST be defined BEFORE routes)
app.use(cors()); // Allows requests from your React frontend
app.use(express.json()); // Allows server to parse JSON

// A simple test route to see if the server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the TrendTrader backend API!' });
});

// Total sales route
app.get('/api/total-sales', async (req, res) => {
  try {
    // This query calculates total revenue by summing (quantity * price) from all completed orders.
    const [results] = await pool.execute(`
      SELECT SUM(oi.quantity * oi.price_per_unit) AS total_sales
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
    `);
    // The result is an array. Send the total_sales value back to the frontend.
    const totalSales = results[0].total_sales;
    // Convert to number and handle null/undefined cases
    const numericTotalSales = totalSales === null || totalSales === undefined ? 0 : Number(totalSales);
    res.json({ total_sales: numericTotalSales });
  } catch (error) {
    console.error('Total sales error:', error);
    res.status(500).json({ error: "Failed to fetch total sales: " + error.message });
  }
});

// Create new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, cost } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO products (name, category, price, cost) VALUES (?, ?, ?, ?)',
      [name, category, price, cost]
    );
    res.status(201).json({ message: 'Product created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: "Failed to create product: " + error.message });
  }
});

// Create new customer
app.post('/api/customers', async (req, res) => {
  try {
    const { firstName, lastName, email, city, state } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO customers (first_name, last_name, email, city, state) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, city, state]
    );
    res.status(201).json({ message: 'Customer created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: "Failed to create customer: " + error.message });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerId, orderDate, status } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO orders (customer_id, order_date, status) VALUES (?, ?, ?)',
      [customerId, orderDate, status]
    );
    res.status(201).json({ message: 'Order created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: "Failed to create order: " + error.message });
  }
});

// Create new order item
app.post('/api/order-items', async (req, res) => {
  try {
    const { orderId, productId, quantity, pricePerUnit } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES (?, ?, ?, ?)',
      [orderId, productId, quantity, pricePerUnit]
    );
    res.status(201).json({ message: 'Order item created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create order item error:', error);
    res.status(500).json({ error: "Failed to create order item: " + error.message });
  }
});

// Debug endpoint to check products
app.get('/api/debug/products', async (req, res) => {
  try {
    const [results] = await pool.execute('SELECT * FROM products ORDER BY id DESC LIMIT 10');
    res.json(results);
  } catch (error) {
    console.error('Debug products error:', error);
    res.status(500).json({ error: "Failed to fetch products: " + error.message });
  }
});

// Debug endpoint to check customers
app.get('/api/debug/customers', async (req, res) => {
  try {
    const [results] = await pool.execute('SELECT * FROM customers ORDER BY id DESC LIMIT 10');
    res.json(results);
  } catch (error) {
    console.error('Debug customers error:', error);
    res.status(500).json({ error: "Failed to fetch customers: " + error.message });
  }
});

// Delete customer endpoint
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const [result] = await pool.execute('DELETE FROM customers WHERE id = ?', [customerId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
      res.status(400).json({ error: "Cannot delete customer - they have existing orders. Delete orders first or use cascade delete." });
    } else {
      res.status(500).json({ error: "Failed to delete customer: " + error.message });
    }
  }
});

// Delete product endpoint
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [productId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
      res.status(400).json({ error: "Cannot delete product - it is referenced in existing orders. Delete order items first or use cascade delete." });
    } else {
      res.status(500).json({ error: "Failed to delete product: " + error.message });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});