<template>
  <div></div>
</template>

<script>
import mixins from '@/mixins/index'
import API from '@/api/module/examination'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.sharePage()
      this.$router.replace({
        name: 'newslist',
        params: {
          id: this.id
        }
      })
    },
    async sharePage () {
      let res = await API.getNewsDetail({
        query: { id: this.id }
      })
      let newsInfo = res
      let { id, title, mark, index_pic: indexpic, share_settings: share } = newsInfo
      let imgUrl = ''
      let shareLink = ''
      let shareBrief = ''
      let shareTitle = title
      if (share) {
        let sharePic = share.indexpic
        if (share.title) {
          shareTitle = share.title
        }
        if (share.brief) {
          shareBrief = share.brief
        }
        if (share.link) {
          shareLink = share.link
        }
        if (sharePic) {
          if (sharePic.constructor === Array && sharePic.length > 0) {
            let obj = sharePic[0]
            if (obj.constructor === Object) {
              imgUrl = 'http:' + obj.host + obj.filename
            } else if (obj.constructor === String) {
              imgUrl = obj
            }
          } else if (sharePic.constructor === Object && sharePic.host && sharePic.filename) {
            imgUrl = 'http:' + sharePic.host + sharePic.filename
          } else if (sharePic.constructor === String) {
            imgUrl = sharePic
          }
        } else if (indexpic && indexpic.cover_img) {
          imgUrl = indexpic.cover_img
        }
      }
      if (!shareLink) {
        let local = window.location
        let pathname = local.pathname
        let index = pathname.indexOf('newslist')
        if (index !== -1) {
          pathname = pathname.replace(/newslist/, 'newstart')
        }
        shareLink = 'http://xzh5.hoge.cn/bridge/index.html?backUrl=' + local.origin + pathname
        // shareLink = delUrlParams(['code'])
      } else {
        shareLink = 'http://xzh5.hoge.cn/bridge/index.html?backUrl=' + shareLink
      }
      this.initPageShareInfo({
        id,
        title: shareTitle,
        desc: shareBrief,
        indexpic: imgUrl,
        link: shareLink,
        mark: mark
      })
    }
  }
}
</script>

<style lang="scss">
</style>
