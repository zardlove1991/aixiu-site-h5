<template>
  <div class="canvass-dialog-wrap" v-if="show" @click.stop="close()">
    <img class="poster-img" :src="sharePoster" @click.stop />
    <div class="poster-tips">长按图片保存获转发朋友圈</div>
  </div>
</template>

<script>
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'

export default {
  props: {
    flag: String
  },
  data () {
    return {
      sharePoster: '',
      show: false
    }
  },
  methods: {
    saveSharer (worksId) {
      let detailInfo = STORAGE.get('detailInfo')
      if (!detailInfo || !worksId) {
        return
      }
      let voteId = detailInfo.id
      let params = {
        voting_id: voteId,
        work_id: worksId
      }
      API.saveSharer({
        params
      }).then(code => {
        if (!code) {
          return
        }
        this.shareMake(worksId, code)
      })
    },
    shareMake (worksId, code) {
      let detailInfo = STORAGE.get('detailInfo')
      if (!detailInfo) {
        return
      }
      API.getVoteWorksDetail({
        query: {
          id: detailInfo.id,
          worksId
        }
      }).then(res => {
        if (!res) {
          return
        }
        let coverExt = '?x-oss-process=image/resize,m_fixed,w_560,h_350,color_EAD5BA'
        let avatar = STORAGE.get('userinfo').avatar
        let avatarUrl = avatar ? avatar + '?x-oss-process=image/circle,r_104/format,png' : ''
        let voteTip = res.index === 1 ? '第2名还差' + Math.abs(res.last_votes) + '票就要赶超' : '距离上一名还差' + Math.abs(res.last_votes) + '票'
        if (detailInfo.works_count === 1) voteTip = '目前是第一名，坚持就是胜利'
        let qrcode = this.dealUrlConcat({ sign: 'invotefriend', invotekey: code })
        let params = {
          avatar: avatarUrl,
          numbering: res.numbering,
          title: res.name,
          source: res.source,
          qrcode,
          type: 'commonvotes',
          content: res.introduce,
          lastvotes: voteTip
        }
        if (res.material) {
          if (this.flag === 'picture' && res.material.image && res.material.image.length) {
            params.cover = res.material.image[0].url + coverExt
          } else if (this.flag === 'video' && res.material.video && res.material.video.length) {
            params.cover = res.material.video[0].cover + coverExt
          } else if (this.flag === 'audio' && res.material.audio && res.material.audio.length) {
            params.audioTime = res.material.audio[0].duration
            params.cover = 'http://xzh5.hoge.cn/new-vote/images/poster_audio_bg.png' + coverExt
          } else if (this.flag === 'text') {
            params.cover = 'http://xzh5.hoge.cn/new-vote/images/poster_text_bg.png' + coverExt
          }
        }
        API.shareMake({
          data: params
        }).then(res => {
          if (!res || !res.image) {
            return
          }
          console.log('shareMake', res.image)
          this.sharePoster = res.image
          this.show = true
        })
      })
    },
    dealUrlConcat (params) {
      let location = window.location
      let url = '?'
      for (let key in params) { // 拼接字符串
        url += key + '=' + params[key] + '&'
      }
      return location.protocol + '//' + location.host + location.pathname + url.substring(0, url.length - 1)
    },
    close () {
      this.show = false
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .canvass-dialog-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    pointer-events: auto;
    z-index: 99;
    .poster-img {
      width: px2rem(616px);
      height: auto;
    }
    .poster-tips {
      margin-top: px2rem(10px);
      width: 100%;
      text-align: center;
      @include font-dpr(12px);
      color: #FFFFFF;
    }
  }
</style>
