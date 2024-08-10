import request from '@/utils/request'


//批量上传
export function uploadPlantBatch(data) {
  return request({
    url: '/api/samplePlot/uploadPlantBatch',
    method: 'post',
    data
  })
}
