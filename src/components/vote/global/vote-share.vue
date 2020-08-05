<template>
  <!-- 投票弹窗 -->
  <div>
    <tips-dialog
      :show="show"
      @close="close()">
      <div class="workvote-dialog-wrap" slot="tips-content">
        <div class="workvote-header">确定要给这个作品投票吗？</div>
        <div class="workvote-all-btn">
          <button class="dialog-sure-btn min workvote-right" @click="sureWorkVote()">确定</button>
          <button class="dialog-ok-btn min" @click="close()">取消</button>
        </div>
      </div>
    </tips-dialog>
    <check-vote
      :voteId="config.voting_id"
      :show="isCheckVote"
      :checkVote="checkVote"
      @close="isCheckVote = false"
      @success="isCanvassShare()">
    </check-vote>
    <qrcode-vote
      :show="isShowQrcode"
      :qrcodeUrl="qrcodeUrl"
      @close="isShowQrcode = false">
    </qrcode-vote>
    <lottery-vote
      :show="isShowLottery"
      :lottery="lottery"
      @close="isShowLottery = false"></lottery-vote>
    <area-vote
      :show="isShowArea"
      :limitArea="limitArea"
      @close="isShowArea = false"></area-vote>
  </div>
</template>

<script>
import TipsDialog from '@/components/vote/global/tips-dialog'
import CheckVote from '@/components/vote/global/check-vote'
import QrcodeVote from '@/components/vote/global/vote-qrcode'
import LotteryVote from '@/components/vote/global/vote-lottery'
import AreaVote from '@/components/vote/global/vote-area'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { mapGetters } from 'vuex'
import { Toast } from 'mint-ui'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    TipsDialog, CheckVote, QrcodeVote, LotteryVote, AreaVote
  },
  computed: {
    ...mapGetters('vote', ['shareData'])
  },
  data () {
    return {
      isCheckVote: false,
      isShowQrcode: false, // 关注公众号，即可参加活动弹窗
      isShowLottery: false, // 抽奖弹窗
      isShowArea: false, // 区域限制弹窗
      limitArea: [], // 区域限制
      lottery: {}, // 抽奖信息
      checkVote: {},
      qrcodeUrl: ''
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    sureWorkVote () {
      let detailInfo = STORAGE.get('detailInfo')
      if (!detailInfo) {
        return
      }
      let { rule } = detailInfo
      let { collect_member_info: collectMemberInfo } = rule
      // 是否验证投票
      if (collectMemberInfo && collectMemberInfo.length > 0) {
        let newCheckVote = {}
        for (let coll of collectMemberInfo) {
          newCheckVote[coll] = true
        }
        this.checkVote = newCheckVote
        this.$emit('close')
        this.isCheckVote = true
      } else {
        this.isCanvassShare()
      }
    },
    isCanvassShare () {
      let shareData = this.shareData
      if (shareData && shareData.sign && shareData.invotekey) {
        // 通过二维码进入投票
        API.getSharer({
          params: { key: shareData.invotekey }
        }).then(res => {
          if (!res || !res.member_id) {
            return
          }
          this.saveShare(res.member_id)
        })
      } else {
        this.saveShare()
      }
    },
    saveShare (memberId = '') {
      let detailInfo = STORAGE.get('detailInfo')
      let config = this.config
      if (!config || !detailInfo) {
        return
      }
      let obj = {
        ...config,
        member_id: memberId
      }
      // 区域限制
      let { rule } = detailInfo
      let { area_limit: areaLimit } = rule
      if (areaLimit && areaLimit.is_area_limit && areaLimit.area && areaLimit.area.length) {
        // 区域限制，传入经纬度
        let location = STORAGE.get('location')
        if (location) {
          obj.lat = location.lat ? location.lat : 0
          obj.lng = location.lng ? location.lng : 0
          this.limitArea = areaLimit.area
        }
      }
      API.workVote({
        data: obj
      }).then(res => {
        let errCode = res.error_code
        if (errCode && errCode !== 'AREA_CAN_NOT_VOTE') {
          Toast(res.error_message)
          return
        }
        // 区域限制
        if (errCode && errCode === 'AREA_CAN_NOT_VOTE') {
          this.isShowArea = true
          this.$emit('close')
          return
        }
        // 关注公众号
        let qrcodeUrl = res.url
        if (qrcodeUrl) {
          this.qrcodeUrl = qrcodeUrl
          this.$emit('close')
          this.isShowQrcode = true
          return
        }
        // 抽奖
        let lottery = res.lottery
        if (lottery && lottery.lottery_id && lottery.remain_lottery_counts) {
          this.isShowLottery = true
          this.lottery = lottery
          this.$emit('close')
          return
        }
        this.$emit('close')
        Toast('成功投票')
        this.$emit('success')
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .workvote-dialog-wrap {
    padding-bottom: px2rem(91px);
    padding-top: px2rem(86px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .workvote-header {
      text-align: center;
      @include font-dpr(16px);
      color: #333333;
    }
    .workvote-all-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: px2rem(56px);
      .workvote-right {
        margin-right: px2rem(60px);
      }
      .dialog-ok-btn {
        width: px2rem(270px);
        height: px2rem(70px);
        &.min {
          width: px2rem(200px);
        }
        line-height: px2rem(70px);
        text-align: center;
        border: 1px solid #CCCCCC;
        background: #fff;
        border-radius: px2rem(35px);
        @include font-dpr(14px);
        color: #666666;
      }
      .dialog-sure-btn {
        width: px2rem(270px);
        height: px2rem(70px);
        &.min {
          width: px2rem(200px);
        }
        line-height: px2rem(70px);
        text-align: center;
        border: 1px solid #F36E4E;
        background: #fff;
        border-radius: px2rem(35px);
        @include font-dpr(14px);
        color: #F36E4E;
      }
    }
  }
</style>
