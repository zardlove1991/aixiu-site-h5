import { createAPI, creataUser, createSumbit, createExam, createVote, createBase } from '@/api'
import { getApiFlag } from '@/utils/app'

const API_FLAG = getApiFlag()
// 腾讯云相关接口
let QCloundUrl = {
  getTencentToken: 'client/upload/image/signature', // 上传腾讯云签名
  getTencentVideoToken: 'client/upload/video/signature', // 上传腾讯云签名(视频类型)
  getQcloudVideoInfo: 'client/material/video/info', // 获取腾讯云视频信息
  getMaterialInfo: 'client/material/save' // 获取素材信息
}

// 投票相关接口
let voteUrl = {
  getVideoUrl: 'video/detail', // 获取视频地址
  getUploadSign: 'ali/signature', // 获取文件上传签名
  getUploadVideoCrdl: 'video/upload/credential', // 获取视频上传凭证
  getVodeDetail: 'client/voting/{id}', // 投票详情
  getVoteWorks: 'client/voting/{id}/works', // 投票数据列表
  getVoteWorksDetail: 'client/voting/{id}/works/{worksId}', // 投票数据详情
  getUserVoteRemains: 'client/voting/{id}/remains', // 获取会员剩余票数
  getMineVoteList: 'client/voting/mine', // 我的投票列表
  checkUserReport: 'client/report/{id}', // 检查用户是否报名
  workReport: 'client/report/work', // 用户创建/编辑报名
  getReportDetail: 'client/report/work/{id}', // 获取报名内容详情
  workVote: 'client/voting', // 给他投票
  saveSharer: 'client/voting/save_sharer', // 点击拉票将分享者信息，投票id和作品id入库
  shareMake: 'share/make', // 生成海报
  getSharer: 'client/voting/get_sharer' // 用户扫描二维码后获得分享者信息
}

// 不带GUID
let configUrl = {
  ...QCloundUrl,
  ...voteUrl,
  sumbitUV: 'setSubmit', // 提交次数
  setClick: 'setClick', // click
  getDingdingUser: 'ding/signature', // 钉钉会员
  getSmartCityUser: 'member/signature', // 智慧城市登录
  getXiuzanUser: 'h5/signature', // 微信登录换取秀赞用户信息
  getWeixinInfo: 'signature', // 获得微信公众号信息
  getExamlist: 'client/examination', // 考试列表
  getRecord: 'client/examination/{id}/card', // 考试列表
  getExamDetailsList: 'client/examination/questions',
  getExamDetailsStatistics: 'client/examination/statistics',
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
  unlockCourse: 'client/examination/submitted', // 解锁课程
  checkPassword: 'client/examination/{id}/check', // 检验密码是否正确
  getAuthScope: 'open/examination/detail', // 检验密码是否正确
  setShare: 'setShare' // 分享活动时请求分享接口
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
  getWeixinInfo: config => creataUser(configUrl.getWeixinInfo, 'GET', config, API_FLAG),
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
  getExamDetailsStatistics: config => createAPI(configUrl.getExamDetailsStatistics, 'get', config, API_FLAG),
  submitExam: config => createAPI(configUrl.submitExam, 'get', config, API_FLAG),
  getExamDetail: config => createAPI(configUrl.getExamDetail, 'get', config, API_FLAG),
  startExam: config => createAPI(configUrl.startExam, 'get', config, API_FLAG),
  unlockCourse: config => createAPI(configUrl.unlockCourse, 'get', config, API_FLAG),
  checkPassword: config => createAPI(configUrl.checkPassword, 'get', config, API_FLAG),
  getAuthScope: config => createExam(configUrl.getAuthScope, 'get', config, API_FLAG),
  setShare: config => createSumbit(configUrl.setShare, 'POST', config, API_FLAG),
  // 投票
  getVideoUrl: config => createBase(configUrl.getVideoUrl, 'GET', config, 'mlink'),
  getUploadSign: config => createSumbit(configUrl.getUploadSign, 'GET', config, API_FLAG),
  getUploadVideoCrdl: config => createSumbit(configUrl.getUploadVideoCrdl, 'GET', config, API_FLAG),
  getVodeDetail: config => createVote(configUrl.getVodeDetail, 'GET', config, API_FLAG),
  getVoteWorks: config => createVote(configUrl.getVoteWorks, 'GET', config, API_FLAG),
  getVoteWorksDetail: config => createVote(configUrl.getVoteWorksDetail, 'GET', config, API_FLAG),
  getUserVoteRemains: config => createVote(configUrl.getUserVoteRemains, 'GET', config, API_FLAG),
  getMineVoteList: config => createVote(configUrl.getMineVoteList, 'GET', config, API_FLAG),
  checkUserReport: config => createVote(configUrl.checkUserReport, 'GET', config, API_FLAG),
  workReport: config => createVote(configUrl.workReport, 'POST', config, API_FLAG),
  getReportDetail: config => createVote(configUrl.getReportDetail, 'GET', config, API_FLAG),
  workVote: config => createVote(configUrl.workVote, 'POST', config, API_FLAG),
  saveSharer: config => createVote(configUrl.saveSharer, 'GET', config, API_FLAG),
  shareMake: config => createVote(configUrl.shareMake, 'POST', config, API_FLAG),
  getSharer: config => createVote(configUrl.getSharer, 'POST', config, API_FLAG)
}
