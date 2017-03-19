const getPhotos = require('./person').getPhotos;

const meta = {
  user: {
    _id: 'id1',
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
}

module.exports = meta;
