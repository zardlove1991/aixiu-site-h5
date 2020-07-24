import Vue from 'vue'
import MintUi from 'mint-ui'
import vuePicturePreview from 'vue-picture-preview'
import echarts from 'echarts'
import { getEnvironment } from '@/utils/app'
import AddElementUI from '@/lib/elemen-ui'
// 引入样式文件
import 'mint-ui/lib/style.css'
import '@/styles/iconfont/exam/iconfont.scss'

// 根据环境判断是否引入debug工具
function addVconsole () {
  // let apiFlag = getApiFlag()
  // if (['API41', 'EXAMAPI'].includes(apiFlag)) import(`@/lib/vconsole`)
  let plat = getEnvironment()
  if (['test', 'pre'].includes(plat)) import(`@/lib/vconsole`)
}
addVconsole()
AddElementUI(Vue)

Vue.use(MintUi)
Vue.use(vuePicturePreview)

Vue.prototype.$echarts = echarts
