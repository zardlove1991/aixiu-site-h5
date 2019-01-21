import wx from '@/config/weixin-js-sdk'

const METHODS = {
  detectionRestart (item) {
    let passScore = item.pass_score
    let answerScore = item.answer_score
    let restart = item.restart // 0:没有开启重新考试 1:开启重新考试
    // 只有在开启的时候才行
    return restart === 1 && (passScore && (answerScore < passScore))
  },
  getSubjetType (type) {
    let typeTip = null
    // 判断当前的题目类型
    if (type === 'input') typeTip = '填空题'
    else if (type === 'radio') typeTip = '单选题'
    else if (type === 'checkbox') typeTip = '多选题'
    else if (type === 'judge') typeTip = '判断题'
    else if (type === 'essay') typeTip = '问答题'
    return typeTip
  }
}

export const DEPENCE = {
  getSubjetType: METHODS.getSubjetType,
  dealErrorType (params, err) {
    let examId = params.examId
    let redirectParams = params.redirectParams
    let _this = window.$vue
    // 如果开始考试出错就直接去答题卡页面
    if (err.status && err.status === 422) {
      _this.$router.replace({
        path: `/depencecard/${examId}`,
        query: redirectParams
      })
    }
  },
  dealLimitTimeTip (time) {
    let tip = time > 0 ? `${time}分钟` : '不限时'
    return tip
  },
  goWxAppPage: url => wx.navigateTo(url),
  backWxAppPage: num => wx.navigateBack(num)
}
