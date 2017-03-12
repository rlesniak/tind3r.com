import { EXT_ID } from '../const'

export const getFacebookToken = () => {
  chrome.runtime.sendMessage(EXT_ID, { type: 'FACEBOOK_TOKEN' })
}

export const getTokenDate = callback => {
  chrome.runtime.sendMessage(EXT_ID, {
    type: 'TOKEN_DATE',
  }, date => callback(date))
}

export const checkIfInstalled = callback => {
  if (window.chrome && window.chrome.webstore) {
    chrome.runtime.sendMessage(EXT_ID, {
      type: 'CHECK_INSTALLED',
    }, response => callback(response))
  } else {
    callback(false)
  }
}

export const checkVersion = cb => {
  chrome.runtime.sendMessage(EXT_ID, {
    type: 'GET_VERSION',
  }, response => cb(response))
}

export const purge = () => {
  chrome.runtime.sendMessage(EXT_ID, { type: 'PURGE' })
}
