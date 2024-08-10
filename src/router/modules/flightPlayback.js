/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'    // 整体布局组件

const flightPlaybackRouter = {
  path: '/flight',
  component: Layout,
  redirect: '/flight/flightPlayback',
  name: 'flight',
  meta: {
    title: '飞播模块',
    icon: 'eye'
  },
  children: [
    {
      path: 'flightPlayback',
      component: () => import('@/views/flight/flightPlayback'),
      name: 'flightPlayback',
      meta: { title: '飞播展示' }
    }
  ]
}
export default flightPlaybackRouter
