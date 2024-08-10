/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'    // 整体布局组件

const deviceRouter = {
  path: '/device',
  component: Layout,
  redirect: '/device/complex-table',
  name: 'device',
  //hidden: true,    // 在侧边栏隐藏
  meta: {
    title: '成像设备管理',
    icon: 'edit'
  },
  children: [
    {
      path: 'device',
      component: () => import('@/views/device/device.vue'),
      name: 'device',
      meta: { title: '成像设备管理' }
    }
  ]
}
export default deviceRouter
