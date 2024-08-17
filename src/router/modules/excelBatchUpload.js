import Layout from '@/layout'    // 整体布局组件

const excelBatchUploadRouter = {
  path: '/excelUpload',
  component: Layout,
  redirect: '/excelUpload/complex-table',
  name: 'excelBatchUpload',
  hidden: true,    // 在侧边栏隐藏
  meta: {
    title: '批量上传植物信息',
    icon: 'tree'
  },
  children: [
    {
      path: 'excelBatchUpload',
      component: () => import('@/views/excelUpload/excelBatchUpload.vue'),
      name: 'excelBatchUpload',
      meta: { title: '批量上传植物信息' },
    }
  ]
}
export default excelBatchUploadRouter
