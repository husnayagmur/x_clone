const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

app.use(express.json());  // JSON body parsing için gerekli

// Statik dosyaları (upload edilen resimler gibi) sunmak için:
app.use('/uploads', express.static('uploads'));

const authRoutes = require('./routes/auth/AuthRoutes');
app.use('/auth', authRoutes);


const tweetRoutes = require('./routes/tweet/TweetRoutes');
app.use('/tweets', tweetRoutes);

const commentRoutes = require('./routes/comment/CommentRoutes');
app.use('/comments', commentRoutes);

const userRoutes = require('./routes/user/UserRoutes'); 
app.use('/users', userRoutes); 

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server ${PORT} portunda çalışıyor✅`);
});
