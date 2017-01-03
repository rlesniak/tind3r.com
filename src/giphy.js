import axios from 'axios'

const gipy = {
  fetch(query) {
    return axios.get(`http://api.giphy.com/v1/gifs/search?q=${encodeURI(query)}&api_key=dc6zaTOxFJmzC`)
  }
}

export default gipy
