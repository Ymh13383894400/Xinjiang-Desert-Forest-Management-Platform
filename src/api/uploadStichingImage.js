import request from '@/utils/request'

export function uploadStitchingImg(data) {
  return request({
    url: '/api/samplePlot/uploadStitchingImage',
    method: 'post',
    data
  })
}

export function uploadUnstitchingImg(data) {
  return request({
    url: '/api/samplePlot/uploadUnstitchingImage',
    method: 'post',
    data
  })
}

export function hergeImg(data) {
  return request({
    url: '/api/samplePlot/hergeImg',
    method: 'get',
    params: {data}
  })
}

export function checkHash(data) {
  return request({
    url: '/api/samplePlot/checkHash',
    method: 'get',
    params: {data}
  })
}

// export function getAllDataList() {
//   return request({
//     url: '/api/sentinel2/list/',
//     method: 'get'
//   })
// }
//
//
// export function getDataListByTime(time) {
//   return request({
//     url: '/api/dataView/getDataListByTime',
//     method: 'get',
//     params: { time }
//   })
// }
//
// export function getDataById(id) {
//   return request({
//     url: '/api/sentinel2/viewSingle/',
//     method: 'get',
//     params: { id }
//   })
// }
//
// export function getCurrentData(id) {
//   return request({
//     url: '/api/sentinel2/getCurrentData/',
//     method: 'get'
//   })
// }
//
// export function uploadImg(data) {
//   return request({
//     url: '/api/sentinel2/uploadImgData/single/',
//     method: 'post',
//     data
//   })
// }
//
// export function login(data) {
//   return request({
//     url: '/vue-element-admin/user/login',
//     method: 'post',
//     data
//   })
// }
//
// export function getInfo(token) {
//   return request({
//     url: '/vue-element-admin/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
//
// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }
