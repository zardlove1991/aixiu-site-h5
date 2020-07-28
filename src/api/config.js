import { getEnvironment } from '@/utils/app'
const protocol = window.location.protocol
const env = getEnvironment()
const suffix = env === 'online' ? '' : `-${env}`
const v2 = env === 'online' ? '.v2' : ''

export default {
  'submit': `${protocol}//result${suffix}${v2}.aihoge.com/`,
  'user': `${protocol}//member${suffix}${v2}.aihoge.com/`,
  'exam': `${protocol}//examinationapi${suffix}.aihoge.com/`,
  'vote': `${protocol}//voteapi${suffix}${v2}.aihoge.com/`,
  'timeout': 36000,
  'HTTP-X-H5-VERSION': 1.0,
  'X-CLIENT-VERSION': 1314,
  'X-DEVICE-ID': '000'
}
