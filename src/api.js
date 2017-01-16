import { EXT_ID } from './const/index'

const chromeRuntime = (type, url, params) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(EXT_ID, { type, url, params }, response => {
      if (response.success) {
        resolve(response.resp)
      } else {
        reject(response.resp)
      }
    })
  })
}

export const get = (url, params) => {
  return chromeRuntime('GET', url, params)
}

export const post = (url, params) => {
  return chromeRuntime('POST', url, params)
}

export default {
  get,
  post,
}
