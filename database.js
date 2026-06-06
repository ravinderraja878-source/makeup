const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Helper function to run DB queries in Promise form
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize schema
const initDatabase = async () => {
  try {
    // Create users table
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

    // Create bookings table
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

    // Create registrations table
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

    // Create gallery table
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
    if (galleryCount.count === 0) {
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
  db,
  dbRun,
  dbAll,
  dbGet,
  initDatabase
};
