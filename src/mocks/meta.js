const getPhotos = require('./person').getPhotos;

const meta = {
  user: {
    _id: 'id1',
    full_name: 'Rafal El',
    name: 'Rafal',
    photos: getPhotos(),
  }
}

module.exports = meta;
