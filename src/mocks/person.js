const casual = require('casual');

const getPhoto = size => ({
  wdith: size,
  height: size,
  url: `http://placebeard.it/${size}.jpg`,
});

const getPhotos = () => ({
  id: 'img',
  main: 'main',
  shape: 'center_square',
  fileName: 'aec71f5d-58a3-4dc5-b4e7-411e75baefaa.jpg',
  extension: 'jpg',
  processedFiles: [
    getPhoto(640),
    getPhoto(320),
    getPhoto(172),
    getPhoto(84),
  ],
  url: getPhoto(320).url,
});

const person = (id = casual.uuid) => ({
  connection_count: 0,
  common_likes: [],
  common_interests: [{
    name: casual.first_name,
    id: '275648462478015',
  }, {
    name: 'House',
    id: '211534825393',
  }],
  common_friends: [],
  _id: id,
  bio: '',
  birth_date: '1997-03-16T18:22:37.632Z',
  name: casual.first_name,
  ping_time: '2017-03-12T23:09:54.755Z',
  photos: [
    getPhotos(),
    getPhotos(),
    getPhotos(),
  ],
  jobs: [],
  schools: [{
    name: 'Uniwersytet Ekonomiczny w Krakowie',
    id: '194883590821',
  }],
  teasers: [],
  gender: 1,
  birth_date_info: 'fuzzy birthdate active, not displaying real birth_date',
  id,
  distance_mi: casual.integer(2, 50),
  common_connections: [],
});

module.exports = { person, getPhotos };
