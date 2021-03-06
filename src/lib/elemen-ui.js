import 'element-ui/lib/theme-chalk/index.css'
import {
  Progress,
  Tooltip,
  Radio,
  Checkbox,
  Input,
  Upload,
  Image,
  Loading,
  Cascader,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui'

export default function (Vue) {
  Vue.use(Progress)
  Vue.use(Tooltip)
  Vue.use(Radio)
  Vue.use(Checkbox)
  Vue.use(Input)
  Vue.use(Upload)
  Vue.use(Image)
  Vue.use(Loading)
  Vue.use(Cascader)
  Vue.use(Dropdown)
  Vue.use(DropdownMenu)
  Vue.use(DropdownItem)
}
