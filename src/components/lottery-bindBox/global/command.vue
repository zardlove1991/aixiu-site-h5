<template>
    <div class='command-dialog'  v-if="show">
        <div class="command-header-bg">
            <div class="title">输入口令开奖</div>
            <div class="close-wrap" @click.stop="onClose">
                <i class="close"></i>
            </div>
        </div>
        <div class="command">
            <div class="container">
                <div class="tip">请务必填写以下信息，奖品才能送到您手中</div>
                <van-form
                    @submit="onSubmit"
                    @failed="onFailed"
                    :show-error="false"
                    :show-error-message="false"
                    :validate-first="true"
                    class="form">
                    <van-field v-model="user.password" name="口令" placeholder="请输入口令" class="form-input"/>
                    <div class="tips">
                        <!-- <span >口令提示：恭喜发财</span> -->
                        <span >口令提示：{{data.is_pwdTips}}</span>
                    </div>
                    <van-button round block  native-type="submit" class="form-btn">确认</van-button>
                </van-form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
export default {
  name: '',
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
<style lang="scss">
.command-dialog{
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: rgba(255, 255, 255, .5);
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    color: rgba(255, 255, 255, .5);
  }
  input::-moz-placeholder, textarea::-moz-placeholder {
    color: rgba(255, 255, 255, .5);
  }
  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    color: rgba(255, 255, 255, .5);
  }
}
</style>
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
    height: px2rem(440px);
    position: relative;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: 0 0  px2rem(32px) px2rem(32px);
    background: linear-gradient(179deg,#d460e3 0%, #9054ff 100%);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    margin-top: px2rem(-20px);
    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: -1;
        margin: px2rem(-8px);
        border-radius: inherit; /*important*/
        background: linear-gradient(181deg, #af36da 1%, rgba(98,31,212,0.00) 67%) 8 8;
        filter: blur(px2rem(10px));
        -webkit-filter: blur(px2rem(10px));
        -moz-filter: blur(px2rem(10px));
        -ms-filter: blur(px2rem(10px));
    }
    .container{
        width: 100%;
        height: 100%;
        padding-left: px2rem(41px);
        padding-top: px2rem(40px);
        .tip{
            width: px2rem(456px);
            height: px2rem(24px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: left;
            color: #ffffff;
            line-height: px2rem(24px);
            margin-bottom: px2rem(30px);
        }
        .form{
            margin-top:px2rem(30px);
            .form-input{
                width: px2rem(520px);
                height: px2rem(90px);
                opacity: 1;
                background: rgba(255, 255, 255, .5);;
                border-radius: px2rem(8px);
                margin-bottom:px2rem(30px);
                display: flex;
                align-items: center;
                padding:  0 px2rem(20px);
                outline: none;
                border: none;
                &::after{
                    border-bottom: none;
                }
            /deep/ .van-field__control{
                height: px2rem(40px);
                // opacity: 0.3;
                font-size: px2rem(28px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #ffffff;
                line-height: px2rem(40px);
            }
            }
            .form-btn{
                width: px2rem(300px);
                height: px2rem(80px);
                opacity: 1;
                border: none;
                background: linear-gradient(0deg,#ffa243, #ffe490);
                border-radius: px2rem(40px);
                margin: px2rem(60px) auto;
                font-size: px2rem(28px);
                font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                font-weight: 500;
                text-align: left;
                color: #431744;
            }
        }
        .tips{
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: left;
            color: #ffffff;
            line-height: px2rem(24px)
        }
    }
  }
  .command-header-bg{
    width: px2rem(676px);
    height: px2rem(225px);
    @include img-retina("~@/assets/lottery-bindBox/hedader-bg-2.png",
    "~@/assets/lottery-bindBox/hedader-bg-2@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    position: relative;
    .title{
        width: px2rem(216px);
        height: px2rem(36px);
        font-size: px2rem(36px);
        font-family: SourceHanSansCN, SourceHanSansCN-Bold;
        font-weight: 700;
        text-align: center;
        color: #ffffff;
        line-height: px2rem(36px);
        margin-top: px2rem(143px);
        margin-left: auto;
        margin-right: auto;
    }
    .close-wrap{
        position: absolute;
        bottom: 0; right: 0;
        display: block;
        width: px2rem(73px);
        height: px2rem(79px);
        padding-right: px2rem(53px);
        padding-bottom: px2rem(58px);
        .close{
            display: inline-block;
            width: px2rem(20px);
            height: px2rem(20px);
            @include img-retina("~@/assets/lottery-bindBox/close-white.png",
            "~@/assets/lottery-bindBox/close-white@2x.png", 100%, 100%);
            background-repeat: no-repeat;
        }
    }
  }
}
</style>
