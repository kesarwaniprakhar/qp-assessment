import { Pool } from 'pg';

// Define PostgreSQL connection configuration
const config = {
  user: 'kpzxiger',
  password: 'LyVsHGKpuFR14kEINLjhHzBN6uBxgn72',
  host: 'rain.db.elephantsql.com',
  database: 'kpzxiger',
  // port: 5432, // PostgreSQL default port
};

// Create a new Pool instance to handle connections
const pool = new Pool(config);

// Example query
// (async () => {
//   const client = await pool.connect();
//   try {
//     const res = await client.query('SELECT * FROM your_table');
//     console.log(res.rows);
//   } finally {
//     client.release();
//   }
// })();

export {
  pool
}
