import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL as string, {
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
});

export default sql;
