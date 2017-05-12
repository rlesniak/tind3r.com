import { EXT_ID, originalId, nonStoreId, setId } from 'const';

export const getFacebookToken = () => {
  chrome.runtime.sendMessage(EXT_ID(), { type: 'FACEBOOK_TOKEN' });
};

export const getTokenDate = callback => {
  chrome.runtime.sendMessage(EXT_ID(), {
    type: 'TOKEN_DATE',
  }, date => callback(date));
};

export const checkIfInstalled = callback => {
  if (window.chrome && window.chrome.webstore) {
    chrome.runtime.sendMessage(nonStoreId, {
      type: 'CHECK_INSTALLED',
    }, response => {
      if (!response) {
        chrome.runtime.sendMessage(originalId, {
          type: 'CHECK_INSTALLED',
        }, response => {
          if (response) {
            setId(originalId);
          }
          callback(!!response);
        });

        return;
      }

      setId(nonStoreId);

      callback(!!response);
    });
  } else {
    callback(false);
  }
};

export const checkVersion = cb => {
  chrome.runtime.sendMessage(EXT_ID(), {
    type: 'GET_VERSION',
  }, response => cb(response));
};

export const purge = () => {
  chrome.runtime.sendMessage(EXT_ID(), { type: 'PURGE' });
};
