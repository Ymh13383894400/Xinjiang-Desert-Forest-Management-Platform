import request from '@/utils/request'

export function uploadImg(data) {
  return request({
    url: '/api/samplePlot/uploadUnstitchingImage',
    method: 'post',
    data
  })
}
