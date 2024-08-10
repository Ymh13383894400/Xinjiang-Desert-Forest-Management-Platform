const Mock = require('mockjs')

module.exports = [
  {
    url: '/api/sentinel2/getAllCoords/',
    type: 'get',
    response: config => {
      let List = [{
        long: 85.97252924,
        lat: 44.48605973,
        id: 1,
        box_num: 1
      }, {
        long: 85.96387054,
        lat: 44.49013588,
        id: 2,
        box_num: 2
      }, {
        long: 85.98260966,
        lat: 44.47804962,
        id: 3,
        box_num: 3
      }, {
        long: 85.97007515,
        lat: 44.45686488,
        id: 4,
        box_num: 4
      }, {
        long: 85.96045535,
        lat: 44.44872113,
        id: 5,
        box_num: 5
      }, {
        long: 85.96729517,
        lat: 44.44010746,
        id: 6,
        box_num: 6
      }, {
        long: 85.96503652,
        lat: 44.41837664,
        id: 7,
        box_num: 7
      }, {
        long: 86.0043163,
        lat: 44.38527117,
        id: 8,
        box_num: 8
      }, {
        long: 86.0262874,
        lat: 44.3915077,
        id: 9,
        box_num: 9
      }, {
        long: 86.07130256,
        lat: 44.37665087,
        id: 10,
        box_num: 10
      }]

      return {
        code: 20000,
        data: {
          // total: mockList.length,
          dataList: List
        }
      }
    }
  },
  {
    url: '/api/observe/getObserveData',
    type: 'get',
    response: config => {
      const { id } = config.body
      let List = {
        planting_structures: '玉米',
        box_num: '@integer(1, 10)',
        dataList:[{
          sampling_date: '@datetime',
          depth: 10,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 20,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 40,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 60,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 10,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 20,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 40,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 60,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 10,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 20,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 40,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        },{
          sampling_date: '@datetime',
          depth: 60,
          humidity: '@integer(10, 95)',
          conductivity: '@integer(10, 95)',
          nitrogen_content: '@integer(10, 95)'
        }]
      }

      return {
        code: 20000,
        data: List,
      }
    }
  }
]
