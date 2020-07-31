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
  </div>
</template>

<script>
import TipsDialog from '@/components/vote/global/tips-dialog'
import CheckVote from '@/components/vote/global/check-vote'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { mapGetters } from 'vuex'

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
    TipsDialog, CheckVote
  },
  computed: {
    ...mapGetters('vote', ['shareData'])
  },
  data () {
    return {
      isCheckVote: false,
      checkVote: {}
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
      let config = this.config
      if (!config) {
        return
      }
      let obj = {
        ...config,
        member_id: memberId
      }
      API.workVote({
        data: obj
      }).then(res => {
        this.$emit('close')
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
