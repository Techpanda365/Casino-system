const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    credentials: true
}));
app.use(express.json());


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  }
});
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only image files allowed'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });


const { auth } = require('./middleware/auth');
app.post('/api/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
  const url = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ url });
});

// MongoDB Atlas Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas connected successfully!');
    console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
const adminRoutes = require('./routes/adminRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const marketRoutes = require('./routes/marketRoutes');
const resultRoutes = require('./routes/resultRoutes');
const settingRoutes = require('./routes/settingRoutes');
const publicRoutes = require('./routes/publicRoutes');
const guessRoutes = require('./routes/guessRoutes');
const chartRoutes = require('./routes/chartRoutes');
const starlineRoutes = require('./routes/starlineRoutes');
const passHuaRoutes = require('./routes/passHuaRoutes');
const apiRoutes = require('./routes/apiRoutes');
const starlineChartRoutes = require('./routes/starlineChartRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const forumRoutes = require('./routes/forumRoutes');
const mainBombayRoutes = require('./routes/mainBombayRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/guesses', guessRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/starline', starlineRoutes);
app.use('/api/passhua', passHuaRoutes);
app.use('/api/v1', apiRoutes);
app.use('/api/starline-charts', starlineChartRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/main-bombay', mainBombayRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Server is running with MongoDB Atlas!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});