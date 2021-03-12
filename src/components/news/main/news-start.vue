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
              if (/http/.test(obj.host)) {
                imgUrl = obj.host + obj.filename
              } else {
                imgUrl = location.protocol + obj.host + obj.filename
              }
            } else if (obj.constructor === String) {
              imgUrl = obj
            }
          } else if (sharePic.constructor === Object && sharePic.host && sharePic.filename) {
            if (/http/.test(sharePic.host)) {
              imgUrl = sharePic.host + sharePic.filename
            } else {
              imgUrl = location.protocol + sharePic.host + sharePic.filename
            }
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
        if (/\?/.test(pathname)) {
          pathname += '&userShareCode=' + new Date().getTime()
        } else {
          pathname += '?userShareCode=' + new Date().getTime()
        }
        shareLink = this.getShareUrl(local.origin, pathname)
      } else {
        if (/\?/.test(shareLink)) {
          shareLink += '&userShareCode=' + new Date().getTime()
        } else {
          shareLink += '?userShareCode=' + new Date().getTime()
        }
        shareLink = this.getShareUrl(shareLink)
      }
      if (imgUrl && !/^http/.test(imgUrl)) {
        imgUrl = location.protocol + imgUrl
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
