import Vue from 'vue'
import config from '../config'

export default {
  settag (id, tag, color) {
    return Vue.http.post(`${config.baseUrl}/set`, { id, tag, color }).then(res => res)
  },
  setsecnameandintro (id, secname, personalintro) {
    return Vue.http.post(`${config.baseUrl}/setsecnameandintro`, { id, secname, personalintro }).then(res => res)
  },
  deletetag (id, tag) {
    return Vue.http.post(`${config.baseUrl}/deletetag`, { id, tag }).then(res => res)
  }
}
