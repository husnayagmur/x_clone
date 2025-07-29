const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({

  // Kullanıcı adı (benzersiz, profil URL'sinde görünür)
  username: {
    type: String,
    unique: true,
    required: false,
    trim: true,
    minlength: 3,
    maxlength: 30
  },

  // Email (giriş ve kayıt için zorunlu, benzersiz)
  email: {
    type: String,
    required: [true, 'Email alanı zorunludur'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Geçerli bir email adresi girin'
    }
  },

  // Şifre (hashlenmiş olarak saklanacak, min 7 karakter)
  password: {
    type: String,
    required: [true, 'Şifre alanı zorunludur'],
    minlength: [7, 'Şifre en az 7 karakter olmalıdır']
  },

  // Şifre sıfırlama kodu ve süresi (geçici olarak tutulur)
  resetCode: {
    type: String,
    default: null
  },
  resetCodeExpire: {
    type: Date,
    default: null
  },

  // Profil açıklaması (isteğe bağlı, max 160 karakter)
  bio: {
    type: String,
    default: '',
    maxlength: 160
  },

  // Profil resmi URL’si (Cloudinary vb. servis üzerinden)
  avatar: {
    type: String,
    default: ''
  },

  // Takip eden kullanıcıların ID'leri
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Takip edilen kullanıcıların ID'leri
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

}, { timestamps: true }); // createdAt & updatedAt otomatik eklenir

module.exports = mongoose.model('User', UserSchema);
