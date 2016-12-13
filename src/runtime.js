import { browserHistory } from 'react-router'
const editorExtensionId = 'hclhcjagjmknmkjmcnlhddhjojnghjmc'

const chromeRuntime = (type, params = {}) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(editorExtensionId, { type, params }, response => {
      if (response.data) {
        resolve(response.data)
      } else if(response.message) {
        resolve(response)
      } else {
        browserHistory.push('/fb-connect');
        reject('NEED_FB')
      }
    })
  })
}

export const getFacebookToken = (resolve, reject) => {
  chrome.runtime.sendMessage(editorExtensionId, { type: 'FACEBOOK_TOKEN' })
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

export const like = (id) => {
  return chromeRuntime('ACTION_LIKE', { id })
}

export default chromeRuntime
