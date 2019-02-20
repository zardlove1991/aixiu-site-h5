/*
 * 腾讯云上传
 * */
export const qcloudSettingDev = { // 开发环境配置
  appid: '1253562005', // TENCENT_APPID
  secretId: 'AKID42oQr5eaBew2wpQ9WgeQ4WmtthIh5zqU', // TENCENT_SECRET_ID
  bucket_name: 'exam', // TENCENT_BUCKET_NAME
  client_id: 'common', // ?
  biz_type: 'project', // TENCENT_BIZ_TYPE
  dir_name: 'examination', // TENCENT_DIR
  test_name: 'test', // ?
  district: 'sh',
  video: 'https://test-1253562005.cos.ap-shanghai.myqcloud.com',
  channel: 'exam_dev'
}

export const qcloudSetting = {
  appid: '1253562005',
  secretId: 'AKID42oQr5eaBew2wpQ9WgeQ4WmtthIh5zqU',
  bucket_name: 'exam',
  client_id: 'common',
  biz_type: 'content',
  dir_name: 'examination',
  test_name: 'test',
  district: 'sh',
  video: 'https://exam-1253562005.cos.ap-shanghai.myqcloud.com',
  channel: 'exam_pre'
}

export const qcloudSettingLine = {
  appid: '1253562005',
  secretId: 'AKID42oQr5eaBew2wpQ9WgeQ4WmtthIh5zqU',
  bucket_name: 'exam',
  client_id: 'common',
  biz_type: 'content',
  dir_name: 'examination',
  test_name: 'test',
  district: 'sh',
  video: 'https://exam-1253562005.cos.ap-shanghai.myqcloud.com',
  channel: 'exam_production'
}
