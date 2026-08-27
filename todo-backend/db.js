// db.js - PostgreSQL Database Connection & Initialization

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "todos_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

// Verify connection and initialize table schema
const initDb = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database successfully.");
    await client.query(queryText);
    console.log("Database schema initialized (table 'todos' is ready).");
    client.release();
  } catch (err) {
    console.error("Error connecting to PostgreSQL or initializing schema:", err);
    throw err;
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDb,
};
