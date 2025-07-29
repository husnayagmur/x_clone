const express = require('express');
const router = express.Router();
const User = require('../../models/user/UserModel');
const Tweet = require('../../models/tweet/Tweet');
const { protect } = require('../../middlewares/AuthMiddlewares');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Multer storage ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile');  // uploads/profile klasörü olmalı
  },
  filename: function (req, file, cb) {
    // Dosya adı: userId + zaman + uzantı
    const ext = path.extname(file.originalname);
    cb(null, req.body.userId + '-' + Date.now() + ext);
  }
});

const upload = multer({ storage });

// ✅ Kullanıcı profili (Kullanıcı bilgilerini döndürür)
router.get('/:id/profile', async (req, res) => {
  try {
    // Kullanıcıyı ID'sine göre bul
    const user = await User.findById(req.params.id)
      .select('username email bio avatar followers following'); // sadece gerekli alanları al

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Kullanıcının tweet sayısını hesapla
    const tweetCount = await Tweet.countDocuments({ author: user._id });

    // Kullanıcının tweet'lerini al
    const tweets = await Tweet.find({ author: user._id })
      .sort({ createdAt: -1 }) // En yeni tweet'leri önce getirecek
      .limit(5);  // Örnek: son 5 tweet'i al

    // Takipçi ve takip edilen kullanıcıları al (sadece gerekli alanlar)
    const followers = await User.find({ _id: { $in: user.followers } }).select('username avatar');
    const following = await User.find({ _id: { $in: user.following } }).select('username avatar');

    // Kullanıcıyı döndür
    res.status(200).json({
      user,
      tweetCount,
      tweets,
      followerCount: user.followers.length,
      followingCount: user.following.length,
      followers,
      following
    });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✅ Takip et
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    if (targetUser._id.equals(req.user._id)) return res.status(400).json({ message: 'Kendini takip edemezsin' });

    if (!targetUser.followers.includes(req.user._id)) {
      targetUser.followers.push(req.user._id);
      currentUser.following.push(targetUser._id);
      await targetUser.save();
      await currentUser.save();
      return res.status(200).json({ message: 'Takip edildi' });
    } else {
      return res.status(400).json({ message: 'Zaten takip ediyorsun' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✅ Takipten çıkar
router.post('/:id/unfollow', protect, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    if (targetUser.followers.includes(req.user._id)) {
      targetUser.followers.pull(req.user._id);
      currentUser.following.pull(targetUser._id);
      await targetUser.save();
      await currentUser.save();
      return res.status(200).json({ message: 'Takipten çıkıldı' });
    } else {
      return res.status(400).json({ message: 'Zaten takip etmiyorsun' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✅ Bir kullanıcının takipçileri
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'username avatar');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    res.status(200).json(user.followers);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✅ Kullanıcı avatarını güncelle (korumalı)
router.put('/:id/profile', protect, upload.single('avatar'), async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Kullanıcı, yalnızca kendini güncelleyebilir
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu işlemi gerçekleştirmek için yetkiniz yok' });
    }

    // Avatar var mı kontrol et, varsa eski avatarı sil
    if (req.file) {
      // Eski avatar dosyası varsa sil
      if (user.avatar) {
        const oldAvatarPath = path.resolve(user.avatar);
        fs.access(oldAvatarPath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldAvatarPath, (unlinkErr) => {
              if (unlinkErr) console.error('Eski avatar silinemedi:', unlinkErr);
              else console.log('Eski avatar silindi:', oldAvatarPath);
            });
          }
        });
      }

      // Yeni avatar'ı güncelle
      user.avatar = req.file.path;
    }

    // Kullanıcı bilgilerini güncelle
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json({
      message: 'Profil başarıyla güncellendi',
      user,
      avatar: user.avatar  // Yüklenen avatar'ın yolu
    });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});




module.exports = router;
