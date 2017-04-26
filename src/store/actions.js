import setdata from '../api/setUserData'
import getdata from '../api/getUserData'

export const settag = ({commit}, {id, tag, color}) => {
  return setdata.settag(id, tag, color).then(data => Promise.resolve(data))
}

export const setsecnameandintro = ({commit}, {id, secname, personalintro}) => {
  return setdata.settag(id, secname, personalintro).then(data => Promise.resolve(data))
}

export const deletetag = ({commit}, {id, tag}) => {
  return setdata.settag(id, tag).then(data => Promise.resolve(data))
}

export const getstarpj = ({commit}, {code}) => {
  console.log(code)
  return getdata.getstarpj(code).then(data => Promise.resolve(data))
}

export const getrecenttag = () => {
  return getdata.getrecenttag().then(data => Promise.resolve(data))
}

export const getdatabytag = ({commit}, {tag}) => {
  return getdata.getdatabytag(tag).then(data => Promise.resolve(data))
}
