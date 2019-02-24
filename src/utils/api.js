/* eslint-disable no-param-reassign */
import { EXT_ID } from 'const';

const chromeRuntime = (type, url, params) =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(EXT_ID(), { type, url, params }, (response) => {
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

chrome.runtime.sendMessage(EXT_ID(), {
  type: 'CONFIG',
  configObj: {
    baseURL: 'https://api.gotinder.com/',
    timeout: 30000,
  },
});

chrome.runtime.sendMessage(EXT_ID(), {
  type: 'ATTACH_HEADERS',
  host: '*://api.gotinder.com/*',
  callback: `(details) => {
    details.requestHeaders.forEach((header) => {
      if (header.name === 'User-Agent') {
        header.value = 'Tinder/6.3.1 (iPhone; iOS 10.0.2; Scale/2.00)';
      }
      if (header.name === 'Origin') {
        header.value = '';
      }
    });
    return { requestHeaders: details.requestHeaders };
  }`,
});

export const get = (url, params) => chromeRuntime('GET', url, params);

export const post = (url, params) => chromeRuntime('POST', url, params);

export const del = (url, params) => chromeRuntime('DELETE', url, params);

export default {
  get,
  post,
  del,
};
