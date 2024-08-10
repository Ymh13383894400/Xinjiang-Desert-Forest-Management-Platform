import request from '@/utils/request'


export function getUAVList() {     // 获取所有以保存的无人机参数信息
  return request({
    url: '/api/samplePlot/getUAVList',
    method: 'get'
  })
}

export function addUAV(data) {     // 获取所有以保存的无人机参数信息
  return request({
    url: '/api/samplePlot/addUAV',
    method: 'post',
    data
  })
}



