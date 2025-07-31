const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();
const app = express();

// ✅ CORS
app.use(cors({
  origin: 'http://localhost:3000', // frontend'in çalıştığı port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Statik dosyalar
app.use('/uploads', express.static('uploads'));

// ✅ Route'lar
const authRoutes = require('./routes/auth/AuthRoutes');
app.use('/auth', authRoutes);

const tweetRoutes = require('./routes/tweet/TweetRoutes');
app.use('/tweets', tweetRoutes);

const commentRoutes = require('./routes/comment/CommentRoutes');
app.use('/comments', commentRoutes);

const userRoutes = require('./routes/user/UserRoutes');
app.use('/users', userRoutes);

// ✅ MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB bağlantısı başarılı');
}).catch(err => {
  console.error('❌ MongoDB bağlantı hatası:', err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server ${PORT} portunda çalışıyor✅`);
});
