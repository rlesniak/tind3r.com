const getPhotos = require('./person').getPhotos;

const meta = {
  user: {
    _id: '582f3d054b19f1e97981172a',
    full_name: 'Rafal El',
    name: 'Rafal',
    photos: [getPhotos()],
  },
  rating: {
    likes_remaining: 100,
    rate_limited_until: null,
    super_likes: {
      remaining: 1,
      resets_at: null,
    },
  },
};

module.exports = meta;
