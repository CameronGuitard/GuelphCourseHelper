import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../../.env' });

/**
 * Sets up the database client
 * Information is inputted from the environment variables
 */
export const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_USER_PASSWORD,
  database: process.env.DATABASE,
  max: 70,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', err => {
  console.error('Error:', err);
});
