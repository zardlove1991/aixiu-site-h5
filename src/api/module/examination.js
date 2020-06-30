import { createAPI, creataUser, createSumbit } from '@/api'
import { getApiFlag } from '@/utils/app'

const API_FLAG = getApiFlag()
// 腾讯云相关接口
let QCloundUrl = {
  getTencentToken: 'client/upload/image/signature', // 上传腾讯云签名
  getTencentVideoToken: 'client/upload/video/signature', // 上传腾讯云签名(视频类型)
  getQcloudVideoInfo: 'client/material/video/info', // 获取腾讯云视频信息
  getMaterialInfo: 'client/material/save' // 获取素材信息
}
// 不带GUID
let configUrl = {
  ...QCloundUrl,
  sumbitUV: 'setSubmit', // 提交次数
  setClick: 'setClick', // click
  getDingdingUser: 'ding/signature', // 钉钉会员
  getSmartCityUser: 'member/signature', // 智慧城市登录
  getXiuzanUser: 'h5/signature', // 微信登录换取秀赞用户信息
  getWeixinInfo: 'client/wechat/js/sign', // 获得微信公众号信息
  getExamlist: 'client/examination', // 考试列表
  getRecord: 'client/examination/{id}/card', // 考试列表
  getExamDetailsList: 'client/examination/questions',
  getErrorList: 'client/examination/mistakes', // 获得错题列表
  getLatestErrorList: 'client/examination/questions/error', // 获得最近一次的答题的错误列表
  getErrorCollection: 'client/examination/mistakes/examination', // 获得错题列表集合
  submitExam: 'client/examination/{id}/end',
  startExam: 'client/examination/{id}/start',
  saveSubjectRecord: 'client/examination/{id}/record', // 保存答题记录
  saveSubjectRecords: 'client/examination/{id}/record/batch', // 批量保存答题记录
  getExamDetail: 'client/examination/{id}',
  getSubjectFavorInfo: 'client/examination/collection/is', // 获得题目的收藏信息
  setSubjectFavorInfo: 'client/examination/collection', // 设置题目的收藏
  unlockCourse: 'client/examination/submitted' // 解锁课程
}

export default {
  setClick: config => createSumbit(configUrl.setClick, 'GET', config, API_FLAG),
  sumbitUV: config => createSumbit(configUrl.sumbitUV, 'POST', config, API_FLAG),
  getSmartCityUser: config => creataUser(configUrl.getSmartCityUser, 'POST', config, API_FLAG),
  getXiuzanUser: config => creataUser(configUrl.getXiuzanUser, 'GET', config, API_FLAG),
  getTencentToken: config => createAPI(configUrl.getTencentToken, 'GET', config, API_FLAG),
  getTencentVideoToken: config => createAPI(configUrl.getTencentVideoToken, 'GET', config, API_FLAG),
  getQcloudVideoInfo: config => createAPI(configUrl.getQcloudVideoInfo, 'GET', config, API_FLAG),
  getMaterialInfo: config => createAPI(configUrl.getMaterialInfo, 'POST', config, API_FLAG),
  getWeixinInfo: config => createAPI(configUrl.getWeixinInfo, 'POST', config, API_FLAG),
  setSubjectFavorInfo: config => createAPI(configUrl.setSubjectFavorInfo, 'post', config, API_FLAG),
  getSubjectFavorInfo: config => createAPI(configUrl.getSubjectFavorInfo, 'get', config, API_FLAG),
  saveSubjectRecord: config => createAPI(configUrl.saveSubjectRecord, 'post', config, API_FLAG),
  saveSubjectRecords: config => createAPI(configUrl.saveSubjectRecords, 'post', config, API_FLAG),
  getExamlist: config => createAPI(configUrl.getExamlist, 'get', config, API_FLAG),
  getRecord: config => createAPI(configUrl.getRecord, 'get', config, API_FLAG),
  getErrorCollection: config => createAPI(configUrl.getErrorCollection, 'get', config, API_FLAG),
  getErrorList: config => createAPI(configUrl.getErrorList, 'get', config, API_FLAG),
  getLatestErrorList: config => createAPI(configUrl.getLatestErrorList, 'get', config, API_FLAG),
  getExamDetailsList: config => createAPI(configUrl.getExamDetailsList, 'get', config, API_FLAG),
  submitExam: config => createAPI(configUrl.submitExam, 'get', config, API_FLAG),
  getExamDetail: config => createAPI(configUrl.getExamDetail, 'get', config, API_FLAG),
  startExam: config => createAPI(configUrl.startExam, 'get', config, API_FLAG),
  unlockCourse: config => createAPI(configUrl.unlockCourse, 'get', config, API_FLAG)
}
