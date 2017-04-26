import Vue from 'vue'
import config from '../config'

export default {
  getrecenttag () {
    return Vue.http.get(`${config.baseUrl}/getrecenttag`).then(res => res)
  },
  getstarpj (code) {
    console.log(code)
    return Vue.http.post(`${config.baseUrl}/getstar`, { code }).then(res => res)
  },
  getdatabytag (tag) {
    return Vue.http.post(`${config.baseUrl}/taggetpj`, { tag }).then(res => res)
  }
}
