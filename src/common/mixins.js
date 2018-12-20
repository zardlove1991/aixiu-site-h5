export default {
  methods: {
    dealErrorType (params, err) {
      let examId = params.examId
      let redirectParams = params.redirectParams
      let _this = window.$vue
      // 如果开始考试出错就直接去答题卡页面
      if (err.status && err.status === 422) {
        _this.$router.replace({
          path: `/depencecard/${examId}`,
          query: {
            redirect: redirectParams.redirect,
            delta: redirectParams.delta
          }
        })
      }
    },
    dealLimitTimeTip (time) {
      let tip = time > 0 ? `${time}分钟` : '不限时'
      return tip
    }
  }
}
