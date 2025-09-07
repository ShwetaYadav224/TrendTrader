// backend/scripts/seedDatabase.js
require('dotenv').config(); // Load environment variables
const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');

// Use environment variables for database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trendtrader_db',
  port: process.env.DB_PORT || 3306
};
async function seed() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to the database!');

    // 1. Clear existing data (Important for re-running the script)
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('TRUNCATE TABLE order_items');
    await connection.execute('TRUNCATE TABLE orders');
    await connection.execute('TRUNCATE TABLE products');
    await connection.execute('TRUNCATE TABLE customers');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🗑️ Cleared existing data.');

    // 2. Insert Products
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty'];
    const productInserts = [];
    for (let i = 0; i < 20; i++) {
      productInserts.push([
        faker.commerce.productName(),
        faker.helpers.arrayElement(categories),
        faker.commerce.price(10, 200),
        faker.commerce.price(5, 100) // cost
      ]);
    }
    await connection.query(
      'INSERT INTO products (name, category, price, cost) VALUES ?',
      [productInserts]
    );
    console.log('📦 Inserted products.');

    // 3. Insert Customers
    const customerInserts = [];
    for (let i = 0; i < 50; i++) {
      customerInserts.push([
        faker.person.firstName(),
        faker.person.lastName(),
        faker.internet.email(),
        faker.location.city(),
        faker.location.state()
      ]);
    }
    await connection.query(
      'INSERT INTO customers (first_name, last_name, email, city, state) VALUES ?',
      [customerInserts]
    );
    console.log('👥 Inserted customers.');

    // 4. Insert Orders and Order Items (This is more complex)
    const [products] = await connection.execute('SELECT id, price FROM products');
    const [customerIds] = await connection.execute('SELECT id FROM customers');

    for (let i = 0; i < 100; i++) { // Create 100 orders
      const randomCustomer = faker.helpers.arrayElement(customerIds);
      const orderDate = faker.date.past({ years: 1 });
      const [orderResult] = await connection.execute(
        'INSERT INTO orders (customer_id, order_date, status) VALUES (?, ?, ?)',
        [randomCustomer.id, orderDate, faker.helpers.arrayElement(['completed', 'completed', 'completed', 'cancelled'])] // Mostly 'completed'
      );
      const orderId = orderResult.insertId;

      // Add 1-4 random items to this order
      const numItems = faker.number.int({ min: 1, max: 4 });
      const itemsInThisOrder = new Set(); // Prevent duplicate products in one order
      for (let j = 0; j < numItems; j++) {
        const randomProduct = faker.helpers.arrayElement(products);
        if (!itemsInThisOrder.has(randomProduct.id)) { // Check for duplicate
          itemsInThisOrder.add(randomProduct.id);
          await connection.execute(
            'INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES (?, ?, ?, ?)',
            [orderId, randomProduct.id, faker.number.int({ min: 1, max: 3 }), randomProduct.price]
          );
        }
      }
    }
    console.log('📋 Inserted orders and items.');

    console.log('✅ Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

seed();