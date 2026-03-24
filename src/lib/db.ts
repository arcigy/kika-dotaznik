import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 
  'postgresql://postgres:uKiwVuKJGuhfMDvqSttkTqNcrpZQoSYX@caboose.proxy.rlwy.net:40687/railway';

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;
