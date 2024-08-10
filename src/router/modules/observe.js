/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const observeRouter = {
  path: '/observe',
  component: Layout,
  redirect: '/observe/complex-table',
  name: 'observe',
  meta: {
    title: '地面采样数据',
    icon: 'star'
  },
  children: [
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/observe/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'Drag Table' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/observe/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'Inline Edit' }
    // },
    {
      path: 'observeShow',
      component: () => import('@/views/observe/observeShow'),
      name: 'observeShow',
      meta: { title: '观测点展示' }
    },
    {
      path: 'uploadObserve',
      component: () => import('@/views/observe/uploadObserve'),
      name: 'uploadObserve',
      meta: { title: '上传采样数据' }
    }
  ]
}
export default observeRouter
