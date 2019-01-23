import Vue from 'vue'
import MintUi from 'mint-ui'
import vuePicturePreview from 'vue-picture-preview'
// 引入样式文件
import 'mint-ui/lib/style.css'
import '@/styles/iconfont/exam/iconfont.scss'

// 根据环境判断是否引入debug工具
function addVconsole () {
  let debug = process.env.NODE_ENV !== 'production'
  if (debug) import(`@/lib/vconsole`)
}

addVconsole()
Vue.use(MintUi)
Vue.use(vuePicturePreview)
