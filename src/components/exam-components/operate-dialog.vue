<template>
  <div class="operate-mask" v-if="visible">
    <div class="operate-dialog-wrap" :class="{'is-balance': dialogConfig.type !== 'integral'}">
      <span class="close-btn" @click="closeDialog"></span>
      <div class="title">{{title}}</div>
      <div class="tips-logo" :class="`${dialogConfig.type}-logo`"></div>
      <div class="tips-content" v-html="dialogConfig.tips" v-if="dialogConfig.type !== 'share'"></div>
      <div class="share-tips-content" v-if="dialogConfig.type === 'share'">
        <div class="number-tips">获得<span class="special-text">&nbsp;{{dialogConfig.showNumber}}次&nbsp;</span>免费答题的机会</div>
        <div>{{dialogConfig.tips}}</div>
      </div>
      <el-checkbox v-if="dialogConfig.type === 'integral'" @change="checkedUse" v-model="checked">每次参与答题需消耗{{dialogConfig.reduce_integral}}积分，每天最多兑换{{dialogConfig.times}}次</el-checkbox>
      <div class="btn-wrap" :class="{'has-confrim-btn': dialogConfig.showConfirmBtn}">
        <div class="cancel-btn" @click="closeDialog">算了吧</div>
        <div class="confirm-btn" @click="confirmDialog" v-if="dialogConfig.showConfirmBtn">使用积分</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import STORAGE from '@/utils/storage'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dialogConfig: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: '操作提示'
    }
  },
  data () {
    return {
      checked: false,
      examId: this.$route.params.id
    }
  },
  mounted () {
    // this.checked = STORAGE.get('use_integral_start') && STORAGE.get('use_integral_start').id === this.examId
  },
  methods: {
    closeDialog () {
      this.$emit('update:visible', false)
    },
    confirmDialog () {
      if (this.checked) {
        const obj = {id: this.examId, record_time: new Date().getTime()}
        STORAGE.set('use_integral_start', obj)
        this.$emit('handelConfirm')
        this.$emit('update:visible', false)
      } else {
        Toast('请勾选使用积分')
      }
    },
    checkedUse () {
      STORAGE.set('use_integral_start', {status: this.checked, id: this.examId})
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
  .operate-mask {
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    .operate-dialog-wrap {
      width: px2rem(630px);
      min-height: px2rem(500px);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 16px;
      padding: px2rem(40px) 0 px2rem(60px);
      .close-btn {
        float: right;
        width: px2rem(24px);
        height: px2rem(24px);
        margin-right: px2rem(40px);
        @include img-retina('~@/assets/common/exam/close_btn@2x.png','~@/assets/common/exam/close_btn@2x.png', 100%, 100%);
      }
      .title {
        font-size: px2rem(34px);
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: #333;
        margin-top: px2rem(37px);
        text-align: center;
      }
      .tips-logo {
        width: px2rem(239px);
        height: px2rem(187px);
        margin: px2rem(30px) auto;
        @include img-retina('~@/assets/common/exam/no_balance@2x.png','~@/assets/common/exam/no_balance@2x.png', 100%, 100%);
        &.integral-logo {
          width: px2rem(381px);
          height: px2rem(230px);
          @include img-retina('~@/assets/common/exam/integral_tip@2x.png','~@/assets/common/exam/integral_tip@2x.png', 100%, 100%);
        }
        &.share-logo {
          width: px2rem(381px);
          height: px2rem(220px);
          @include img-retina('~@/assets/common/exam/share_logo@2x.png','~@/assets/common/exam/share_logo@2x.png', 100%, 100%);
        }
      }
      .tips-content {
        width: px2rem(360px);
        font-size: px2rem(30px);
        line-height: px2rem(45px);
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #333333;
        text-align: center;
        margin: px2rem(20px) auto 0;
      }
      .share-tips-content {
        padding: 0 px2rem(60px);
        width: 100%;
        @include font-dpr(13px);
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #999;
        margin-top: px2rem(30px);
        text-align: center;
        .number-tips {
          @include font-dpr(15px);
          color: #333;
          margin-bottom: px2rem(24px);
        }
        .special-text {
          color: #BE0000;
        }
      }
      .el-checkbox {
        padding: 0 px2rem(30px);
        margin-top: px2rem(60px);
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: end;
        .el-checkbox__inner {
          width: 18px !important;
          height: 18px  !important;
          font-size: 14px;
          &:after {
            font-size: 14px;
            border-width: 2px;
            width: 5px;
            height: 9px;
          }
        }
        .el-checkbox__label {
          width: 90%;
          white-space: break-spaces;
          color: #333;
        }
      }
      .btn-wrap {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: px2rem(40px);
        padding: 0 px2rem(30px);
        .cancel-btn, .confirm-btn {
          width: px2rem(275px);
          height: px2rem(90px);
          line-height: px2rem(90px);
          border-radius: 12px;
          font-size: px2rem(32px);
          font-family: SourceHanSansCN-Medium, SourceHanSansCN;
          font-weight: 500;
          text-align: center;
        }
        .cancel-btn {
          color: #FFA800;
          background: #FFF3DC;
        }
        .confirm-btn {
          color: #fff;
          background: #FFA800;
        }
        &.has-confrim-btn {
          justify-content: space-between;
        }
      }
      &.is-balance {
        .tips-content {
          width: px2rem(450px);
        }
        .btn-wrap {
          margin-top: px2rem(60px);
        }
      }
    }
  }
</style>
