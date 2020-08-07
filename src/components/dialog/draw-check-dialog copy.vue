<template>
  <div class="check-dialog-wrap" v-if="show">
    <div class="check-dialog-content">
      <div class="check-dialog-main">
        <div class="check-header">答题验证</div>
        <div class="check-item" v-for="(item, index) in checkDraw" :key="index">
          <el-input
            :placeholder="item.name"
            :type="item.type"
            :maxlength="20"
            v-model="checkData[item.unique_name]"></el-input>
          <div class="get-img-code"
            v-if="item.unique_name === 'imgCode'"
            @click.stop="getImgCode()"
            :style="{ backgroundImage: 'url(' + imgCodeUrl + ')'}"></div>
        </div>
        <div class="submit-btn-wrap color-button_color" @click.stop="sureCheckDraw()">确认</div>
      </div>
      <div class="close-btn-wrap">
        <div class="close-btn" @click.stop="closeCheckDraw()"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
import { Toast } from 'mint-ui'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    checkDraw: {
      type: Array,
      default: () => {
        return [{
          key: 'name',
          title: '姓名',
          type: 'text'
        }, {
          key: 'gender',
          title: '年龄',
          type: 'textarea'
        }]
      }
    }
  },
  watch: {
    show (newState) {
      if (!newState) {
        this.checkData = {
          name: '',
          gender: '',
          mobile: '',
          imgCode: '',
          code: '',
          birthday: '',
          email: '',
          address: ''
        }
        this.imgCodeUrl = ''
        this.imgCodeKey = ''
      }
      // 更改当前是否显示遮罩的状态
      this.setModelThumbState(newState)
    },
    checkDraw: {
      handler (val) {
        this.getImgCode()
      },
      deep: true
    }
  },
  data () {
    return {
      checkData: {}, // 输入的表单内容
      imgCodeUrl: '', // 图形验证码图片地址
      imgCodeKey: '' // 图形验证码的key
    }
  },
  methods: {
    getImgCode () {
      API.getCaptchaCode().then(res => {
        let { key, img } = res
        this.imgCodeUrl = img
        this.imgCodeKey = key
      })
    },
    closeCheckDraw () {
      this.$emit('close')
    },
    getCode () {
      // console.log('getCode')
      let imgCodeKey = this.imgCodeKey
      let { mobile, imgCode } = this.checkData
      if (!mobile) {
        Toast('请输入手机号')
        return
      }
      if (!imgCode) {
        Toast('请输入图片验证码')
        return
      }
      if (!imgCodeKey) {
        Toast('图片验证码已过期')
        return
      }
      let params = {
        mobile: mobile,
        sign: 'mobile',
        captcha: imgCode,
        captcha_key: imgCodeKey
      }
      API.getMobileSend({
        params
      }).then(res => {
        if (res.ErrorCode) {
          Toast(res.ErrorText)
          return
        }
        Toast('已发送验证码')
      })
    },
    sureCheckDraw () {
      let checkDraw = this.checkDraw
      console.log('sureCheckDraw', checkDraw)
      let checkData = this.checkData
      let data = {
        activity_id: '',
        activity_mark: '',
        ...checkData
      }
      API.collectInfo({
        data
      }).then(res => {
        if (res.error_code) {
          Toast(res.error_message)
          return
        }
        this.$emit('close')
        this.$emit('success')
      })
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
    overflow-y: auto;
    background: rgba(0,0,0,0.5);
    z-index: 99;
    .check-dialog-content {
      max-height: 100vh;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      padding-top: px2rem(30px);
      .check-dialog-main {
        margin: 0 auto;
        background-color: #fff;
        width: px2rem(600px);
        border-radius: px2rem(8px);
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
          position: relative;
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
          .get-img-code {
            position: absolute;
            right: px2rem(28px);
            top: px2rem(15px);
            width: px2rem(180px);
            height: px2rem(60px);
            background-size: px2rem(180px) px2rem(60px);
          }
          .get-code {
            position: absolute;
            right: px2rem(28px);
            top: px2rem(25px);
            @include font-dpr(14px);
            color: #FF6A45;
          }
        }
        .submit-btn-wrap {
          width: 100%;
          margin-top: px2rem(44px);
          height: px2rem(80px);
          line-height: px2rem(80px);
          text-align: center;
          border-radius: px2rem(40px);
          // background-color: #FC7465;
          @include bg-color('btnColor');
          @include font-dpr(14px);
          color: #fff;
        }
      }
      .close-btn-wrap {
        margin-top: px2rem(60px);
        margin-bottom: px2rem(30px);
        width: 100%;
        text-align: center;
        .close-btn {
          display: inline-block;
          width: px2rem(80px);
          height: px2rem(80px);
          background-size: px2rem(80px);
          @include img-retina("~@/assets/common/luck-draw-close@2x.png","~@/assets/common/luck-draw-close@3x.png", 100%, 100%);
        }
      }
    }
  }
</style>
