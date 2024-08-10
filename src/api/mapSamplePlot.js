import request from '@/utils/request'

export function getSamplePlotName(id) {
  return request({
    url: '/api/samplePlot/getSamplePlotName',
    method: 'get',
    params: { id }
  })
}

export function getSampleImageList(id) {
  return request({
    url: '/api/samplePlot/getSampleImageList',
    method: 'get',
    params: { id }
  })
}

export function get_all_coords() {
  return request({
    url: '/api/samplePlot/get_all_coords',
    method: 'get'
  })
}

