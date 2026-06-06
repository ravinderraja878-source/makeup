require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { initDatabase, dbRun, dbAll, dbGet } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'alchemist_makeup_artistry_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Directories
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve Static Uploads
app.use('/uploads', express.static(uploadsDir));

// Also serve client assets if they exist (bridging for local/dev assets if needed)
app.use('/assets', express.static(path.join(__dirname, 'client', 'public', 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Multer Config for Gallery Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|ogg|mov/i;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only images and video files are allowed.'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max limit
});

// Middleware: Authenticate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

// Middleware: Require Admin Role
const requireAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }
    next();
  });
};

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register Client
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const userExists = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
    if (userExists) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    if (email) {
      const emailExists = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already registered.' });
      }
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await dbRun(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email || null, passwordHash, 'client']
    );

    res.status(201).json({ message: 'User registered successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Database error.', error: error.message });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// Current User Info
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});


// ==========================================
// BOOKING ROUTES
// ==========================================

// Get Bookings (Admin: all, Client: own)
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await dbAll('SELECT * FROM bookings ORDER BY date DESC, time_slot ASC');
    } else {
      bookings = await dbAll('SELECT * FROM bookings WHERE user_id = ? ORDER BY date DESC, time_slot ASC', [req.user.id]);
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookings.', error: error.message });
  }
});

// Add Booking (Public / Authenticated)
app.post('/api/bookings', async (req, res) => {
  const { user_id, name, phone, email, service, date, time_slot, notes } = req.body;
  if (!name || !phone || !service || !date || !time_slot) {
    return res.status(400).json({ message: 'Missing required booking fields.' });
  }

  try {
    await dbRun(
      `INSERT INTO bookings (user_id, name, phone, email, service, date, time_slot, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, name, phone, email || null, service, date, time_slot, notes || '']
    );
    res.status(201).json({ message: 'Booking requested successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving booking.', error: error.message });
  }
});

// Update Booking Status (Admin Only)
app.put('/api/bookings/:id', requireAdmin, async (req, res) => {
  const { status, notes } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  try {
    const booking = await dbGet('SELECT * FROM bookings WHERE id = ?', [id]);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    await dbRun(
      'UPDATE bookings SET status = ?, notes = COALESCE(?, notes) WHERE id = ?',
      [status, notes !== undefined ? notes : null, id]
    );

    res.json({ message: `Booking status updated to ${status}.` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking.', error: error.message });
  }
});


// ==========================================
// ACADEMY REGISTRATION ROUTES
// ==========================================

// Get Registrations (Admin: all, Client: own)
app.get('/api/registrations', authenticateToken, async (req, res) => {
  try {
    let registrations;
    if (req.user.role === 'admin') {
      registrations = await dbAll('SELECT * FROM registrations ORDER BY created_at DESC');
    } else {
      registrations = await dbAll('SELECT * FROM registrations WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    }
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving academy registrations.', error: error.message });
  }
});

// Add Registration (Public / Authenticated)
app.post('/api/registrations', async (req, res) => {
  const { user_id, name, phone, email, mode, course, notes } = req.body;
  if (!name || !phone || !mode || !course) {
    return res.status(400).json({ message: 'Missing required academy registration fields.' });
  }

  try {
    await dbRun(
      `INSERT INTO registrations (user_id, name, phone, email, mode, course, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, name, phone, email || null, mode, course, notes || '']
    );
    res.status(201).json({ message: 'Academy registration submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving registration.', error: error.message });
  }
});

// Update Registration Status (Admin Only)
app.put('/api/registrations/:id', requireAdmin, async (req, res) => {
  const { status, notes } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  try {
    const registration = await dbGet('SELECT * FROM registrations WHERE id = ?', [id]);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    await dbRun(
      'UPDATE registrations SET status = ?, notes = COALESCE(?, notes) WHERE id = ?',
      [status, notes !== undefined ? notes : null, id]
    );

    res.json({ message: `Registration status updated to ${status}.` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating registration.', error: error.message });
  }
});


// ==========================================
// GALLERY ROUTES
// ==========================================

// Get Gallery Items (Public)
app.get('/api/gallery', async (req, res) => {
  try {
    const galleryItems = await dbAll('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving gallery items.', error: error.message });
  }
});

// Add Gallery Item (Admin Only - Supports File Upload)
app.post('/api/gallery', requireAdmin, upload.single('mediaFile'), async (req, res) => {
  const { title, description, type } = req.body;
  if (!title || !type) {
    return res.status(400).json({ message: 'Title and media type are required.' });
  }

  let fileUrl = req.body.url; // Support external URL if provided

  if (req.file) {
    // Save as local uploads path
    fileUrl = `/uploads/${req.file.filename}`;
  }

  if (!fileUrl) {
    return res.status(400).json({ message: 'A uploaded file or external media URL is required.' });
  }

  try {
    await dbRun(
      'INSERT INTO gallery (url, title, description, type) VALUES (?, ?, ?, ?)',
      [fileUrl, title, description || '', type]
    );
    res.status(201).json({ message: 'Media added to gallery successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving gallery item.', error: error.message });
  }
});

// Delete Gallery Item (Admin Only)
app.delete('/api/gallery/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const item = await dbGet('SELECT * FROM gallery WHERE id = ?', [id]);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found.' });
    }

    // If local file, delete it from filesystem
    if (item.url.startsWith('/uploads/')) {
      const fileName = item.url.replace('/uploads/', '');
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await dbRun('DELETE FROM gallery WHERE id = ?', [id]);
    res.json({ message: 'Gallery item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gallery item.', error: error.message });
  }
});

// Serve React production build files
const clientBuildPath = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Server is running. Frontend is not built yet.');
  });
}

// Start Server
app.listen(PORT, async () => {
  await initDatabase();
  console.log(`Server is running on port ${PORT}`);
});
