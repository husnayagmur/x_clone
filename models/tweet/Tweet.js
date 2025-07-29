const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  // Tweet’i atan kullanıcı
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Tweet içeriği (max 280 karakter)
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 280
  },

  // Beğenen kullanıcılar
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Retweet yapan kullanıcılar
  retweets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Yorumlar (Comment referansı)
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, { timestamps: true }); // createdAt, updatedAt otomatik eklenir

module.exports = mongoose.model('Tweet', TweetSchema);
