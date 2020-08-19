<template>
  <div class="commvote-detail color-bg_color">
    <div class="detail-page-content-wrap">
      <div class="detail-header">
        <div class="common-page-detail-back" @click.stop="dealDetailMenu('back')"></div>
        <div class="lottery-button color-button_color color-button_text"
          v-if="workDetail.lottery && workDetail.lottery.remain_lottery_counts && workDetail.is_member_voted === 1 && isBtnAuth === 1"
          @click.stop="goLottery(workDetail.lottery.link)">有{{workDetail.lottery.remain_lottery_counts}}次抽奖机会</div>
      </div>
      <!--媒体组件渲染-->
      <div class="detail-video-wrap"
        v-if="flag === 'video' && workDetail.material && workDetail.material.video && workDetail.material.video.length">
        <vote-video class="base-video"
          v-for="(video, index) in workDetail.material.video" :key="index"
          :data="video">
        </vote-video>
      </div>
      <div v-if="flag === 'audio' && workDetail.material && workDetail.material.audio && workDetail.material.audio.length">
        <vote-audio class="base-audio"
          v-for="(audio, index) in workDetail.material.audio" :key="index"
          :data="audio">
        </vote-audio>
      </div>
      <div v-if="flag === 'picture' && workDetail.material && workDetail.material.image && workDetail.material.image.length">
        <img class="base-image"
          v-for="(image, index) in workDetail.material.image" :key="index"
          :src="image.url + '?x-oss-process=image/resize,w_400'" />
      </div>
      <!--详情页面内容-->
      <p class="detail-cotent" v-show="workDetail.introduce" v-html="workDetail.introduce"></p>
    </div>
    <!--导入详情页模板-->
    <common-page-detail
      :info="workDetail"
      @detail-menu="dealDetailMenu">
    </common-page-detail>
    <share-vote
      :show="isShowWorkVote"
      :config="{
        voting_id: id,
        works_id: workDetail.id,
        mark: mark
      }"
      @success="inintDetail()"
      @close="isShowWorkVote = false"
    ></share-vote>
    <canvass-vote :flag="flag" ref="canvass-vote-detail" />
    <active-vote
      :show="isShowActiveTips"
      @close="isShowActiveTips = false"
      :downloadLink="downloadLink"
      :activeTips="activeTips">
    </active-vote>
</div>
</template>

<script>
import VoteAudio from '@/components/vote/global/vote-audio'
import VoteVideo from '@/components/vote/global/vote-video'
import CommonPageDetail from '@/components/vote/global/common-page-detail'
import ShareVote from '@/components/vote/global/vote-share'
import CanvassVote from '@/components/vote/global/vote-canvass'
import ActiveVote from '@/components/vote/global/vote-active'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { getAppSign } from '@/utils/utils'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    VoteVideo,
    VoteAudio,
    CommonPageDetail,
    ShareVote,
    CanvassVote,
    ActiveVote
  },
  data () {
    return {
      workDetail: {},
      isShowWorkVote: false,
      mark: '',
      isBackList: false,
      isShowActiveTips: false,
      activeTips: [],
      downloadLink: '',
      statusCode: {
        noStatus: 0, // 未开始
        signUpStatus: 1, // 报名中
        voteStatus: 2, // 投票中
        endStatus: 3, // 已结束
        noSignUp: 4 // 未开始报名
      }
    }
  },
  created () {
    this.inintDetail()
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
      // 根据投票、报名的时间范围计算按钮的权限
      this.setBtnAuth(detailInfo)
      let isShowModel = false
      if (sign && invotekey) {
        this.isBackList = true
        this.setShareData({ sign, invotekey })
        isShowModel = true
      }
      this.setSourceLimit(detailInfo, isShowModel)
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
        this.workDetail = res
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
        // 已经结束
        this.setIsBtnAuth(0)
      }
      let status = flag ? noStatus : voteStatus
      this.setIsBtnAuth(status === noStatus ? 0 : 1)
    },
    setSourceLimit (detailInfo, isShowModel) {
      // 来源限制
      if (!detailInfo || !detailInfo.rule || !detailInfo.rule.limit) {
        return
      }
      let { source_limit: sourceLimit } = detailInfo.rule.limit
      if (sourceLimit) {
        let {
          user_app_source: appSource,
          source_limit: limitTxt,
          app_download_link: downloadLink
        } = sourceLimit
        if (limitTxt && appSource && appSource.length > 0) {
          let plat = getAppSign()
          let limitArr = limitTxt.split(',')
          let flag = false
          for (let item of limitArr) {
            if (item === 'smartcity' && plat.includes('smartcity')) {
              flag = true
              break
            }
            if (item === plat) {
              flag = true
              break
            }
          }
          if (!flag) {
            if (isShowModel) {
              this.isShowActiveTips = true
            }
            this.downloadLink = downloadLink
            this.activeTips = appSource
            this.isReportAuth = 0
            this.setIsBtnAuth(0)
          }
        }
      }
    },
    dealDetailMenu (slug) {
      if (slug === 'back') {
        if (this.isBackList) {
          this.$router.replace({
            name: 'votebegin',
            params: { id: this.id }
          })
        } else {
          window.history.back()
        }
      } else if (slug === 'vote') {
        this.isShowWorkVote = true
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
    ...mapActions('vote', {
      setShareData: 'SET_SHARE_DATA',
      setIsBtnAuth: 'SET_IS_BTN_AUTH'
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
        height: px2rem(390px);
        margin-bottom: px2rem(40px);
      }
      .base-video, .base-audio, .base-image {
        width: 100%;
        margin-bottom: px2rem(40px);
      }
      .detail-cotent {
        font-size: px2rem(30px);
        color: #fff;
        line-height: px2rem(48px);
        white-space: pre-line;
      }
    }
  }
</style>
