/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'    // 整体布局组件

const uploadSImageRouter = {
  path: '/uploadSImage',
  component: Layout,
  redirect: '/uploadSImage/complex-table',
  name: 'uploadSImage',
  //hidden: true,    // 在侧边栏隐藏
  meta: {
    title: '图像上传模块',
    icon: 'edit'
  },
  children: [
    {
      path: 'uploadStitchingImage',
      component: () => import('@/views/uploadImage/uploadStitchingImage.vue'),
      name: 'uploadStichingImage',
      meta: { title: '图像上传模块' }
    }
  ]
}
export default uploadSImageRouter
