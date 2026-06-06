const path = require('path');
const bcrypt = require('bcryptjs');

let dbClient;
let isPostgres = false;

// Check for cloud database URL (Vercel Postgres provides POSTGRES_URL automatically)
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (dbUrl) {
  isPostgres = true;
  console.log('PostgreSQL environment detected. Initializing cloud database connection...');
  const { Pool } = require('pg');
  dbClient = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false } // Required for cloud databases like Neon or Supabase
  });
} else {
  console.log('SQLite environment detected. Initializing local database...');
  // Dynamic import of sqlite3 to prevent Vercel serverless bundling errors
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.resolve(__dirname, 'database.sqlite');
  dbClient = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to local database:', err.message);
    } else {
      console.log('Connected to local SQLite database.');
    }
  });
}

// Convert SQLite parameter placeholder (?) to PostgreSQL parameter placeholder ($1, $2, ...)
const formatQuery = (sql) => {
  if (!isPostgres) return sql;
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
};

// Promisified DB helpers
const dbRun = (query, params = []) => {
  const formattedQuery = formatQuery(query);
  if (isPostgres) {
    return dbClient.query(formattedQuery, params);
  } else {
    return new Promise((resolve, reject) => {
      dbClient.run(formattedQuery, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }
};

const dbAll = (query, params = []) => {
  const formattedQuery = formatQuery(query);
  if (isPostgres) {
    return dbClient.query(formattedQuery, params).then(res => res.rows);
  } else {
    return new Promise((resolve, reject) => {
      dbClient.all(formattedQuery, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

const dbGet = (query, params = []) => {
  const formattedQuery = formatQuery(query);
  if (isPostgres) {
    return dbClient.query(formattedQuery, params).then(res => res.rows[0]);
  } else {
    return new Promise((resolve, reject) => {
      dbClient.get(formattedQuery, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

// Schema Initialization
const initDatabase = async () => {
  try {
    if (isPostgres) {
      // PostgreSQL Table Schemas
      await dbRun(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(150) UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'client',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          name VARCHAR(150) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          email VARCHAR(150),
          service VARCHAR(150) NOT NULL,
          date VARCHAR(50) NOT NULL,
          time_slot VARCHAR(100) NOT NULL,
          notes TEXT,
          status VARCHAR(50) DEFAULT 'Pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS registrations (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          name VARCHAR(150) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          email VARCHAR(150),
          mode VARCHAR(100) NOT NULL,
          course VARCHAR(150) NOT NULL,
          notes TEXT,
          status VARCHAR(50) DEFAULT 'Pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS gallery (
          id SERIAL PRIMARY KEY,
          url TEXT NOT NULL,
          title VARCHAR(150) NOT NULL,
          description TEXT,
          type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else {
      // SQLite Table Schemas
      await dbRun(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'client',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          service TEXT NOT NULL,
          date TEXT NOT NULL,
          time_slot TEXT NOT NULL,
          notes TEXT,
          status TEXT DEFAULT 'Pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS registrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          mode TEXT NOT NULL,
          course TEXT NOT NULL,
          notes TEXT,
          status TEXT DEFAULT 'Pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbRun(`
        CREATE TABLE IF NOT EXISTS gallery (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          type TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    console.log('Database tables verified/created successfully.');

    // Seed default admin and client accounts if they do not exist
    const adminExists = await dbGet('SELECT * FROM users WHERE username = ?', ['admin']);
    if (!adminExists) {
      const adminHash = await bcrypt.hash('alchemist2026', 10);
      await dbRun(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@alchemistmakeover.in', adminHash, 'admin']
      );
      console.log('Default admin account seeded.');
    }

    const clientExists = await dbGet('SELECT * FROM users WHERE username = ?', ['client']);
    if (!clientExists) {
      const clientHash = await bcrypt.hash('password123', 10);
      await dbRun(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['client', 'client@example.com', clientHash, 'client']
      );
      console.log('Default client account seeded.');
    }

    // Seed default gallery items if table is empty
    const galleryCount = await dbGet('SELECT COUNT(*) as count FROM gallery');
    if (!galleryCount || Number(galleryCount.count) === 0) {
      const defaultItems = [
        { url: '/assets/bridal.png', title: 'Timeless Crimson Bride', description: 'Custom traditional South Indian bridal makeover highlighting glowing gold contouring.', type: 'photo' },
        { url: '/assets/party.png', title: 'Sultry Bronze Glamour', description: 'Sophisticated off-shoulder party glam highlighting dewy bronze skin finish.', type: 'photo' },
        { url: '/assets/editorial.png', title: 'Avant-Garde Copper', description: 'High-fashion copper metallic design structured meticulously for portfolio covers.', type: 'photo' }
      ];

      for (const item of defaultItems) {
        await dbRun(
          'INSERT INTO gallery (url, title, description, type) VALUES (?, ?, ?, ?)',
          [item.url, item.title, item.description, item.type]
        );
      }
      console.log('Default gallery items seeded.');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  db: dbClient,
  dbRun,
  dbAll,
  dbGet,
  initDatabase,
  isPostgres: () => isPostgres
};
