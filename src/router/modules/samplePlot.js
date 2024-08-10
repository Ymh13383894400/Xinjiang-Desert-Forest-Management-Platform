/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'    // 整体布局组件

const samplePlotRouter = {
  path: '/samplePlot',
  component: Layout,
  redirect: '/samplePlot/sampleInfo',
  name: 'samplePlot',
  //hidden: true,    // 在侧边栏隐藏
  meta: {
    title: '样地植物信息',
    icon: 'tree'
  },
  children: [
    {
      path: 'sampleInfo',
      component: () => import('@/views/samplePlot/sampleInfo'),
      name: 'sampleInfo',
      meta: { title: '样地信息' }
    },
    {
      path: 'mapSampleInfo',
      component: () => import('@/views/samplePlot/mapSampleInfo'),
      name: 'mapSampleInfo',
      meta: { title: '地图查看样地' }
    },
    {
      path: 'createSample',
      component: () => import('@/views/samplePlot/createSample'),
      name: 'createSample',
      meta: { title: '新建样地' },
      hidden: true    // 在侧边栏隐藏
    },
    {
      path: 'updateSample',
      component: () => import('@/views/samplePlot/updateSample'),
      name: 'updateSample',
      meta: { title: '修改样地信息' },
      hidden: true    // 在侧边栏隐藏
    },
    {
      path: 'uploadPlantInfo',
      component: () => import('@/views/samplePlot/uploadPlantInfo'),
      name: 'uploadPlantInfo',
      meta: { title: '上传植物信息' },
      hidden: true    // 在侧边栏隐藏
    },
    {
      path: 'samplePlantInfo',
      component: () => import('@/views/samplePlot/samplePlantInfo'),
      name: 'samplePlantInfo',
      meta: { title: '样地植物信息' },
      hidden: true   // 在侧边栏隐藏
    }
  ]
}
export default samplePlotRouter
