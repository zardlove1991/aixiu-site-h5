<template>
     <div class='address-dialog' v-if="show"  v-fixed>
         <div class="address-wrap" >
            <div class="address-header-bg"></div>
            <div class="address-header">
                <div class="title">
                    <div class="tille-name">收货地址</div>
                </div>
                <div class="address-header-right" @click.stop="onClose">
                  <i class="i-close"></i>
                </div>
            </div>
            <div class="container" >
                <p class="tips">请务必填写以下信息，奖品才能送到您手中</p>
                <van-form
                    @submit="onSubmit"
                    @failed="onFailed"
                    :show-error="false"
                    :show-error-message="false"
                    :validate-first="true"
                    class="form"
                    >
                    <van-field
                        v-model="user.name"
                        name="真实姓名"
                        placeholder="真实姓名"
                        :rules="formRules.name"
                        class="form-input"
                    />
                    <van-field
                        v-model="user.mobile"
                        name="手机号"
                        placeholder="手机号"
                        :rules="formRules.mobile"
                        :maxlength="11"
                        class="form-input"
                    />
                    <van-field
                        type="textarea"
                        v-model="user.address"
                        name="详细地址"
                        placeholder="详细地址"
                        :rules="formRules.address"
                        class="address"
                        autosize
                    />
                    <div class="form-sub">
                        <van-button round block  native-type="submit" class="form-btn"
                        >确认</van-button
                        >
                    </div>
                </van-form>
            </div>
            <div class="address-footer"></div>
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
    activityId: {
      type: String,
      require: true
    },
    prize: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      user: { name: '', mobile: '', address: '' },
      formRules: {
        name: [{ required: true, message: '真实姓名不能为空' }],
        mobile: [
          { required: true, message: '手机号不能为空' },
          {
            pattern:
              /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号格式错误'
          }
        ],
        address: [{ required: true, message: '详细地址不能为空' }]
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
  directives: {
    fixed: {
      // inserted 被绑定元素插入父节点时调用
      inserted () {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
      },
      // unbind 指令与元素解绑时调用
      unbind () {
        let body = document.body
        body.style.position = ''
        let top = body.style.top
        document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
        body.style.top = ''
      }
    }
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
        const res = await API.getAddress({
          query: { id: this.activityId },
          data: {
            code: this.prize.code,
            name: this.user.name,
            mobile: this.user.mobile,
            address: this.user.address
          }
        })
        if (res.success === 1) {
          this.$toast.success('保存成功')
          this.user.name = ''
          this.user.mobile = ''
          this.user.address = ''
          // await API.getLotteryDetail({ query: { id: this.activityId } })
          this.onClose()
        }
      } catch (error) {
        this.$toast.fail(error.error_message)
        // console.log(error)
      }
    },
    onFailed (error) {
      console.log('验证失败', error)
      this.$toast({
        message: error.errors[0].message
      })
    }
  }
}
</script>
<style lang="scss">
.address-dialog {
  textarea{
    -webkit-user-select: auto !important;
  }
  /deep/.address {
    .van-field__control{
      -webkit-user-select: auto !important;
    }
  }
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: rgba(79, 15, 15, .3);
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    color: rgba(79, 15, 15, .3);
  }
  input::-moz-placeholder, textarea::-moz-placeholder {
    color: rgba(79, 15, 15, .3);
  }
  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    color: rgba(79, 15, 15, .3);
  }
}
</style>
<style scoped lang="scss">
@import "@/styles/index.scss";
.address-dialog{
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
  .address-wrap{
    width: px2rem(600px);
    // height: px2rem(580px);
    height: px2rem(760px);
    background: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    .address-header-bg{
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
    .address-header{
      width:100%;
      height: px2rem(68px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      .title{
        width: px2rem(297px);
        height:px2rem(68px);
        margin-left: px2rem(152px);
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
            width: px2rem(280px);
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
      .address-header-right{
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
    .container {
      width: 100%;
      height: px2rem(692px);
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
        line-height: px2rem(24px);
      }
      .form{
        margin-top:px2rem(30px);
        height: px2rem(588px);
        .form-input{
            width: px2rem(520px);
            height: px2rem(90px);
            opacity: 1;
            background: #f8efdc;
            border-radius: px2rem(8px);
            margin-bottom:px2rem(30px);
            display: flex;
            align-items: center;
            padding:  0 px2rem(30px);
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
        .form-textarea{
            width: px2rem(520px);
            height: px2rem(140px);
            opacity: 1;
            background: #f8efdc;
            border-radius: px2rem(8px);
            padding:  0 px2rem(30px);
            overflow-y: auto;
            margin-bottom:px2rem(60px);
        }
        .form-btn{
            width: px2rem(300px);
            height: px2rem(80px);
            opacity: 1;
            background: linear-gradient(0deg,#ffdaa3 1%, #ffebc5);
            border-radius: px2rem(16px);
            margin: auto;
            border: none;
            // box-shadow: 0 10px 8px -8px #ECBD7B;
            box-shadow: 0 px2rem(8px) 0px 0px #e5b56b;
            font-size: px2rem(28px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: left;
            color: #4f0f0f;
        }
        .form-sub{
            margin: px2rem(60px) auto;
        }
        .address {
            padding:  0 px2rem(30px);
            padding-top: px2rem(10px);
            background: #f8efdc;
            border-radius: px2rem(8px);
            margin-bottom:px2rem(30px);
        }
      }
    }
    .address-footer{
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
