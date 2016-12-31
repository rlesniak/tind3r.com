import { EXT_ID } from './const/index'

const chromeRuntime = (type, params = {}) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(EXT_ID, { type, params }, response => {
      if (response.data) {
        resolve(response.data)
      } else if(response.message) {
        resolve(response)
      } else if(response.error.status !== 401) {
        reject(response.error.status)
      } else if(response.error.status === 401) {
        reject(response.error.status)
      }
    })
  })
}

export const getFacebookToken = (resolve, reject) => {
  chrome.runtime.sendMessage(EXT_ID, { type: 'FACEBOOK_TOKEN' })
}

export const getTokenDate = (callback) => {
  chrome.runtime.sendMessage(EXT_ID, { type: 'TOKEN_DATE' }, date => {
    callback(date)
  })
}

export const checkIfInstalled = (callback) => {
  chrome.runtime.sendMessage(EXT_ID, { type: 'CHECK_INSTALLED' }, response => {
    callback(response)
  })
}

export const core = () => {
  return chromeRuntime('FETCH_CORE')
}

export const user = (id) => {
  return chromeRuntime('FETCH_USER', { id })
}

export const meta = () => {
  return chromeRuntime('FETCH_META')
}

export const sendMessage = (userId, message) => {
  return chromeRuntime('SEND_MESSAGE', { userId, message })
}

export const like = (id) => {
  return chromeRuntime('ACTION_LIKE', { id })
}

export const pass = (id) => {
  return chromeRuntime('ACTION_PASS', { id })
}

export const superLike = (id) => {
  return chromeRuntime('ACTION_SUPERLIKE', { id })
}

export const updates = () => {
  return chromeRuntime('FETCH_MESSAGES')
}

export const purge = () => {
  return chromeRuntime('PURGE')
}


export default chromeRuntime
