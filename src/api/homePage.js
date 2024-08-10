import request from '@/utils/request'

export function getWeather(city) {
  return request({
    url: 'http://wthrcdn.etouch.cn/weather_mini',
    method: 'get',
    params: { city }
  })
}

export function getNDVIList() {
  return request({
    url: '/api/sentinel2/getNdviList/',
    method: 'get'
  })
}

export function getPlantList() {
  return request({
    url: '/api/sentinel2/getPlantList/',
    method: 'get'
  })
}

export function getCurrentData(id) {
  return request({
    url: '/api/dataView/getCurrentData',
    method: 'get'
  })
}

export function uploadImg(data) {
  return request({
    url: '/api/sentinel2/uploadImgData/single/',
    method: 'post',
    data
  })
}
