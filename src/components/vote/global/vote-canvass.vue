<template>
  <div class="canvass-dialog-wrap" v-if="show" @click.stop="close()">
    <img class="poster-img" :src="sharePoster" @click.stop />
    <div class="poster-tips">长按图片保存或转发朋友圈</div>
     <lottery-vote
      :show="isShowLottery"
      :lottery="lottery"
      :textSetting="{sign: '拉票'}"
      @close="isShowLottery = false"></lottery-vote>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import LotteryVote from '@/components/vote/global/vote-lottery'

export default {
  props: {
    flag: String,
    signUnit: {
      type: String,
      default: '票'
    }
  },
  components: { LotteryVote },
  data () {
    return {
      sharePoster: '',
      show: false,
      isShowLottery: false,
      lottery: {}
    }
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setModelThumbState(newState)
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
        // console.log('拉票数据：', res)
        let coverExt = '?x-oss-process=image/resize,m_fixed,w_560,h_350,color_EAD5BA'
        let avatar = STORAGE.get('userinfo').avatar
        let avatarUrl = avatar ? avatar + '?x-oss-process=image/circle,r_104/format,png' : ''
        let signUnit = this.signUnit
        let tips1 = ''
        let tips2 = ''
        let numbering = ''
        if (signUnit === '助力值') {
          tips1 = '第2名还差' + Math.abs(res.last_votes) + '次助力就要赶超'
          tips2 = '距离上一名还差' + Math.abs(res.last_votes) + '次助力'
          numbering = '快来为' + res.numbering + '号助力吧'
        } else if (signUnit === '致敬数') {
          tips1 = ''
          tips2 = ''
          numbering = '向' + res.numbering + '号英雄致敬'
        } else {
          tips1 = '第2名还差' + Math.abs(res.last_votes) + this.signUnit + '就要赶超'
          tips2 = '距离上一名还差' + Math.abs(res.last_votes) + this.signUnit
          numbering = '快来帮' + res.numbering + '号投票吧'
        }
        let voteTip = res.index === 1 ? tips1 : tips2
        if (detailInfo.works_count === 1) voteTip = '目前是第一名，坚持就是胜利'
        let qrcode = this.dealUrlConcat({
          sign: 'invotefriend',
          invotekey: code,
          worksId
        }, detailInfo)
        let limit = detailInfo.rule.limit
        // 海报其他参数
        let bgImage = ''
        let templateId = ''
        let sponsor = ''
        let sponsorLogo = ''
        if (limit.canvassing_poster) {
          let cavObj = limit.canvassing_poster
          bgImage = cavObj.background_img ? cavObj.background_img : ''
          templateId = cavObj.template_id ? cavObj.template_id : ''
          sponsor = cavObj.sponsor ? cavObj.sponsor : ''
          sponsorLogo = cavObj.sponsor_logo ? cavObj.sponsor_logo : ''
        }
        let params = {
          avatar: avatarUrl,
          numbering,
          title: res.name,
          source: res.source,
          qrcode,
          type: 'commonvotes',
          lastvotes: voteTip,
          background_img: bgImage,
          template_id: templateId,
          sponsor,
          sponsor_logo: sponsorLogo
        }
        if (res.material) {
          let isLongCover = false
          if (this.flag === 'picture' && res.material.image && res.material.image.length) {
            let img = res.material.image[0]
            params.cover = img.url + coverExt
            if (img.width && img.height) {
              isLongCover = img.height > img.width
            }
          } else if (this.flag === 'video' && res.material.video && res.material.video.length) {
            let cover = res.material.video[0].cover_image ? res.material.video[0].cover_image : res.material.video[0].cover
            params.cover = cover + coverExt
          } else if (this.flag === 'audio' && res.material.audio && res.material.audio.length) {
            params.audioTime = res.material.audio[0].duration
            params.cover = 'http://xzh5.hoge.cn/new-vote/images/poster_audio_bg.png' + coverExt
          } else if (this.flag === 'text') {
            params.content = res.introduce
            params.cover = 'http://xzh5.hoge.cn/new-vote/images/poster_text_bg.png' + coverExt
          }
          // 判断是否长图 如果是就修改为不截断参数
          if (isLongCover) params.cover = params.cover.replace('m_fixed', 'm_pad')
        }
        if (limit.is_open_classify && limit.is_open_classify === 1) {
          if (res.type_name) {
            params.source = res.type_name + ' | ' + params.source
          }
        }
        API.shareMake({
          data: params
        }).then(res => {
          if (!res || !res.image) {
            return
          }
          this.sharePoster = res.image
          this.show = true
        })
        // 拉票抽奖
        let lottery = res.lottery
        if (lottery && lottery.lottery_id && lottery.remain_lottery_counts) {
          this.isShowLottery = true
          this.lottery = lottery
          // this.$emit('close')
          // this.voteDisable = false
          // this.$emit('success')
          // this.$emit('updateCard')
        }
      })
    },
    dealUrlConcat (params, detailInfo) {
      let location = window.location
      let protocol = location.protocol
      let host = location.host
      let pathname = location.pathname
      if (pathname.indexOf('votebegin') !== -1) {
        pathname = pathname.substring(0, pathname.indexOf('votebegin'))
        let { mark, id } = detailInfo
        if (mark.indexOf('video') !== -1) {
          mark = 'video'
        } else if (mark.indexOf('image') !== -1) {
          mark = 'picture'
        } else if (mark.indexOf('audio') !== -1) {
          mark = 'audio'
        } else {
          mark = 'text'
        }
        pathname = pathname + 'votedetail/' + mark + '/' + id
      }
      let url = '?'
      for (let key in params) { // 拼接字符串
        url += key + '=' + params[key] + '&'
      }
      return protocol + '//' + host + pathname + url.substring(0, url.length - 1)
    },
    close () {
      this.show = false
    },
    ...mapMutations('depence', {
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    })
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
      width: 88%;
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
