import Layout from '@/layout'    // 整体布局组件

const testRouter = {
  path: '/test',
  component: Layout,
  redirect: '/test/testInfo',
  name: 'test',
  hidden: true,    // 在侧边栏隐藏
  meta: {
    title: '批量上传植物信息',
    icon: 'tree'
  },
  children: [
    {
      path: 'test',
      component: () => import('@/views/test/Test'),
      name: 'test',
      meta: { title: '批量上传植物信息' },
    }
  ]
}
export default testRouter
