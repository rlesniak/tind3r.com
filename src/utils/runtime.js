import { EXT_ID, originalId, secondStoreId, nonStoreId, setId } from 'const';

export const getFacebookToken = () => {
  chrome.runtime.sendMessage(EXT_ID(), { type: 'FACEBOOK_TOKEN' });
};

export const getTokenDate = (callback) => {
  chrome.runtime.sendMessage(EXT_ID(), {
    type: 'TOKEN_DATE',
  }, date => callback(date));
};

export const checkIfInstalled = (callback) => {
  if (window.chrome) {
    chrome.runtime.sendMessage(EXT_ID(), {
      type: 'CHECK_INSTALLED',
    }, (resp) => {
      if (resp) {
        return callback(true);
      }

      return chrome.runtime.sendMessage(nonStoreId, {
        type: 'CHECK_INSTALLED',
      }, (response) => {
        if (!response) {
          chrome.runtime.sendMessage(originalId, {
            type: 'CHECK_INSTALLED',
          }, (response1) => {
            if (response1) {
              setId(originalId);
              callback(true);
            } else {
              chrome.runtime.sendMessage(secondStoreId, {
                type: 'CHECK_INSTALLED',
              }, (response2) => {
                if (response2) {
                  setId(secondStoreId);
                }

                callback(!!response2);
              });
            }
          });
        } else {
          setId(nonStoreId);

          callback(!!response);
        }
      });
    });
  } else {
    callback(false);
  }
};

export const checkVersion = (cb) => {
  chrome.runtime.sendMessage(EXT_ID(), {
    type: 'GET_VERSION',
  }, response => cb(response));
};

export const getToken = (cb) => {
  chrome.runtime.sendMessage(EXT_ID(), {
    type: 'GET_TOKEN',
  }, response => cb(response));
};

export const purge = () => {
  chrome.runtime.sendMessage(EXT_ID(), { type: 'PURGE' });
};
