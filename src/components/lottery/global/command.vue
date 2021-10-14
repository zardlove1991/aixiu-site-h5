<template>
    <div class='command-dialog' v-if="show">
        <div class="command">
            <div class="command-header-bg"></div>
            <div class="command-header">
                <div class="title">
                    <div class="tille-name">输口令开启抽奖</div>
                </div>
                <div class="command-header-right" @click.stop="onClose">
                  <i class="i-close"></i>
                </div>
            </div>
            <div class="container">
                <p class="tips">请务必填写以下信息，奖品才能送到您手中</p>
                <van-form
                    @submit="onSubmit"
                    @failed="onFailed"
                    :show-error="false"
                    :show-error-message="false"
                    :validate-first="true"
                    class="form">
                    <van-field v-model="user.password" name="口令" placeholder="请输入口令" class="form-input"/>
                    <div class="tips">
                        <span >口令提示：{{data.is_pwdTips}}</span>
                    </div>
                    <van-button round block  native-type="submit" class="form-btn">确认</van-button>
                </van-form>
            </div>
            <div class="command-footer"></div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
export default {
  name: 'commandIndex',
  components: {
  },
  props: {
    show: {type: Boolean, require: true},
    id: {
      type: String,
      required: true
    },
    isword: {
      type: Number,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      user: { password: '' },
      formRules: {
        is_pwd: [{ required: true, message: '口令不能为空' }]
      }
    }
  },
  computed: {

  },
  watch: {
    show (newState) {
      console.log(newState, 'newState')
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    }),
    async onSubmit (values) {
      this.$toast.loading({
        message: '提交中...', // 提升文本
        forbidClick: true, // 是否启用遮罩层
        duration: 0 // 展示时长，为0时一直存在
      })
      try {
        const res = await API.getCheckDraw({ query: { id: this.id }, data: { password: this.user.password } })
        this.$toast.success('验证成功')
        this.$emit('update:isword', res.success)
        this.$parent.onDraw()
        this.onClose()
      } catch (error) {
        this.$toast.fail(error.error_message)
        console.log(error)
      }
    },
    onFailed (error) {
      console.log('验证失败', error)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.command-dialog{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .command{
    width: px2rem(600px);
    height: px2rem(524px);
    background: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    .command-header-bg{
      width:100%;
      height: px2rem(192px);
      @include img-retina("~@/assets/lottery/activityRule/propup3.png",
      "~@/assets/lottery/activityRule/propup3@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: top;
      position: absolute;
      top: 0;
      left: 0;
    }
    .command-header{
      width:100%;
      height: px2rem(68px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      .title{
          width: px2rem(360px);
          height:px2rem(68px);
          margin-left: px2rem(120px);
          margin-top: px2rem(-8px);
          // margin-right: auto;
          @include img-retina("~@/assets/lottery/activityRule/title.png",
          "~@/assets/lottery/activityRule/title@2x.png", 100%, 100%);
          background-repeat: no-repeat;
          display: flex;
          justify-content: center;
          z-index: 10px;
          float: left;
      .tille-name{
          height: px2rem(36px);
          opacity: 1;
          font-size: px2rem(36px);
          font-family: SourceHanSansCN, SourceHanSansCN-Medium;
          font-weight: 500;
          text-align: center;
          color: #fff4e3 !important;
          line-height: px2rem(68px);
      }
      }
      .command-header-right{
          width: px2rem(50px);
          height: px2rem(50px);
          padding-right: px2rem(30px);
          padding-top: px2rem(30px);
          float: right;
          cursor: pointer;
          .i-close{
              display: inline-block;
              width: px2rem(20px);
              height: px2rem(20px);
                  @include img-retina("~@/assets/lottery/icon-close.png",
              "~@/assets/lottery/icon-close@2x.png", 100%, 100%);
              background-repeat: no-repeat;
          }
      }
    }
    .container{
      width: 100%;
      height: px2rem(482px);
      position: absolute;
      top: px2rem(68px);
      z-index: 10;
      padding-top: px2rem(50px);
      padding-left: px2rem(40px);
      padding-right: px2rem(40px);
      .tips{
        height: px2rem(24px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: left;
        color: #4f0f0f;
        line-height: px2rem(36px);
      }
      .form{
        margin-top:px2rem(30px);
        .form-input{
          width: px2rem(520px);
          height: px2rem(90px);
          opacity: 1;
          background: #f8efdc;
          border-radius: px2rem(8px);
          margin-bottom:px2rem(30px);
          display: flex;
          align-items: center;
          padding:  0 px2rem(20px);
          /deep/ .van-field__control{
              height: px2rem(40px);
              // opacity: 0.3;
              font-size: px2rem(28px);
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              text-align: left;
              color: #4f0f0f;
              line-height: px2rem(40px);
          }
        }
        .form-btn{
          width: px2rem(300px);
          height: px2rem(80px);
          opacity: 1;
          border: none;
          background: linear-gradient(0deg,#ffdaa3 1%, #ffebc5);
          border-radius: px2rem(16px);
          margin: px2rem(60px) auto;
          box-shadow: 0 px2rem(8px) 0px 0px #e5b56b;
          font-size: px2rem(28px);
          font-family: SourceHanSansCN, SourceHanSansCN-Medium;
          font-weight: 500;
          text-align: left;
          color: #4f0f0f;
        }
      }
    }
    .command-footer{
      width: px2rem(600px);
      height: px2rem(140px);
      border-bottom-left-radius: px2rem(16px);
      border-bottom-right-radius: px2rem(16px);
      opacity: 1;
      @include img-retina("~@/assets/lottery/activityRule/propup4.png","~@/assets/lottery/activityRule/propup4.png", 100%, 100%);
      background-position: bottom;
      background-repeat: no-repeat;
      background-color:#fff9ec;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
