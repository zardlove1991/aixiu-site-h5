import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import router from '@/router/index'
import store from '@/store/index'
import { setTheme, setBrowserTitle, setPlatCssInclude } from '@/utils/utils'
// 引入所有第三库
import '@/lib/index'

Vue.config.productionTip = false
// 判定当前是否有平台参数
setPlatCssInclude()
// 添加路由的钩子函数
router.afterEach(route => {
  // dynamicTitle 动态标题（某个内容跳转）
  let query = router.history.current.query
  let routerTitle = query && query.title ? query.title : route.meta.title
  // 更改当前网页的title
  setBrowserTitle(routerTitle)
  let id = router.currentRoute.params.id
  setTheme(id)
})

/* eslint-disable no-new */
window.$vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
