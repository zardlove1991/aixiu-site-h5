import { createAPI } from '@/api'

const API_FLAG = 'EXAMAPI'

let configUrl = {
  getExamlist: 'client/{guid}/examination', // 考试列表
  getRecord: 'client/{guid}/examination/{id}/card', // 考试列表
  getExamDetailsList: 'client/{guid}/examination/questions',
  getErrorList: 'client/{guid}/examination/mistakes', // 获得错题列表
  getErrorCollection: 'client/{guid}/examination/mistakes/examination', // 获得错题列表集合
  submitExam: 'client/{guid}/examination/{id}/end',
  startExam: 'client/{guid}/examination/{id}/start',
  saveSubjectRecord: 'client/{guid}/examination/{id}/record', // 保存答题记录
  saveSubjectRecords: 'client/examination/{id}/record/batch', // 批量保存答题记录
  getExamDetail: 'client/{guid}/examination/{id}',
  getSubjectFavorInfo: 'client/{guid}/examination/collection/is', // 获得题目的收藏信息
  setSubjectFavorInfo: 'client/{guid}/examination/collection' // 设置题目的收藏
}

export default {
  setSubjectFavorInfo: config => createAPI(configUrl.setSubjectFavorInfo, 'post', config, API_FLAG),
  getSubjectFavorInfo: config => createAPI(configUrl.getSubjectFavorInfo, 'get', config, API_FLAG),
  saveSubjectRecord: config => createAPI(configUrl.saveSubjectRecord, 'post', config, API_FLAG),
  saveSubjectRecords: config => createAPI(configUrl.saveSubjectRecords, 'post', config, API_FLAG),
  getExamlist: config => createAPI(configUrl.getExamlist, 'get', config, API_FLAG),
  getRecord: config => createAPI(configUrl.getRecord, 'get', config, API_FLAG),
  getErrorCollection: config => createAPI(configUrl.getErrorCollection, 'get', config, API_FLAG),
  getErrorList: config => createAPI(configUrl.getErrorList, 'get', config, API_FLAG),
  getExamDetailsList: config => createAPI(configUrl.getExamDetailsList, 'get', config, API_FLAG),
  submitExam: config => createAPI(configUrl.submitExam, 'get', config, API_FLAG),
  getExamDetail: config => createAPI(configUrl.getExamDetail, 'get', config, API_FLAG),
  startExam: config => createAPI(configUrl.startExam, 'get', config, API_FLAG)
}
