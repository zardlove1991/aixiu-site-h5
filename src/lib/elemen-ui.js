import 'element-ui/lib/theme-chalk/index.css'
import {
  Progress,
  Tooltip
} from 'element-ui'

export default function (Vue) {
  Vue.use(Progress)
  Vue.use(Tooltip)
}
