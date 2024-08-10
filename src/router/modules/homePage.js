/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const homePageRouter = {
  path: '/homePage',
  component: Layout,
  redirect: '/homePage/index',
  name: 'homePage',
  meta: {
    title: '首页',
    icon: 'component'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/samplePlot/mapSampleInfo'),
      // component: () => import('@/views/homePage/index'),
      name: 'index',
      meta: { title: '首页' }
    },
  ]
}
export default homePageRouter
