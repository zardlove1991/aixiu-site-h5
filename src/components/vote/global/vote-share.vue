<template>
  <!-- 投票弹窗 -->
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
</template>

<script>
import TipsDialog from '@/components/vote/global/tips-dialog'
import API from '@/api/module/examination'

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
    TipsDialog
  },
  methods: {
    close () {
      this.$emit('close')
    },
    sureWorkVote () {
      let config = this.config
      if (!config) {
        return
      }
      let obj = {
        ...config
        // member_id: STORAGE.get('userinfo').id
      }
      API.workVote({
        data: obj
      }).then(res => {
        console.log('workVote', res)
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
