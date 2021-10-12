<template>
  <div class="canvass-dialog-wrap" v-if="show" @click.stop="close()">
    <div class="no-poster" v-if="!sharePoster">
      <div class="no-poster-bg" @click.stop></div>
      <div class="poster-tips">海报正在生成中...</div>
    </div>
    <img crossOrigin='anonymous' style='border-radius: 5px;'
      class="poster-img"
      v-if="sharePoster"
      :src="sharePoster"
      @click.stop />
    <div class="poster-tips" v-if="sharePoster">长按图片保存或转发朋友圈</div>
    <lottery-vote
      :show="isShowLottery"
      :lottery="lottery"
      :textSetting="{sign: '拉票'}"
      @close="isShowLottery = false"></lottery-vote>
    <div v-show='false' id='qrcode'></div>
    <!-- 图片的存储容器 -->
    <img crossOrigin='anonymous'  @load="resetPoster(5)"
      :src="worksBg" ref="worksBgRef" alt=""
      v-show="false">
    <img crossOrigin='anonymous' :src="worksImg" ref="worksImgRef" alt=""
      @load="resetPoster(1)" v-show="false">
    <img crossOrigin='anonymous' :src="qrcodeImg" ref="qrcodeImgRef" alt=""
      @load='qrcodeFun' v-show="false">
    <img crossOrigin='anonymous' :src="userIcon" ref="userIconRef" alt=""
      @load="resetPoster(3)" v-show="false">
    <img @load='loadSponsorFun' crossOrigin='anonymous' :src="sponsorUrl"
      alt="" ref='sponsorRef' v-show="false">
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import LotteryVote from '@/components/vote/global/vote-lottery'
import QRCode from 'qrcode'
import { Toast } from 'mint-ui'
import notice from '@/components/vote/list/vote-notice'

export default {
  props: {
    flag: String,
    signUnit: {
      type: String,
      default: '票'
    }
  },
  components: {LotteryVote, notice},
  data () {
    return {
      imgs: {
        bgImg: require('@/assets/vote/vote-bg.png')
      },
      sharePoster: '',
      show: false,
      isShowLottery: false,
      lottery: {},
      worksImg: '',
      worksCode: '',
      userIcon: '',
      worksBg: '',
      qrcodeImg: '',
      worksDetailObj: {},
      curCtx: '',
      curCanvas: '',
      sponsorUrl: '',
      sponsorName: '',
      isTipsShow: false, // 控制通知框状态
      message: '<span>长按图片保存或转发朋友圈</span>', //  通知框内的信息
      indexType1: false,
      indexType3: false,
      indexType5: false
    }
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setModelThumbState(newState)
    }
  },
  mounted () {
    // const canvas = document.createElement('canvas')
    // const ctx = canvas.getContext('2d')
    // this.curCtx = ctx
    // this.curCanvas = canvas
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
      }).then((code) => {
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
      }).then((res) => {
        if (!res) {
          return
        }
        let coverExt = '?x-oss-process=image/resize,m_fixed,w_560,h_350,color_EAD5BA'
        let avatar = STORAGE.get('userinfo').avatar
        let avatarUrl = avatar
          ? avatar + '?x-oss-process=image/circle,r_104/format,png'
          : ''
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
          if (res.last_votes === 0) {
            tips1 = '目前是第一名，坚持就是胜利'
          } else {
            tips1 = '第2名还差' + Math.abs(res.last_votes - res.total_votes) + this.signUnit + '就要赶超'
          }
          tips2 = '距离上一名还差' + Math.abs(res.last_votes - res.total_votes) + this.signUnit
          numbering = '快来帮' + res.numbering + '号投票吧'
        }
        let voteTip = res.index === 1 ? tips1 : tips2
        if (detailInfo.works_count === 1) {
          voteTip = '目前是第一名，坚持就是胜利'
        }

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

          this.sponsorUrl = cavObj.sponsor_logo // 赞助商图片地址
          this.sponsorName = cavObj.sponsor
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
            let cover = res.material.video[0].cover_image
              ? res.material.video[0].cover_image
              : res.material.video[0].cover
            params.cover = cover + coverExt
          } else if (this.flag === 'audio' && res.material.audio && res.material.audio.length) {
            params.audioTime = res.material.audio[0].duration
            params.cover =
              '//xzh5.hoge.cn/new-vote/images/poster_audio_bg.png' + coverExt
          } else if (this.flag === 'text') {
            params.content = res.introduce
            params.cover =
              '//xzh5.hoge.cn/new-vote/images/poster_text_bg.png' + coverExt
          }
          // 判断是否长图 如果是就修改为不截断参数
          if (isLongCover)params.cover = params.cover.replace('m_fixed', 'm_pad')
        }
        if (limit.is_open_classify && limit.is_open_classify === 1) {
          if (res.type_name) {
            params.source = res.type_name + ' | ' + params.source
          }
        }

        this.worksImg = params.cover
        this.worksDetailObj = {
          params: params,
          voteTip: voteTip
        }

        // 设置分享海报背景图片
        this.worksBg = detailInfo.rule.limit.canvassing_poster.background_img

        // this.worksCode = params.
        // this.renderPlaybill(params, voteTip)

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
    resetPoster (data) {
      // 判断用户头像是否存在
      if (this.worksDetailObj.params.avatar === '') {
        if (data === 1) {
          this.indexType1 = true
        }
        if (data === 5) {
          this.indexType5 = true
        }
        if (this.indexType1 && this.indexType5) {
          this.renderPlaybill(this.worksDetailObj.params, this.worksDetailObj.voteTip)
        }
      } else {
        // 头像存在
        if (data === 1) {
          this.indexType1 = true
        }
        if (data === 3) {
          this.indexType3 = true
        }
        if (data === 5) {
          this.indexType5 = true
        }
        if (this.indexType1 && this.indexType3 && this.indexType5) {
          this.renderPlaybill(this.worksDetailObj.params, this.worksDetailObj.voteTip)
        }
      }
    },
    loadSponsorFun () {
      // 赞助商信息
      let _sponsorName = this.sponsorName
      if (this.sponsorUrl !== '') {
        let _textHalf = Math.ceil(this.curCtx.measureText(_sponsorName).width / 2)
        let imgObj1 = this.$refs['sponsorRef']
        let _indexWidth = Math.ceil(320 - _textHalf - 45)
        this.curCtx.drawImage(imgObj1, _indexWidth, 830, 40, 40)
      }
      this.sharePoster = this.curCanvas.toDataURL('image/png', 0.8)
    },
    async renderPlaybill (data) {
      try {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        // 绘制背景图
        canvas.width = 640
        canvas.height = 897

        this.curCtx = ctx
        this.curCanvas = canvas

        let bgImg = this.$refs['worksBgRef']
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)

        ctx.font = '26px Arial'
        ctx.fillStyle = '#333333'
        ctx.textAlign = 'center'
        ctx.fillText(data.lastvotes, 300, 80)

        ctx.font = '26px Arial'
        ctx.fillStyle = '#333333'
        ctx.textAlign = 'center'
        ctx.fillText(data.numbering, 300, 120)
        // 绘制作品图片
        let imgObj = this.$refs['worksImgRef']
        ctx.drawImage(imgObj, 50, 150, canvas.width - 100, canvas.height - 550)

        ctx.save()
        if (this.flag === 'text') {
          // 文本类型需要显示introduce
          let textCtx = this.worksDetailObj.params.content
          ctx.font = '24px Arial'
          ctx.fillStyle = '#333333'
          ctx.textAlign = 'left'

          let textCtxLength = Math.floor(ctx.measureText(textCtx).width)
          if (textCtxLength < 380) {
            ctx.fillText(textCtx, 130, 220, 380)
          } else {
            let middleStr = ''
            let lineHeight = 30
            let loopNum = 0
            for (let i = 0; i < textCtx.length; i++) {
              let measureFontWidth = Math.floor(ctx.measureText(middleStr).width)
              if (measureFontWidth !== 0 && measureFontWidth >= 380) {
                loopNum += 1
                ctx.fillText(middleStr, 130, 220 + (loopNum - 1) * lineHeight, 380)
                middleStr = ''
                ctx.save()
              } else {
                middleStr = middleStr + textCtx[i]
              }
            }
          }
        }
        ctx.restore()
        ctx.save()

        ctx.font = '24px Arial'
        ctx.fillStyle = '#666666'
        ctx.textAlign = 'left'
        ctx.fillText(data.source, 50, 540)

        ctx.save()
        ctx.font = 'bold 30px Arial'
        ctx.fillStyle = '#333333'
        ctx.fillText(data.title, 50, 590, 540)
        ctx.save()

        ctx.font = '24px Arial'
        ctx.fillStyle = '#333333'
        ctx.fillText('来自', 50, 635)
        ctx.save()

        const userInfo = STORAGE.get('userinfo')
        let offwidthNum = '145'
        if (data.avatar === '') {
          offwidthNum = '100'
        } else {
          // 用户头像
          let userIcon = this.$refs['userIconRef']
          ctx.arc(120, 630, 18, 0, 2 * Math.PI)
          ctx.clip()
          ctx.drawImage(userIcon, 100, 608, 40, 40)
          ctx.restore()
        }

        ctx.font = '24px Arial'
        ctx.fillStyle = '#333333'
        ctx.fillText(`${userInfo.nick_name}的邀请`, offwidthNum, 635)

        QRCode.toDataURL(data.qrcode).then(res => {
          this.qrcodeImg = res
        })

        // 赞助商信息
        let _sponsorName = this.sponsorName
        if (this.sponsorName !== '') {
          ctx.font = '24px Arial'
          ctx.fillStyle = '#999999'
          ctx.textAlign = 'center'
          console.log(222, ctx.measureText(_sponsorName))
          ctx.fillText(_sponsorName, 320, 860)
        }
      } catch (e) {
        Toast('生成分享图片失败')
        console.error(e)
      }
    },
    qrcodeFun () {
      this.curCtx.drawImage(this.$refs['qrcodeImgRef'], 50, 685, 90, 90)
      this.sharePoster = this.curCanvas.toDataURL('image/png', 0.8)
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
      for (let key in params) {
        // 拼接字符串
        url += key + '=' + params[key] + '&'
      }
      return (
        protocol + '//' + host + pathname + url.substring(0, url.length - 1)
      )
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
  background: rgba(0, 0, 0, 0.5);
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
      @include img-retina(
        "~@/assets/vote/loading@2x.png",
        "~@/assets/vote/loading@3x.png",
        px2rem(54px),
        px2rem(57px)
      );
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
    color: #ffffff;
  }
  .tips {
    width: 88%;
    padding: 6px;
    background-color: #fdf3e5;
    color: #000;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}
</style>
