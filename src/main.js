import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import router from '@/router/index'
import store from '@/store/index'
import { oauth } from '@/utils/userinfo'
import { setTheme, setBrowserTitle, setPlatCssInclude, setClick } from '@/utils/utils'
import STORAGE from '@/utils/storage'
// 引入所有第三库
import '@/lib/index'

Vue.config.productionTip = false
// 判定当前是否有平台参数
setPlatCssInclude()
router.beforeEach((to, from, next) => {
  if ((to.name === 'depencestart' || to.name === 'votebegin') && !from.name) {
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
  // 第一次进入投票页
  if (route.name === 'votebegin' && !from.name) {
    let detailInfo = STORAGE.get('detailInfo')
    if (detailInfo && detailInfo.id) {
      let { id, title, mark } = detailInfo
      setClick(id, title, mark)
    }
  }
  if (name !== 'depencestart' && name !== 'votebegin') {
    let id = router.currentRoute.params.id
    setTheme(id, name)
  }
})

/* eslint-disable no-new */
window.$vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
