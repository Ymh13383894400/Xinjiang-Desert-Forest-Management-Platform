/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'    // 整体布局组件

const map2DRouter = {
  path: '/device',
  component: Layout,
  redirect: '/device/map2D',
  name: 'map2D',
  hidden: true,    // 在侧边栏隐藏
  meta: {
    title: 'map2D',
    // icon: 'edit'
  },
  children: [
    {
      path: 'map2D',
      component: () => import('@/views/device/map2D.vue'),
      name: 'map2D',
      meta: { title: '无人机拼接样地展示图' }
    }
  ]
}
export default map2DRouter
