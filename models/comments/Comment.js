// models/Comment.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  // Yorumu yazan kullanıcı (referans)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Yorumun ait olduğu tweet (referans)
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
    required: true
  },

  // Yorumun metni
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500 // isteğe göre artırılabilir
  }

}, { timestamps: true }); // createdAt ve updatedAt otomatik gelir

module.exports = mongoose.model('Comment', CommentSchema);
