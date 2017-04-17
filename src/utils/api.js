import axios from 'axios';
import { EXT_ID } from '../const';

const chromeRuntime = (type, url, params) => {
  if (1) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(EXT_ID, { type, url, params }, (response) => {
        if (!response) {
          reject();
          return;
        }

        if (response.success) {
          resolve(response.resp);
        } else {
          reject(response.resp);
        }
      });
    });
  }
  return axios({
    method: 'GET',
    url: `http://localhost:3001${url}`,
    data: params,
  }, {
    baseURL: 'http://localhost:3001/',
  });
};

export const get = (url, params) => chromeRuntime('GET', url, params);

export const post = (url, params) => chromeRuntime('POST', url, params);

export const del = (url, params) => chromeRuntime('DELETE', url, params);

export default {
  get,
  post,
  del,
};
