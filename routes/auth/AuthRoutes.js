// routes/authRoutes.
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../../models/user/UserModel');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});


// ✔ KAYIT
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email ve şifre zorunludur' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Bu email zaten kayıtlı' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Kayıt başarılı', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✔ GİRİŞ
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email ve şifre zorunludur' });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      message: 'Giriş başarılı',
      token,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✔ ŞİFREMİ UNUTTUM
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: EMAIL_USER,
      to: user.email,
      subject: 'SocialApp Şifre Sıfırlama Kodu',
      text: `Şifre sıfırlama kodunuz: ${code}`
    });

    res.status(200).json({ message: 'Kod gönderildi' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✔ ŞİFRE SIFIRLAMA (KOD İLE)
router.post('/reset-password-with-code', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email, resetCode: code, resetCodeExpire: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ message: 'Kod geçersiz veya süresi dolmuş' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Şifre başarıyla yenilendi' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✔ GİRİŞ YAPMIŞ KULLANICI ŞİFRE DEĞİŞTİRME
router.post('/change-password', async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json({ message: 'Eski şifre yanlış' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Şifre başarıyla değiştirildi' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});


module.exports = router;