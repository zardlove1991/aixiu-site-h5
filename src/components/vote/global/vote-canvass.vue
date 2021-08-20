<template>
  <div class="canvass-dialog-wrap" v-if="show" @click.stop="close()">
    <div class="no-poster"  v-if="!sharePoster">
      <div class="no-poster-bg" @click.stop></div>
      <div class="poster-tips">海报正在生成中...</div>
    </div>
    <img class="poster-img" v-if="sharePoster" :src="sharePoster" @click.stop crossOrigin='anonymous' />
    <div class="poster-tips" v-if="sharePoster">长按图片保存或转发朋友圈</div>
    <lottery-vote
      :show="isShowLottery"
      :lottery="lottery"
      :textSetting="{sign: '拉票'}"
      @close="isShowLottery = false"></lottery-vote>
    <div v-show='false' id='qrcode'></div>
    <!-- <img :src="posterInfo.image" ref="posterBg" alt="" @load="resetPoster(1)" v-show="false"> -->
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import LotteryVote from '@/components/vote/global/vote-lottery'
import QRCode from 'qrcode'
import { Toast } from 'mint-ui'

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
      imgs: {
        bgImg: require('@/assets/vote/vote-bg.png')
      },
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
      this.show = true
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
          // type: 'commonvotes',
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
            params.cover = '//xzh5.hoge.cn/new-vote/images/poster_audio_bg.png' + coverExt
          } else if (this.flag === 'text') {
            params.content = res.introduce
            params.cover = '//xzh5.hoge.cn/new-vote/images/poster_text_bg.png' + coverExt
          }
          // 判断是否长图 如果是就修改为不截断参数
          if (isLongCover) params.cover = params.cover.replace('m_fixed', 'm_pad')
        }
        if (limit.is_open_classify && limit.is_open_classify === 1) {
          if (res.type_name) {
            params.source = res.type_name + ' | ' + params.source
          }
        }

        this.renderPlaybill(params, voteTip)

        // API.shareMake({
        //   data: params
        // }).then(res => {
        //   if (!res || !res.image) {
        //     return
        //   }
        //   this.sharePoster = res.image
        // })

        // 拉票抽奖
        // let lottery = res.lottery
        // if (lottery && lottery.lottery_id && lottery.remain_lottery_counts) {
        // this.isShowLottery = true
        // this.lottery = lottery
        // this.$emit('close')
        // this.voteDisable = false
        // this.$emit('success')
        // this.$emit('updateCard')
        // }
      })
    },
    loadImg (data) {
      return new Promise((resolve, reject) => {
        const _img = new Image()
        // _img.crossOrigin = 'anonymous'
        _img.src = data
        _img.onload = () => {
          resolve(_img)
        }
        _img.onerror = () => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({status: 'error', title: '解析图片失败'})
          Toast('解析图片失败')
        }
      })
    },
    async renderPlaybill (data) {
      try {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        // 绘制背景图
        canvas.width = 640
        canvas.height = 897

        let bgImg = await this.loadImg(this.imgs.bgImg)
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)

        ctx.font = '26px Arial'
        ctx.fillStyle = '#333333'
        ctx.textAlign = 'center'
        ctx.fillText(data.lastvotes, 300, 80)

        ctx.font = '26px Arial'
        ctx.fillStyle = '#333333'
        ctx.textAlign = 'center'
        ctx.fillText(data.numbering, 300, 120)
       // ctx.save()
        // 绘制作品图片
        let imgObj = await this.loadImg(data.cover)
        ctx.drawImage(imgObj, 50, 150, canvas.width - 100, canvas.height - 550)
        // ctx.restore()
        // ctx.save()

        ctx.font = '24px Arial'
        ctx.fillStyle = '#666666'
        ctx.fillText(data.source, 130, 540)

        ctx.font = 'bold 30px Arial'
        ctx.fillStyle = '#333333'
        ctx.fillText(data.title, 135, 590)

        ctx.font = '24px Arial'
        ctx.fillStyle = '#333333'
        ctx.fillText('来自', 70, 640)
        // ctx.save()

        const userInfo = STORAGE.get('userinfo')
        console.log('userInfo', userInfo)
        let offwidthNum = '270'
        if (data.avatar === '') {
          offwidthNum = '215'
        } else {
          // 用户头像
          let iconUrl = data.avatar
          let userIcon = await this.loadImg(iconUrl)
          ctx.arc(120, 635, 20, 0, 2 * Math.PI)
          ctx.clip()
          ctx.drawImage(userIcon, 100, 615, 40, 40)
          ctx.restore()
        }

        ctx.font = '24px Arial'
        ctx.fillStyle = '#333333'
        ctx.fillText(`${userInfo.nick_name}的邀请`, offwidthNum, 640)
        const generateQR = async text => {
          try {
            let qrcodeURL = await QRCode.toDataURL(text)
            let _qrcodeImg = await this.loadImg(qrcodeURL)
            return _qrcodeImg
          } catch (e) {
            console.error(e)
          }
        }

        let qrcodeImg = await generateQR(data.qrcode)
        ctx.drawImage(qrcodeImg, 50, 695, 90, 90)

        ctx.font = '20px Arial'
        ctx.fillStyle = '#333333'
        ctx.fillText('长按识别二维码', 220, 730)

        ctx.font = '20px Arial'
        ctx.fillStyle = '#333333'
        ctx.fillText('查看作品详情', 220, 760)

        this.sharePoster = canvas.toDataURL('image/png', 0.8)
      } catch (e) {
        Toast('生成分享图片失败')
        console.error(e)
      }
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
      this.sharePoster = ''
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
    .no-poster {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .no-poster-bg {
        display: inline-block;
        margin-bottom: px2rem(20px);
        width: px2rem(54px);
        height: px2rem(57px);
        @include img-retina('~@/assets/vote/loading@2x.png', '~@/assets/vote/loading@3x.png', px2rem(54px), px2rem(57px));
        animation: circle 5s infinite linear;
        -webkit-animation: circle 5s infinite linear;
      }
      @-webkit-keyframes circle {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(+360deg);
        }
      }
    }
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
