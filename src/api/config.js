const protocol = window.location.protocol

export default {
  'USER': protocol + '//member-test.aihoge.com/',
  'API': protocol + '//core-v3d.ddapp.com/api/',
  'API41': protocol + '//examinationapi-test.aihoge.com/api/',
  'PHPAPI': protocol + '//clientapi-v3d.ddapp.com/api/',
  'EXAMAPI': protocol + '//examinationapi-pre.aihoge.com/api/',
  'ONLINE_EXAM_API': protocol + '//examinationapi.aihoge.com/api/',
  'timeout': 36000,
  'HTTP-X-H5-VERSION': 1.0,
  'X-CLIENT-VERSION': 1314,
  'X-DEVICE-ID': '000',
  'host': 'https://h5party-pre.ddapp.com',
  'hostMap': {
    'API41': 'test_h5.ddapp.com',
    'ONLINE_EXAM_API': 'mexam.hogecloud.com',
    'EXAMAPI': 'pre_h5.ddapp.com'
  }
}
