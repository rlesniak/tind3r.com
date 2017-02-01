import { EXT_ID } from './const/index'

const chromeRuntime = (type, url, params) => new Promise((resolve, reject) => {
  chrome.runtime.sendMessage(EXT_ID, { type, url, params }, response => {
    if (!response) {
      reject()
      return
    }

    if (response.success) {
      resolve(response.resp)
    } else {
      reject(response.resp)
    }
  })
})

export const get = (url, params) => chromeRuntime('GET', url, params)

export const post = (url, params) => chromeRuntime('POST', url, params)

export const del = (url, params) => chromeRuntime('DELETE', url, params)

export default {
  get,
  post,
  del,
}
