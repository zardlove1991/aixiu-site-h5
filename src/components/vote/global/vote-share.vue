<template>
  <!-- 投票弹窗 -->
  <div>
    <tips-dialog
      :show="show"
      @close="close()">
      <div class="workvote-dialog-wrap" slot="tips-content">
        <div class="workvote-header">确定要{{textSetting.vote ? textSetting.vote : '给Ta投票' }}吗？</div>
        <div class="workvote-all-btn">
          <button class="dialog-sure-btn min workvote-right" v-if="!voteDisable" @click="sureWorkVote()">确定</button>
          <button class="dialog-sure-btn min workvote-right" v-else>确定</button>
          <button class="dialog-ok-btn min" @click="close()">取消</button>
        </div>
      </div>
    </tips-dialog>
    <check-vote
      :voteId="config.voting_id"
      :show="isCheckVote"
      :checkVote="checkVote"
      :textSetting="textSetting"
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
      :textSetting="textSetting"
      @close="isShowLottery = false"></lottery-vote>
    <area-vote
      :show="isShowArea"
      :limitArea="limitArea"
      @close="isShowArea = false"></area-vote>
    <tips-dialog
      :show="isShowMax"
      @close="isShowMax = false">
      <div class="workvote-dialog-wrap" slot="tips-content">
        <div class="workvote-header">{{textSetting.sign === '致敬' ? '暂时无法致敬' : '这个作品太火爆了'}}</div>
        <div class="workvote-header">{{voteTime}}秒后再{{textSetting.vote ? textSetting.vote : '给Ta投票' }}吧！</div>
        <div class="workvote-all-btn">
          <button class="dialog-ok-btn" @click.stop="isShowMax = false">好的</button>
        </div>
      </div>
    </tips-dialog>
  </div>
</template>

<script>
import TipsDialog from '@/components/vote/global/tips-dialog'
import CheckVote from '@/components/vote/global/vote-check'
import QrcodeVote from '@/components/vote/global/vote-qrcode'
import LotteryVote from '@/components/vote/global/vote-lottery'
import AreaVote from '@/components/vote/global/vote-area'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { mapGetters } from 'vuex'
import { Toast } from 'mint-ui'
// import { formatTimeBySec } from '@/utils/utils'

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
    },
    textSetting: {
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
      limitArea: [],
      isShowMax: false,
      voteTime: '',
      lottery: {}, // 抽奖信息
      checkVote: {},
      qrcodeUrl: '',
      voteDisable: false
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    async sureWorkVote () {
      let detailInfo = STORAGE.get('detailInfo')
      if (!detailInfo) {
        return
      }
      let { rule, id } = detailInfo
      let { collect_member_info: collectMemberInfo } = rule
      // 是否验证投票
      if (collectMemberInfo && collectMemberInfo.length > 0) {
        let status = await this.getIsCollect(id)
        if (status) {
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
      } else {
        this.isCanvassShare()
      }
    },
    getIsCollect (id) {
      return new Promise(resolve => {
        API.getIsCollect({
          query: {
            id
          }
        }).then(res => {
          if (res) {
            resolve(res.status)
          }
        })
      })
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
      this.voteDisable = true
      let obj = {
        ...config,
        member_id: memberId
      }
      // 区域限制
      let { rule } = detailInfo
      let { area_limit: areaLimit } = rule
      if (areaLimit && areaLimit.is_area_limit && areaLimit.area && areaLimit.area.length) {
        this.limitArea = areaLimit.area
        // 区域限制，传入经纬度
        let location = STORAGE.get('location')
        if (location) {
          obj.lat = location.lat ? location.lat : 0
          obj.lng = location.lng ? location.lng : 0
        }
      }
      API.workVote({
        data: obj
      }).then(res => {
        let errCode = res.error_code
        if (errCode) {
          console.log('xxxxxx', errCode)
          if (errCode === 'WORKS_LOCKED') {
            let msg = res.error_message
            this.isShowMax = true
            this.voteTime = msg
            // this.voteTime = formatTimeBySec(num)
            this.$emit('close')
            this.voteDisable = false
            return
          } else if (errCode === 'AREA_CAN_NOT_VOTE' || errCode === 'NOT_IN_LIMIT_AREA') {
            // 区域限制
            this.isShowArea = true
            this.$emit('close')
            this.voteDisable = false
            return
          } else {
            Toast(res.error_message)
            this.voteDisable = false
            return
          }
        }
        // 关注公众号
        let qrcodeUrl = res.url
        if (qrcodeUrl) {
          this.qrcodeUrl = qrcodeUrl
          this.$emit('close')
          this.isShowQrcode = true
          this.voteDisable = false
          return
        }
        // 抽奖
        let lottery = res.lottery
        if (lottery && lottery.lottery_id && lottery.remain_lottery_counts) {
          this.isShowLottery = true
          this.lottery = lottery
          this.$emit('close')
          this.voteDisable = false
          this.$emit('success')
          return
        }
        this.$emit('close')
        this.voteDisable = false
        let sign = this.textSetting.sign ? this.textSetting.sign : '投票'
        Toast('成功' + sign)
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
