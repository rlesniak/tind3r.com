import { browserHistory } from 'react-router'
const editorExtensionId = 'hclhcjagjmknmkjmcnlhddhjojnghjmc'

const chromeRuntime = (type, params = {}) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(editorExtensionId, { type, params }, response => {
      if (response.data) {
        resolve(response.data)
      } else if(response.message) {
        resolve(response)
      } else if(response.error !== 401) {
        reject(response.error)
      } else if(response.error === 401) {
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


export default chromeRuntime
