/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const dataViewRouter = {
  path: '/dataView',
  component: Layout,
  redirect: '/dataView/complex-table',
  name: 'dataView',
  meta: {
    title: '遥感图像数据',
    icon: 'table'
  },
  children: [
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/dataView/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'Drag Table' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/dataView/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'Inline Edit' }
    // },
    {
      path: 'complex-table',
      component: () => import('@/views/dataView/complex-table'),
      name: 'ComplexTable',
      meta: { title: '历史遥感数据' }
    },
    {
      path: 'dataDetail',
      component: () => import('@/views/dataView/dataDetail/index'),
      name: 'dataDetail',
      meta: { title: '当前数据' }
    },
    {
      path: 'uploadTif',
      component: () => import('@/views/dataView/uploadTif'),
      name: 'uploadTif',
      meta: { title: '上传遥感图像' }
    },
  ]
}
export default dataViewRouter
