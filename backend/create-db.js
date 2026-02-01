const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // Підключаємось до стандартної бази postgres
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('✓ Connected to PostgreSQL');

    // Перевіряємо чи існує база
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (checkDb.rows.length === 0) {
      console.log(`Creating database ${process.env.DB_NAME}...`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('✓ Database created successfully!');
    } else {
      console.log(`✓ Database ${process.env.DB_NAME} already exists`);
    }

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

createDatabase();
