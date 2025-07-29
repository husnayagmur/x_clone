const jwt = require('jsonwebtoken');
const User = require('../models/user/UserModel');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  // Header'da Authorization varsa Bearer token yakala
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı token içinden al ve req.user'a ekle
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Geçersiz token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Yetkisiz, token yok' });
  }
};

module.exports = { protect };
