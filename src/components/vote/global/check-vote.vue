<template>
  <div class="check-dialog-wrap"
    v-if="show"
    @touchmove.prevent="">
    <div class="scroll-wrap">
      <div class="check-dialog-content">
        <div class="check-dialog-main">
          <div class="check-header">投票验证</div>
          <div class="check-item">
            <el-input placeholder="姓名" v-model="checkData.name"></el-input>
          </div>
          <div class="check-item">
            <el-input placeholder="性别" v-model="checkData.sex"></el-input>
          </div>
          <div class="check-item">
            <el-input placeholder="手机号" v-model="checkData.phone"></el-input>
          </div>
          <div class="check-item">
            <el-input placeholder="验证码" v-model="checkData.reg"></el-input>
            <!-- <div>获取验证码</div> -->
          </div>
          <div class="check-item">
            <el-input placeholder="生日" v-model="checkData.birth"></el-input>
          </div>
          <div class="check-item">
            <el-input placeholder="邮箱" v-model="checkData.email"></el-input>
          </div>
          <div class="check-item">
            <el-input placeholder="详细地址" type="textarea" v-model="checkData.address"></el-input>
          </div>
        </div>
      </div>
      <div class="close-btn" @click.stop="closeCheckVote()"></div>
    </div>
  </div>
</template>

<script>
import TipsDialog from '@/components/vote/global/tips-dialog'
import { mapMutations } from 'vuex'

export default {
  components: {
    TipsDialog
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setModelThumbState(newState)
    }
  },
  data () {
    return {
      checkData: {
        name: '',
        sex: '',
        phone: '',
        reg: '',
        birth: '',
        email: '',
        address: ''
      }
    }
  },
  methods: {
    closeCheckVote () {
      this.$emit('close')
    },
    ...mapMutations('depence', {
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .check-dialog-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 99;
    .scroll-wrap {
      padding: px2rem(50px) 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      text-align: center;
    }
    .check-dialog-content {
      margin: 0 auto;
      width: px2rem(600px);
      border-radius: px2rem(8px);
      box-sizing: border-box;
      pointer-events: auto;
      background-color:#fff;
      @include img-retina('~@/assets/vote/tips-dialog-bg@2x.png', '~@/assets/vote/tips-dialog-bg@3x.png', px2rem(600px), px2rem(89px));
      background-repeat: no-repeat;
      background-position: bottom;
      .check-dialog-main {
        padding: px2rem(48px) px2rem(38px) px2rem(58px) px2rem(38px);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .check-header {
          text-align: center;
          margin-bottom: px2rem(60px);
          @include font-dpr(18px);
          color: #333333;
          font-weight: 500;
        }
        .check-item {
            width: 100%;
            margin-bottom: px2rem(30px);
            .el-input__inner, .el-textarea__inner {
              background-color: rgba(255, 255, 255, 0.2);
              border-radius: px2rem(4px);
              padding: px2rem(20px);
              @include font-dpr(14px);
              color: #333;
              border: 1px solid #FF6A45;
              &::placeholder {
                @include font-dpr(14px);
                color: #999999;
              }
            }
            .el-input .el-input__inner {
              height: px2rem(90px);
              line-height: px2rem(90px);
            }
            .el-textarea {
              .el-textarea__inner {
                resize: none;
                height: px2rem(140px);
              }
            }
          }
      }
    }
    .close-btn {
      margin-top: px2rem(60px);
      display: inline-block;
      width: px2rem(80px);
      height: px2rem(80px);
      background-size: px2rem(80px);
      @include img-retina("~@/assets/vote/dialog-close@2x.png","~@/assets/vote/dialog-close@3x.png", 100%, 100%);
    }
  }
</style>
