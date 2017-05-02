import { get } from './api';

export default {
  matches() {
    return new Promise((resolve, reject) => {
      get('/updates').then(data => {
        console.log(data);
      });
    });
  },
};
