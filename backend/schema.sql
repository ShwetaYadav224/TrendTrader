-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    cost REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date DATETIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_per_unit REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO products (name, category, price, cost) VALUES 
('Laptop', 'Electronics', 1200.00, 800.00),
('Smartphone', 'Electronics', 800.00, 500.00),
('Headphones', 'Electronics', 150.00, 75.00),
('T-Shirt', 'Clothing', 25.00, 10.00),
('Coffee Mug', 'Home', 15.00, 5.00);

INSERT INTO customers (first_name, last_name, email, city, state) VALUES 
('John', 'Doe', 'john.doe@email.com', 'New York', 'NY'),
('Jane', 'Smith', 'jane.smith@email.com', 'Los Angeles', 'CA'),
('Bob', 'Johnson', 'bob.johnson@email.com', 'Chicago', 'IL');

INSERT INTO orders (customer_id, order_date, status) VALUES 
(1, '2024-01-15 10:30:00', 'completed'),
(2, '2024-01-16 14:45:00', 'completed'),
(1, '2024-01-17 09:15:00', 'pending');

INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES 
(1, 1, 1, 1200.00),
(1, 3, 2, 150.00),
(2, 2, 1, 800.00),
(2, 4, 3, 25.00),
(3, 5, 5, 15.00);