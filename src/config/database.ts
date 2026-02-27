import pg from 'pg';

const { Pool } = pg;

let pool: Pool | null = null;

export const initializeDatabase = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.warn('⚠️  DATABASE_URL not set. Using in-memory storage for development.');
    return null;
  }

  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully:', result.rows[0]);
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.warn('📝 Falling back to in-memory storage');
    return null;
  }
};

export const getDatabase = () => {
  if (!pool) {
    console.warn('Database not initialized. Using in-memory storage.');
    return null;
  }
  return pool;
};

export const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection closed');
  }
};

// Initialize tables if needed
export const initializeTables = async () => {
  if (!pool) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        profile_image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS prayers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS marketplace (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
};

export default async function connectDB() {
  return initializeDatabase();
}
