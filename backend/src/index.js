export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    // API routes
    if (path === '/api/test') {
      return new Response(JSON.stringify({ message: 'Hello from the TrendTrader Cloudflare Worker API!' }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (path === '/api/total-sales' && request.method === 'GET') {
      return handleTotalSales(env);
    }

    if (path === '/api/products' && request.method === 'POST') {
      return handleCreateProduct(request, env);
    }

    if (path === '/api/customers' && request.method === 'POST') {
      return handleCreateCustomer(request, env);
    }

    if (path === '/api/debug/products' && request.method === 'GET') {
      return handleDebugProducts(env);
    }

    if (path === '/api/debug/customers' && request.method === 'GET') {
      return handleDebugCustomers(env);
    }

    // Default 404 response
    return new Response('Not Found', { status: 404 });
  },
};

function handleCors(request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

async function handleTotalSales(env) {
  try {
    const db = env.DB;
    const result = await db.prepare(`
      SELECT SUM(oi.quantity * oi.price_per_unit) AS total_sales
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
    `).first();
    
    const totalSales = result?.total_sales || 0;
    return new Response(JSON.stringify({ total_sales: totalSales }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching total sales:', error);
    return new Response(JSON.stringify({ error: "Failed to fetch total sales" }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleCreateProduct(request, env) {
  try {
    const { name, category, price, cost } = await request.json();
    const db = env.DB;
    
    const result = await db.prepare(`
      INSERT INTO products (name, category, price, cost) 
      VALUES (?, ?, ?, ?)
    `).bind(name, category, price, cost).run();
    
    return new Response(JSON.stringify({ 
      message: 'Product created successfully', 
      id: result.meta.last_row_id 
    }), {
      status: 201,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: "Failed to create product" }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleCreateCustomer(request, env) {
  try {
    const { firstName, lastName, email, city, state } = await request.json();
    const db = env.DB;
    
    const result = await db.prepare(`
      INSERT INTO customers (first_name, last_name, email, city, state) 
      VALUES (?, ?, ?, ?, ?)
    `).bind(firstName, lastName, email, city, state).run();
    
    return new Response(JSON.stringify({ 
      message: 'Customer created successfully', 
      id: result.meta.last_row_id 
    }), {
      status: 201,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return new Response(JSON.stringify({ error: "Failed to create customer" }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleDebugProducts(env) {
  try {
    const db = env.DB;
    const result = await db.prepare(`
      SELECT * FROM products ORDER BY id DESC LIMIT 10
    `).all();
    
    return new Response(JSON.stringify(result.results), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleDebugCustomers(env) {
  try {
    const db = env.DB;
    const result = await db.prepare(`
      SELECT * FROM customers ORDER BY id DESC LIMIT 10
    `).all();
    
    return new Response(JSON.stringify(result.results), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new Response(JSON.stringify({ error: "Failed to fetch customers" }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}