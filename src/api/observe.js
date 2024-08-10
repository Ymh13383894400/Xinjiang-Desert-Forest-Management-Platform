import request from '@/utils/request'

export function getObserveList() {
  return request({
    url: '/api/sentinel2/getAllCoords/',
    method: 'get'
  })
}

export function getObserveData(id) {
  return request({
    url: '/api/sentinel2/viewSamplingInfo/',
    method: 'get',
    params: { id }
  })
}

export function uploadData(data) {
  return request({
    url: '/api/sentinel2/upload/batch/',
    method: 'post',
    data
  })
}

export function getRefractList(id) {
  return request({
    url: '/api/sentinel2/getReflectionRate/',
    method: 'get',
    params: { id }
  })
}
