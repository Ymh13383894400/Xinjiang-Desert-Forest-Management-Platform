import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'        // 导入根组件
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// import AmapVue from '@amap/amap-vue'
// // AmapVue.config.version = '1.4.4'
// AmapVue.config.key = '0645e68c28bb589c220a7fed5b101aca'
// Vue.use(AmapVue)
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '0645e68c28bb589c220a7fed5b101aca',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Geocoder'],
  v: '1.4.4',
  uiVersion: '1.0'
})

// import AmapVueConfig from '@amap/amap-vue/lib/config';
// AmapVueConfig.key = '0645e68c28bb589c220a7fed5b101aca';

// import AMap from '@amap/amap-vue'
// AMap.config.key = '0645e68c28bb589c220a7fed5b101aca'
// Vue.use(AMap)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

import { VueJsonp } from 'vue-jsonp'
Vue.prototype.$jsonp = VueJsonp
Vue.use(VueJsonp)

import XLSX from 'xlsx'
Vue.use(XLSX)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false    //当前处于开发环境

new Vue({
  el: '#app',
  router,               // 将路由对象注册到new Vue实例中，建立关联
  store,
  render: h => h(App)    // 使用render方法,基于App.vue创建结构渲染index.html
})
