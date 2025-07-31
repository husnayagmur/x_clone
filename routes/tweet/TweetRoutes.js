const express = require('express');
const router = express.Router();
const Tweet = require('../../models/tweet/Tweet');
const { protect } = require('../../middlewares/AuthMiddlewares');

// ✅ Tweet oluştur (sadece giriş yapan)
router.post('/', protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Tweet içeriği zorunludur' });
    }

    const tweet = new Tweet({
      content,
      author: req.user._id
    });

    await tweet.save();
    res.status(201).json({ message: 'Tweet oluşturuldu', tweet });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// /routes/tweetRoutes.js

router.get('/feed', protect, async (req, res) => {
  try {
    const user = req.user;
    const userIdsToFetch = [...user.following, user._id];

    const tweets = await Tweet.find({ author: { $in: userIdsToFetch } })
      .populate('author', 'username avatar')
      .populate('comments') // yorumları çekiyoruz
      .sort({ createdAt: -1 });

    const enrichedTweets = tweets.map(tweet => {
      const likedByUser = tweet.likes.includes(user._id);
      const retweetedByUser = tweet.retweets.includes(user._id);

      return {
        _id: tweet._id,
        content: tweet.content,
        author: tweet.author,
        createdAt: tweet.createdAt,
        likeCount: tweet.likes.length,
        retweetCount: tweet.retweets.length,
        commentCount: tweet.comments.length,
        likedByUser,
        retweetedByUser,
      };
    });

    res.status(200).json(enrichedTweets);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});



// ✅ Tüm tweet’leri getir (public)
router.get('/', async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(tweets);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✅ Tweet beğen / geri al (toggle)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: 'Tweet bulunamadı' });

    const alreadyLiked = tweet.likes.includes(req.user._id);

    if (alreadyLiked) {
      tweet.likes.pull(req.user._id);
    } else {
      tweet.likes.push(req.user._id);
    }

    await tweet.save();
    res.status(200).json({ message: alreadyLiked ? 'Beğeni kaldırıldı' : 'Beğenildi' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✅ Retweet / geri al
router.post('/:id/retweet', protect, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: 'Tweet bulunamadı' });

    const alreadyRetweeted = tweet.retweets.includes(req.user._id);

    if (alreadyRetweeted) {
      tweet.retweets.pull(req.user._id);
    } else {
      tweet.retweets.push(req.user._id);
    }

    await tweet.save();
    res.status(200).json({ message: alreadyRetweeted ? 'Retweet geri alındı' : 'Retweet yapıldı' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✅ Sadece beğeni sayısını döndür (opsiyonel kısa yol)
router.get('/:id/like-count', async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: 'Tweet bulunamadı' });

    res.status(200).json({ likeCount: tweet.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✅ Belirli bir tweet'in sadece retweet eden kullanıcılarını döndür
router.get('/:id/retweet-count', async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id).populate('retweets', 'username avatar');
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet bulunamadı' });
    }

    res.status(200).json({
      retweetCount: tweet.retweets.length,
      retweetedUsers: tweet.retweets
    });

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// ✅ Belirli bir kullanıcının tweetlerini getir
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const tweets = await Tweet.find({ author: userId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(tweets);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});



module.exports = router;
