const mongoose = require('mongoose');
require('dotenv').config(); // .env dosyasını okuyabilmek için

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📦 MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error.message);
    process.exit(1); // Uygulama başlatılmasın
  }
};

module.exports = connectDB;
