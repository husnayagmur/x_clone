const express = require('express');
const router = express.Router();
const Comment = require('../../models/comments/Comment');
const Tweet = require('../../models/tweet/Tweet');
const { protect } = require('../../middlewares/AuthMiddlewares');

// ✅ Yeni yorum oluştur (korumalı)
router.post('/:tweetId', protect, async (req, res) => {
    try {
        const { content } = req.body;
        const { tweetId } = req.params;

        if (!content) {
            return res.status(400).json({ message: 'Yorum metni zorunludur' });
        }

        // Tweet gerçekten var mı?
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({ message: 'Tweet bulunamadı' });
        }

        // Yorum oluştur
        const comment = new Comment({
            author: req.user._id,
            tweet: tweetId,
            content
        });

        await comment.save();

        // 🔥 BURAYI EKLE: tweet'e yorum ID'sini kaydet
        tweet.comments.push(comment._id);
        await tweet.save();

        res.status(201).json({ message: 'Yorum eklendi ve tweet’e işlendi', comment });

    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
});


// ✅ Tüm yorumları getir (isteğe bağlı, public)
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate('author', 'username avatar')   // kullanıcı bilgileri
            .populate('tweet', '_id');               // tweet ID
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
});

// ✅ Bir tweet'e ait yorumları getir (public)
router.get('/tweet/:tweetId', async (req, res) => {
    try {
        const { tweetId } = req.params;

        const comments = await Comment.find({ tweet: tweetId })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
});

// ✅ Yorumu sil (sadece yorum sahibi veya tweet sahibi silebilir)
router.delete('/:commentId', protect, async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId).populate('tweet');
        if (!comment) {
            return res.status(404).json({ message: 'Yorum bulunamadı' });
        }

        // Kullanıcı yorumun sahibi mi veya tweet'in sahibi mi?
        const isAuthor = comment.author.toString() === req.user._id.toString();
        const isTweetOwner = comment.tweet.author?.toString() === req.user._id.toString();

        if (!isAuthor && !isTweetOwner) {
            return res.status(403).json({ message: 'Bu yorumu silme yetkiniz yok' });
        }

        await comment.deleteOne();
        res.status(200).json({ message: 'Yorum silindi' });
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
});

// ✅ Bir tweet'e ait yorum sayısını döndür (public)
router.get('/count/:tweetId', async (req, res) => {
    try {
        const { tweetId } = req.params;

        const commentCount = await Comment.countDocuments({ tweet: tweetId });

        res.status(200).json({ tweetId, commentCount });
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
});



module.exports = router;
