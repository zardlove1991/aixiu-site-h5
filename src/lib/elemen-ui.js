import 'element-ui/lib/theme-chalk/index.css'
import {
  Progress,
  Tooltip,
  Radio,
  Checkbox,
  Input
} from 'element-ui'

export default function (Vue) {
  Vue.use(Progress)
  Vue.use(Tooltip)
  Vue.use(Radio)
  Vue.use(Checkbox)
  Vue.use(Input)
}
