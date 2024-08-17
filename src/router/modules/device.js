/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'    // 整体布局组件

const deviceRouter = {
  path: '/device',    //文件夹的名字
  component: Layout,
  redirect: '/device/complex-table',    //文件夹,不确定？？？？
  name: 'device',
  //hidden: true,    // 在侧边栏隐藏
  meta: {
    title: '成像设备管理',
    icon: 'disc'
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
