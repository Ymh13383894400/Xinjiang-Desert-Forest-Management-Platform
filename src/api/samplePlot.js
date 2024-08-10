import request from '@/utils/request'


export function uploadPlantInfo(data) {     // 修改植物信息
  return request({
    url: '/api/samplePlot/uploadPlantInfo',
    method: 'post',
    data
  })
}


export function getSamplePlantList(id) {    //样地植物列表
  return request({
    url: '/api/samplePlot/getSamplePlantList',
    method: 'get',
    params: { id }
  })
}

export function getSamplePlotBranchList(id) {    //样地植物列表
  return request({
    url: '/api/samplePlot/getSamplePlotBranchList',
    method: 'get',
    params: { id }
  })
}

export function getSamplePlotList() {     //查看样地列表
  return request({
    url: '/api/samplePlot/getSamplePlotList',
    method: 'get'
  })
}

export function CreateSample(data) {     // 新建样地
  return request({
    url: '/api/samplePlot/CreateSample',
    method: 'post',
    data
  })
}

export function updateSample(data) {     // 修改样地
  return request({
    url: '/api/samplePlot/updateSample',
    method: 'post',
    data
  })
}

export function deleteSamplePlot(id) {     // 删除样地
  return request({
    url: '/api/samplePlot/deleteSamplePlot',
    method: 'get',
    params: { id }
  })
}

