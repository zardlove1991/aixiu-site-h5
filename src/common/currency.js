import wx from 'weixin-js-sdk'

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
    return typeTip
  }
}

export const PARTY = {
  navBarTitle: '智慧党建',
  detectionRestart: METHODS.detectionRestart,
  getTypeTip: METHODS.getSubjetType
}

export const DEPENCE = {
  wxAnswerCardPath: '/client/callback/authorize/result/{exam_id}?token={token}',
  getSubjetType: METHODS.getSubjetType,
  goWxAnswerCardPage ({id, token}) {
    let url = this.wxAnswerCardPath.replace('{exam_id}', id).replace('{token}', token)
    wx.miniProgram.redirectTo({ url })
  }
}
