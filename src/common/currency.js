export const PARTY = {
  detectionRestart (item) {
    let passScore = item.pass_score
    let answerScore = item.answer_score
    let restart = item.restart // 0:没有开启重新考试 1:开启重新考试
    // 只有在开启的时候才行
    return restart === 1 && (passScore && (answerScore < passScore))
  }
}
