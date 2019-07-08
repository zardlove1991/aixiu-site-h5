import wx from '@/config/weixin-js-sdk'

export const METHODS = {
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
    else if (type === 'mandarin') typeTip = '普通话'
    else if (type === 'englishspoken') typeTip = '英语口语能力'
    else if (type === 'sort') typeTip = '排序题'
    return typeTip
  }
}

export const DEPENCE = {
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
  checkCurEssayEmpty (essayAnswerInfo, subjectId) {
    let curEssayObj = essayAnswerInfo[subjectId]
    let flag = true
    if (!curEssayObj) return flag
    // 排查当前对象里是否有数据填写
    for (let key in curEssayObj) {
      if (curEssayObj[key] && curEssayObj[key].length) {
        flag = false
        break
      }
    }
    return flag
  },
  checkRoralEmpty (oralAnswerInfo, subjectId) {
    let curOralObj = oralAnswerInfo[subjectId]
    let flag = true
    if (curOralObj && curOralObj.value) flag = false
    return flag
  },
  checkSortSubject (subject) {
    let mode = subject.extra.score_rules // 匹配的规则
    let flag = 'none'
    let allMatchLen = subject.options.filter(item => item.is_true).length // 匹配所有是否为true
    let optionLen = subject.options.length
    if (mode === 'exact' && allMatchLen === optionLen) {
      flag = 'success'
    } else if (mode === 'contain' && allMatchLen) {
      flag = 'warning'
      // 全匹配为正确
      if (allMatchLen === optionLen) flag = 'success'
    }
    return flag
  },
  checkMedaiObjIsEmpty (mediaObj) {
    let flag = true
    for (let key in mediaObj) {
      if (mediaObj[key] && mediaObj[key].length) {
        flag = false
        break
      }
    }
    return flag
  },
  goWxAppPage: url => wx.navigateTo(url),
  backWxAppPage: num => wx.navigateBack(num)
}
