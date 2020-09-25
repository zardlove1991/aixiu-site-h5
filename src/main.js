import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import 'url-search-params-polyfill'
import router from '@/router/index'
import store from '@/store/index'
import { oauth } from '@/utils/userinfo'
import { setTheme, setBrowserTitle, setPlatCssInclude } from '@/utils/utils'
// 引入所有第三库
import '@/lib/index'

Vue.config.productionTip = false
// 判定当前是否有平台参数
setPlatCssInclude()
router.beforeEach((to, from, next) => {
  let name = to.name
  if ((name === 'depencestart' ||
    name === 'votebegin' ||
    name === 'votedetail' ||
    name === 'enrollstart') && !from.name) {
    // 第一次进入页面
    oauth((res) => {
      if (res && res.id) {
        next()
      }
    })
  } else {
    next()
  }
})
// 添加路由的钩子函数
router.afterEach((route, from) => {
  // dynamicTitle 动态标题（某个内容跳转）
  let query = router.history.current.query
  let routerTitle = query && query.title ? query.title : route.meta.title
  // 更改当前网页的title
  setBrowserTitle(routerTitle)
  let name = router.currentRoute.name
  let id = router.currentRoute.params.id
  let isFirst = false
  if ((name === 'depencestart' ||
  name === 'votebegin' ||
  name === 'votedetail' ||
  name === 'enrollstart') && !from.name) {
    isFirst = true
  }
  if (name !== 'depencestart') {
    setTheme(id, name, isFirst)
  }
})

/* eslint-disable no-new */
window.$vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
