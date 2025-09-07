# TrendTrader Dashboard - Project Documentation

## Overview
TrendTrader Dashboard is a full-stack web application for managing e-commerce data including products, customers, orders, and sales analytics.

## Technology Stack

### Frontend
- **React 18** - Frontend framework with hooks
- **Vite** - Build tool and development server
- **CSS3** - Styling with modern CSS features
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **mysql2/promise** - MySQL client with promise support
- **CORS** - Cross-origin resource sharing middleware
- **dotenv** - Environment variable management

### Development Tools
- **Nodemon** - Auto-restart server during development
- **Faker.js** - Test data generation

## Project Structure

```
trendtrader-dashboard/
├── backend/
│   ├── server.js              # Main server file with all API endpoints
│   ├── package.json           # Backend dependencies and scripts
│   ├── .env                   # Environment variables
│   └── scripts/
│       └── seedDatabase.js    # Database seeding script
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── App.css            # Application styles
│   │   ├── main.jsx           # React entry point
│   │   └── components/
│   │       ├── ProductForm.jsx          # Product creation form
│   │       ├── CustomerForm.jsx         # Customer creation form
│   │       └── DataInputInterface.jsx   # Tabbed interface component
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
└── PROJECT_DOCUMENTATION.md   # This file
```

## Database Schema

### Products Table
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR) - Product name
- `category` (VARCHAR) - Product category
- `price` (DECIMAL) - Selling price
- `cost` (DECIMAL) - Cost price

### Customers Table
- `id` (INT, Primary Key, Auto Increment)
- `first_name` (VARCHAR) - Customer first name
- `last_name` (VARCHAR) - Customer last name
- `email` (VARCHAR) - Customer email
- `city` (VARCHAR) - Customer city
- `state` (VARCHAR) - Customer state

### Orders Table
- `id` (INT, Primary Key, Auto Increment)
- `customer_id` (INT, Foreign Key) - References customers.id
- `order_date` (DATETIME) - Order date
- `status` (VARCHAR) - Order status

### Order Items Table
- `id` (INT, Primary Key, Auto Increment)
- `order_id` (INT, Foreign Key) - References orders.id
- `product_id` (INT, Foreign Key) - References products.id
- `quantity` (INT) - Quantity ordered
- `price_per_unit` (DECIMAL) - Price at time of order

## API Endpoints

### GET Endpoints
- `GET /api/test` - Test connection to backend
- `GET /api/total-sales` - Get total revenue from completed orders
- `GET /api/debug/products` - Debug endpoint to view products
- `GET /api/debug/customers` - Debug endpoint to view customers

### POST Endpoints (Data Input)
- `POST /api/products` - Create new product
- `POST /api/customers` - Create new customer
- `POST /api/orders` - Create new order
- `POST /api/order-items` - Create new order item

## Data Input Interface

### Product Form
- **Fields**: Name, Category, Price, Cost
- **Validation**: All fields required, numeric validation for price/cost
- **Endpoint**: POST to `/api/products`

### Customer Form
- **Fields**: First Name, Last Name, Email, City, State
- **Validation**: All fields required, email format validation
- **Endpoint**: POST to `/api/customers`

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (running on port 3308)
- MySQL database named `trendtrader_db`

### Backend Setup
```bash
cd trendtrader-dashboard/backend
npm install
# Configure database in .env file
npm start
```

### Frontend Setup
```bash
cd trendtrader-dashboard/frontend
npm install
npm run dev
```

### Database Seeding
```bash
cd trendtrader-dashboard/backend
npm run seed
```


## Future Enhancements
- Order creation interface
- Data validation improvements
- Authentication system
- Data visualization charts
- Search and filtering capabilities
- Pagination for large datasets