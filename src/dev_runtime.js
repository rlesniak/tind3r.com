import axios from 'axios'

const config = {
  baseURL: 'http://localhost:3002',
}

const instance = axios.create(config)

const devRuntime = (url) => {
  return new Promise((resolve, reject) => {
    instance.get(url).then((response) => {
      if (response.data) {
        resolve(response.data)
      } else if(response.message) {
        resolve(response)
      } else {
        reject('FACEBOOK')
      }
    })
  })
}
export const core = () => {
  return devRuntime('/recs/core/')
}
