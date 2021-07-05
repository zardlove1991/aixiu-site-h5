import { createAPI, creataUser, createSumbit, createExam, createVote, createBase, createC4 } from '@/api'
import { getApiFlag } from '@/utils/app'

const API_FLAG = getApiFlag()
// 腾讯云相关接口
let QCloundUrl = {
  getTencentToken: 'client/upload/image/signature', // 上传腾讯云签名
  getTencentVideoToken: 'client/upload/video/signature', // 上传腾讯云签名(视频类型)
  getQcloudVideoInfo: 'client/material/video/info', // 获取腾讯云视频信息
  getMaterialInfo: 'client/material/save' // 获取素材信息
}

// 公共的url
let baseUrl = {
  sumbitUV: 'setSubmit', // 提交次数
  getDingdingUser: 'ding/signature', // 钉钉会员
  getSmartCityUser: 'member/signature', // 智慧城市登录
  getXiuzanUser: 'h5/signature', // 微信登录换取秀赞用户信息
  getWeixinInfo: 'signature', // 获得微信公众号信息
  getCaptchaCode: 'captcha/code', // 图片二维码
  getMobileSend: '/mobile/verify/send', // 获取手机code
  setClick: 'setClick', // click
  setShare: 'setShare' // 分享活动时请求分享接口
}

let examUrl = {
  getExamlist: 'client/examination', // 考试列表
  getRecord: 'client/examination/{id}/card', // 考试列表
  getExamDetailsList: 'client/examination/{id}/question',
  getExamDetailsStatistics: 'client/examination/statistics/{id}',
  getErrorList: 'client/examination/mistakes', // 获得错题列表
  getLatestErrorList: 'client/examination/questions/error', // 获得最近一次的答题的错误列表
  getErrorCollection: 'client/examination/mistakes/examination', // 获得错题列表集合
  submitExam: 'client/examination/end/submit/{id}',
  startExam: 'client/examination/{id}/start',
  saveSubjectRecord: 'client/examination/{id}/record', // 保存答题记录
  saveSubjectRecords: 'client/examination/{id}/record/batch', // 批量保存答题记录
  getExamDetail: 'client/examination/{id}',
  shareExamination: 'client/share/image/make/examination', // 分享测评结果海报
  saveDrawRecord: 'collection/form/record/{id}', // 投票信息采集
  getSubjectFavorInfo: 'client/examination/collection/is', // 获得题目的收藏信息
  setSubjectFavorInfo: 'client/examination/collection', // 设置题目的收藏
  unlockCourse: 'client/examination/submitted', // 解锁课程
  checkPassword: 'client/examination/{id}/check', // 检验密码是否正确
  getExamAuthScope: 'open/examination/detail', // 测评授权接口
  getInfoDept: 'client/examination/import/verify', // 获取信息收集用户的部门
  setLiveVideoTime: 'client/examination/live/statistics', // 直播答题观看时间
  shareAddTimes: 'client/examination/live/share/{id}', // 分享增加答题次数
  getExamRankList: 'client/examination/{id}/source', // 考试排行列表
  saveIntoCloud: 'client/examination/submit/{id}',
  getPosterInfo: 'client/examination/{id}/poster', // 前端生成海报所需数据
  getPartyInfo: 'client/examination/{id}/party'
}

// 投票相关接口
let voteUrl = {
  getVoteAuthScope: 'client/voting/base/{id}', // 投票授权接口
  getVoteMember: 'client/voting/works/member', // 获取投票人员列表
  getVideoUrl: 'video/detail', // 获取视频地址
  getUploadSign: 'ali/signature', // 获取文件上传签名
  getUploadVideoCrdl: 'video/upload/credential', // 获取视频上传凭证
  getVodeDetail: 'client/voting/{id}', // 投票详情
  getVoteWorks: 'client/voting/{id}/works', // 投票数据列表
  getVoteWorksDetail: 'client/voting/{id}/works/{worksId}', // 投票数据详情
  getUserVoteRemains: 'client/voting/{id}/remains', // 获取会员剩余票数
  getMineVoteList: 'client/voting/mine', // 我的投票列表
  checkUserReport: 'client/report/{id}', // 检查用户是否报名
  getIsCollect: 'client/report/collect/{id}', // 是否手机用户信息
  workReport: 'client/report/work', // 用户创建/编辑报名
  getReportDetail: 'client/report/work/{id}', // 获取报名内容详情
  workVote: 'client/voting/{id}', // 给他投票
  saveSharer: 'client/voting/save_sharer', // 点击拉票将分享者信息，投票id和作品id入库
  shareMake: 'share/make', // 生成海报
  getSharer: 'client/voting/get_sharer', // 用户扫描二维码后获得分享者信息
  getCaptchaCode: 'captcha/code', // 图片二维码
  getMobileSend: 'mobile/verify/send', // 获取手机code
  getVoteType: 'client/voting/{id}/type', // 获取分类列表
  getVoteTypeFid: 'client/voting/{id}/type/{worksId}', // 根据分类的id获取fid
  shareLottery: 'instant_lottery/activity/{id}/share/', // 投票增加抽奖机会
  getUserLotteryList: 'instant_lottery/activity/{id}/result/' // 获取用户抽奖记录
}

// 预约报名
let enrollUrl = {
  getEnrollDetail: 'client/order/{id}', // 预约活动详情
  getMineEnrollList: 'client/order/mine', // 获取我的预约
  saveEnrollInfo: 'client/order', // 预约报名
  remainEnroll: 'client/order/{id}/remain', // 剩余预约次数
  getMyEnrollCount: 'client/order/{id}/count' // 我的预约次数
}

// 资讯新闻
let newsUrl = {
  getNewsDetail: 'client/news/{id}/', // 获取资讯新闻详情
  getCityWeather: 'client/news/weather/{id}/' // 获取城市天气
}

let drawUrl = {
  getMyDrawList: 'xiuzan/account/mine/'
}

// 不带GUID
let configUrl = {
  ...QCloundUrl,
  ...baseUrl,
  ...examUrl,
  ...voteUrl,
  ...enrollUrl,
  ...newsUrl,
  ...drawUrl,
  setShare: 'setShare', // 分享活动时请求分享接口
  collectInfo: 'client/report/collect/{id}' // 收集信息
}

export default {
  getVoteMember: config => createVote(configUrl.getVoteMember, 'get', config, API_FLAG),
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
  getExamDetail: config => createAPI(configUrl.getExamDetail, 'get', config, API_FLAG),
  shareExamination: config => createAPI(configUrl.shareExamination, 'post', config, API_FLAG),
  saveDrawRecord: config => createBase(configUrl.saveDrawRecord, 'POST', config, 'public'),
  startExam: config => createAPI(configUrl.startExam, 'get', config, API_FLAG),
  unlockCourse: config => createAPI(configUrl.unlockCourse, 'get', config, API_FLAG),
  checkPassword: config => createAPI(configUrl.checkPassword, 'post', config, API_FLAG),
  getExamAuthScope: config => createExam(configUrl.getExamAuthScope, 'get', config, API_FLAG),
  setShare: config => createSumbit(configUrl.setShare, 'POST', config, API_FLAG),
  getInfoDept: config => createAPI(configUrl.getInfoDept, 'GET', config, API_FLAG),
  setLiveVideoTime: config => createAPI(configUrl.setLiveVideoTime, 'POST', config, API_FLAG),
  shareAddTimes: config => createAPI(configUrl.shareAddTimes, 'GET', config, API_FLAG),
  getExamRankList: config => createAPI(configUrl.getExamRankList, 'GET', config, API_FLAG),
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
  getIsCollect: config => createVote(configUrl.getIsCollect, 'GET', config, API_FLAG),
  workReport: config => createVote(configUrl.workReport, 'POST', config, API_FLAG),
  getReportDetail: config => createVote(configUrl.getReportDetail, 'GET', config, API_FLAG),
  workVote: config => createVote(configUrl.workVote, 'POST', config, API_FLAG),
  saveSharer: config => createVote(configUrl.saveSharer, 'GET', config, API_FLAG),
  shareMake: config => createVote(configUrl.shareMake, 'POST', config, API_FLAG),
  getSharer: config => createVote(configUrl.getSharer, 'GET', config, API_FLAG),
  collectInfo: config => createVote(configUrl.collectInfo, 'POST', config, API_FLAG),
  getVoteAuthScope: config => createVote(configUrl.getVoteAuthScope, 'GET', config, API_FLAG),
  getCaptchaCode: config => createBase(configUrl.getCaptchaCode, 'GET', config, 'reserve'),
  getMobileSend: config => createBase(configUrl.getMobileSend, 'GET', config, 'reserve'),
  getVoteType: config => createVote(configUrl.getVoteType, 'GET', config, API_FLAG),
  getVoteTypeFid: config => createVote(configUrl.getVoteTypeFid, 'GET', config, API_FLAG),
  shareLottery: config => createC4(configUrl.shareLottery, 'POST', config, API_FLAG),
  getUserLotteryList: config => createC4(configUrl.getUserLotteryList, 'GET', config, API_FLAG),
  // 预约报名
  getEnrollDetail: config => createVote(configUrl.getEnrollDetail, 'GET', config, API_FLAG),
  getMineEnrollList: config => createVote(configUrl.getMineEnrollList, 'GET', config, API_FLAG),
  saveEnrollInfo: config => createVote(configUrl.saveEnrollInfo, 'POST', config, API_FLAG),
  remainEnroll: config => createVote(configUrl.remainEnroll, 'GET', config, API_FLAG),
  getMyEnrollCount: config => createVote(configUrl.getMyEnrollCount, 'GET', config, API_FLAG),
  // 新闻
  getNewsDetail: config => createBase(configUrl.getNewsDetail, 'GET', config, 'news'),
  getCityWeather: config => createBase(configUrl.getCityWeather, 'GET', config, 'news'),
  // 抽奖
  getMyDrawList: config => createC4(configUrl.getMyDrawList, 'GET', config, API_FLAG),

  // 答题改造
  submitExam: config => createAPI(configUrl.submitExam, 'post', config, API_FLAG),
  saveIntoCloud: config => createAPI(configUrl.saveIntoCloud, 'post', config, API_FLAG),
  getPosterInfo: config => createAPI(configUrl.getPosterInfo, 'get', config, API_FLAG),
  getPartyInfo: config => createAPI(configUrl.getPartyInfo, 'post', config, API_FLAG)
}
