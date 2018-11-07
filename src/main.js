import Vue from 'vue'
import MintUi from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import router from '@/router/index'
import store from '@/store/index'

Vue.config.productionTip = false
Vue.use(MintUi)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
