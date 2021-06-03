<template>
  <div class="commvote-detail">
    <div class="detail-page-content-wrap">
      <div class="detail-header">
        <div class="common-page-detail-back" @click.stop="dealDetailMenu('back')"></div>
        <div class="lottery-button"
          v-if="workDetail.lottery && workDetail.lottery.remain_lottery_counts && workDetail.is_member_voted === 1 && isBtnAuth === 1"
          @click.stop="goLottery(workDetail.lottery.link)">有{{workDetail.lottery.remain_lottery_counts}}次抽奖机会</div>
      </div>
      <!--媒体组件渲染-->
      <div :class="['detail-video-wrap', videoMode === '3' ? 'vertical' : '']"
        v-if="showModel === 'video' && workDetail.material && workDetail.material.video && workDetail.material.video.length">
        <vote-video class="base-video"
          v-for="(video, index) in workDetail.material.video" :key="index"
          :data="video">
        </vote-video>
      </div>
      <div v-if="showModel === 'audio' && workDetail.material && workDetail.material.audio && workDetail.material.audio.length">
        <vote-audio class="base-audio"
          v-for="(audio, index) in workDetail.material.audio" :key="index"
          :darkMark="darkMark"
          :data="audio">
        </vote-audio>
      </div>
      <div v-if="showModel === 'picture' && workDetail.material && workDetail.material.image && workDetail.material.image.length">
        <img class="base-image"
          :class="imageRatio?'vertical':''"
          v-for="(image, index) in workDetail.material.image" :key="index"
          :src="image.url + '?x-oss-process=image/resize,w_400'" />
      </div>
      <!--详情页面内容-->
      <p class="detail-cotent" v-show="workDetail.introduce" v-html="workDetail.introduce"></p>
    </div>
    <!--导入详情页模板-->
    <common-page-detail
      :info="workDetail"
      :textSetting="detailInfo.text_setting"
      :isOpenClassify="isOpenClassify"
      @detail-menu="dealDetailMenu">
    </common-page-detail>
    <share-vote
      ref="shareVote"
      :show="isShowWorkVote"
      :config="{
        voting_id: id,
        works_id: workDetail.id,
        mark: mark
      }"
      :textSetting="detailInfo.text_setting"
      @updateCard="updateCard"
      @success="inintDetail()"
      @close="isShowWorkVote = false"
    ></share-vote>
    <canvass-vote :flag="showModel" :signUnit="signUnit" ref="canvass-vote-detail" />
</div>
</template>

<script>
import VoteAudio from '@/components/vote/global/vote-audio'
import VoteVideo from '@/components/vote/global/vote-video'
import CommonPageDetail from '@/components/vote/global/common-page-detail'
import ShareVote from '@/components/vote/global/vote-share'
import CanvassVote from '@/components/vote/global/vote-canvass'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { mapActions, mapGetters } from 'vuex'
import { fullSceneMap } from '@/utils/config'
import mixins from '@/mixins/index'
import {
  // getPlat,
  setBrowserTitle
} from '@/utils/utils'

export default {
  mixins: [mixins],
  components: {
    VoteVideo,
    VoteAudio,
    CommonPageDetail,
    ShareVote,
    CanvassVote
  },
  data () {
    return {
      showModel: this.flag,
      workDetail: {},
      isShowWorkVote: false,
      mark: '',
      isBackList: false,
      statusCode: {
        noStatus: 0, // 未开始
        signUpStatus: 1, // 报名中
        voteStatus: 2, // 投票中
        endStatus: 3, // 已结束
        noSignUp: 4, // 未开始报名
        signUpVoteStatus: 5 // 边报名边投票
      },
      detailInfo: {},
      signUnit: '票',
      isOpenClassify: false,
      imageRatio: 0, // 图片模式
      videoMode: '1',
      isCloseDialog: false, // 是否开启投票弹框
      darkMark: '1', // 1: 深色系 2: 浅色系
      fullSceneMap,
      shareConfigData: {}
    }
  },
  created () {
    this.inintDetail()
    // let plat = getPlat()
    // if (plat === 'smartcity') {
    //   window.SmartCity.onShareSuccess((res) => {
    //     this.appShareCallBack()
    //   })
    // }
  },
  props: {
    id: String,
    flag: String
  },
  computed: {
    ...mapGetters('vote', ['isBtnAuth'])
  },
  methods: {
    async inintDetail () {
      let { worksId, sign, invotekey } = this.$route.query
      let detailInfo = STORAGE.get('detailInfo')
      if (!detailInfo) {
        let res = await this.getDetail()
        detailInfo = res
        this.isBackList = true
      }
      this.detailInfo = detailInfo
      if (detailInfo.text_setting && detailInfo.text_setting.sign) {
        let tmp = detailInfo.text_setting.sign.split('')
        if (tmp.length >= 2) {
          let signUnit = tmp[1]
          if (signUnit === '力') {
            this.signUnit = '助力值'
          } else if (signUnit === '敬') {
            this.signUnit = '致敬数'
          } else {
            this.signUnit = signUnit
          }
        }
      }
      // 判断图片模式
      let pageSetup = detailInfo.rule.page_setup
      if (pageSetup.image_ratio) {
        this.imageRatio = 1
      } else {
        this.imageRatio = 0
      }
      if (pageSetup.font_color) {
        this.darkMark = pageSetup.font_color
      }
      // 判断投票弹窗
      if (detailInfo.rule && detailInfo.rule.is_close_dialog) {
        this.isCloseDialog = true
      } else {
        this.isCloseDialog = false
      }
      let limit = detailInfo.rule.limit
      if (limit.is_open_classify && limit.is_open_classify === 1) {
        this.isOpenClassify = true
      }
      if (limit.show_mode) {
        this.videoMode = limit.show_mode
      }
      // 根据投票、报名的时间范围计算按钮的权限
      this.setBtnAuth(detailInfo)
      if (sign && invotekey) {
        this.isBackList = true
        this.setShareData({ sign, invotekey })
      }
      this.mark = detailInfo.mark
      API.getVoteWorksDetail({
        query: {
          id: this.id,
          worksId
        }
      }).then(res => {
        if (!res) {
          return
        }
        let { remain_votes: remainVotes } = res
        let newVotes = 0
        if (remainVotes > 0) {
          newVotes = remainVotes
        }
        res.remain_votes = newVotes
        let fullSceneType = res.full_scene_type
        if (fullSceneType && fullSceneType !== '0') {
          this.showModel = this.fullSceneMap[fullSceneType][1]
        }
        this.workDetail = res
        setBrowserTitle(res.name)
        // 调整详情页的分享
        this.sharePage(detailInfo, res)
      })
    },
    getDetail () {
      return new Promise((resolve, reject) => {
        API.getVodeDetail({
          query: { id: this.id }
        }).then((res) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    setBtnAuth (obj) {
      if (!obj) {
        return
      }
      let nowTime = new Date().getTime()
      let { noStatus, voteStatus } = this.statusCode
      let { start_time: startTime, end_time: endTime } = obj
      let startTimeMS = startTime * 1000
      let endTimeMS = endTime * 1000
      let flag = startTimeMS > nowTime
      if (endTimeMS <= nowTime) {
        this.setIsBtnAuth(0)
        return
      }
      let status = flag ? noStatus : voteStatus
      this.setIsBtnAuth(status === noStatus ? 0 : 1)
    },
    dealDetailMenu (slug) {
      if (slug === 'back') {
        if (this.isBackList || /wechat=true/.test(location.href)) {
          this.$router.replace({
            name: 'votebegin',
            params: { id: this.id }
          })
        } else {
          window.history.back()
        }
      } else if (slug === 'vote') {
        // 是否开启弹窗
        if (this.isCloseDialog) {
          this.$refs.shareVote.sureWorkVote()
        } else {
          this.isShowWorkVote = true
        }
      } else if (slug === 'invote') {
        let obj = this.$refs['canvass-vote-detail']
        if (obj) {
          obj.saveSharer(this.workDetail.id)
        }
      }
    },
    goLottery (link) {
      if (link) {
        window.location.href = link
      }
    },
    updateCard () {
      if (this.workDetail.remain_votes > 0) {
        this.workDetail.remain_votes--
        this.workDetail.total_votes++
      }
    },
    sharePage (detailInfo, workDetail) {
      if (!detailInfo) {
        return false
      }
      let {
        // title,
        // introduce,
        indexpic,
        rule
      } = detailInfo
      let { name, introduce, material } = workDetail
      let imgUrl = ''
      let shareLink = location.href + '&wechat=true'
      // let shareTitle = title
      let shareBrief = introduce
      if (rule && rule.is_close_dialog) {
        this.isCloseDialog = true
      } else {
        this.isCloseDialog = false
      }
      if (rule && rule.share_settings) {
        let share = rule.share_settings
        let sharePic = share.indexpic
        // if (share.title) {
        //   shareTitle = share.title
        // }
        // if (share.brief) {
        //   shareBrief = share.brief
        // }
        // shareLink = share.link
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
        } else if (indexpic) {
          if (indexpic.constructor === Array && indexpic.length > 0) {
            let obj = indexpic[0]
            if (obj.constructor === Object) {
              imgUrl = obj.host + obj.filename
            } else if (obj.constructor === String) {
              imgUrl = obj
            }
          } else if (indexpic.constructor === Object && indexpic.host && indexpic.filename) {
            imgUrl = indexpic.host + indexpic.filename
          } else if (indexpic.constructor === String) {
            imgUrl = indexpic
          }
        }
      }
      //
      if (material.image.length > 0) {
        imgUrl = material.image[0].url
      }
      if (imgUrl && !/^http/.test(imgUrl)) {
        imgUrl = location.protocol + imgUrl
      }
      // let plat = getPlat()
      // if (plat === 'smartcity') {
      //   // window.SmartCity.onShareSuccess((res) => {
      //   //   this.appShareCallBack()
      //   // })
      //   this.shareConfigData = {
      //     id: detailInfo.id,
      //     title: name,
      //     desc: shareBrief,
      //     indexpic: imgUrl,
      //     link: location.href,
      //     mark: detailInfo.mark
      //   }
      //   window.SmartCity.shareTo({
      //     // showShareButton: "是否显示右上角的分享按钮",
      //     // updateShareData: "是否弹出分享视图",
      //     title: name,
      //     brief: shareBrief,
      //     contentURL: location.href,
      //     imageLink: imgUrl
      //   })
      // }
      this.initPageShareInfo({
        id: detailInfo.id,
        title: name,
        desc: shareBrief,
        indexpic: imgUrl,
        link: shareLink,
        mark: detailInfo.mark
      })
    },
    // appShareCallBack () {
    //   if (this.shareConfigData.id && this.isOpenShare) {
    //     this.setShare({
    //       id: this.shareConfigData.id,
    //       title: this.shareConfigData.title,
    //       from: this.shareConfigData.from,
    //       mark: this.shareConfigData.mark
    //     })
    //   }
    // },
    ...mapActions('vote', {
      setShareData: 'SET_SHARE_DATA',
      setIsBtnAuth: 'SET_IS_BTN_AUTH'
    }),
    ...mapActions('depence', {
      setShare: 'SET_SHARE'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .commvote-detail {
    width: 100%;
    height: 100vh;
    position: relative;
    .detail-page-content-wrap {
      padding: 0 px2rem(30px);
      width: 100%;
      height: 100vh;
      padding-bottom: 250px;
      box-sizing: border-box;
      overflow-y: auto;
      .detail-header {
        display: flex;
        justify-content: space-between;
        padding: px2rem(30px);
        .common-page-detail-back {
          position: relative;
          width: px2rem(68px);
          height: px2rem(68px);
          border-radius: 50%;
          background-color: rgba(0,0,0,0.5);
          pointer-events: auto;
          &::after {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-30%, -50%) rotate(45deg);
            width: px2rem(20px);
            height: px2rem(20px);
            border: 1px solid #fff;
            border-top: none;
            border-right: none;
            content: '';
          }
        }
        .lottery-button{
          height: px2rem(68px);
          line-height: px2rem(68px);
          text-align: center;
          font-size: px2rem(22px);
          padding: 0 px2rem(22px);
          color: #fff;
          border-radius: px2rem(34px);
          // background-color: #FC7465;
          @include bg-color('btnColor');
          pointer-events: auto;
        }
      }
      .detail-video-wrap {
        width: 100%;
        height: calc((100vw - 1.875rem) * 9 / 16);
        margin-bottom: px2rem(40px);
        &.vertical {
          height: calc((100vw - 1.875rem) * 4.5 / 3);
        }
      }
      .base-video, .base-audio, .base-image {
        width: 100%;
        margin-bottom: px2rem(40px);
      }
      .base-image.vertical {
        height: calc((100vw - 1.875rem)*5.6/4);
      }
      .detail-cotent {
        font-size: px2rem(30px);
        @include font-color('fontColor');
        line-height: px2rem(48px);
        white-space: pre-line;
      }
    }
  }
</style>
