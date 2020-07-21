import { getEnvironment } from '@/utils/app'
const protocol = window.location.protocol
const env = getEnvironment()
const suffix = env === 'online' ? '' : `-${env}`

export default {
  'submit': `${protocol}//result${suffix}.aihoge.com/`,
  'user': `${protocol}//member${suffix}.aihoge.com/`,
  'exam': `${protocol}//examinationapi${suffix}.aihoge.com/`,
  'timeout': 36000,
  'HTTP-X-H5-VERSION': 1.0,
  'X-CLIENT-VERSION': 1314,
  'X-DEVICE-ID': '000'
}
