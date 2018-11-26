import Vue from 'vue'
import MintUi from 'mint-ui'
import vuePicturePreview from 'vue-picture-preview'
import 'mint-ui/lib/style.css'
import App from './App'
import router from '@/router/index'
import store from '@/store/index'
import { setBrowserTitle, setPlatCssInclude, decodeBase64 } from '@/utils/utils'

Vue.config.productionTip = false
Vue.use(MintUi)
Vue.use(vuePicturePreview)
// 判定当前是否有平台参数
setPlatCssInclude()

// 添加路由的钩子函数
router.afterEach(route => {
  // dynamicTitle 动态标题（某个内容跳转）
  let query = router.history.current.query
  let decodeTitle = query && query.delta && query.title ? decodeBase64(query.title) : query.title
  let routerTitle = query && query.title ? decodeTitle : route.meta.title
  // 更改当前网页的title
  setBrowserTitle(routerTitle)
})

/* eslint-disable no-new */
window.$vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
