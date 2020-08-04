<template>
  <div class="check-dialog-wrap"
    v-if="show"
    @touchmove.prevent="">
    <div class="scroll-wrap">
      <div class="check-dialog-content">
        <div class="check-dialog-main">
          <div class="check-header">投票验证</div>
          <div class="check-item" v-if="checkVote.name">
            <el-input placeholder="姓名" v-model="checkData.name"></el-input>
          </div>
          <div class="check-item" v-if="checkVote.sex">
            <el-input placeholder="性别" v-model="checkData.sex"></el-input>
          </div>
          <div class="check-item" v-if="checkVote.phone">
            <el-input placeholder="手机号" v-model.number="checkData.phone"></el-input>
          </div>
          <div class="check-item" v-if="checkVote.code">
            <el-input placeholder="图形验证码" maxlength="10" v-model="checkData.imgCode"></el-input>
            <div class="get-img-code"
              @click.stop="getImgCode()"
              :style="{ backgroundImage: 'url(' + imgCodeUrl + ')'}"></div>
          </div>
          <div class="check-item" v-if="checkVote.code">
            <el-input placeholder="验证码" maxlength="10" v-model="checkData.code"></el-input>
            <div class="get-code" @click="getCode()">获取验证码</div>
          </div>
          <div class="check-item" v-if="checkVote.birthday">
            <el-input placeholder="生日" v-model="checkData.birthday"></el-input>
          </div>
          <div class="check-item" v-if="checkVote.email">
            <el-input placeholder="邮箱" v-model="checkData.email"></el-input>
          </div>
          <div class="check-item" v-if="checkVote.address">
            <el-input placeholder="详细地址" type="textarea" v-model="checkData.address"></el-input>
          </div>
          <div class="submit-btn-wrap color-button_color" @click="sureCheckVote()">
            <span class="menu-text color-button_text">确认</span>
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
import API from '@/api/module/examination'
import { Toast } from 'mint-ui'

export default {
  components: {
    TipsDialog
  },
  props: {
    voteId: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    checkVote: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    show (newState) {
      if (!newState) {
        this.checkData = {
          name: '',
          sex: '',
          phone: '',
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
    checkVote: {
      handler (val) {
        this.getImgCode()
      },
      deep: true
    }
  },
  data () {
    return {
      checkData: {
        name: '',
        sex: '',
        phone: '',
        imgCode: '',
        code: '',
        birthday: '',
        email: '',
        address: ''
      },
      imgCodeUrl: '',
      imgCodeKey: ''
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
    closeCheckVote () {
      this.$emit('close')
    },
    getCode () {
      console.log('getCode')
      let imgCodeKey = this.imgCodeKey
      let { phone, imgCode } = this.checkData
      if (!phone) {
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
        mobile: phone,
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
    sureCheckVote () {
      let checkVote = this.checkVote
      let checkData = this.checkData
      if (checkVote.name && !checkData.name) {
        Toast('请输入姓名')
        return
      }
      if (checkVote.sex && !checkData.sex) {
        Toast('请输入性别')
        return
      }
      if (checkVote.phone && !checkData.phone) {
        Toast('请输入手机号')
        return
      }
      if (checkVote.code && !checkData.code) {
        Toast('请输入验证码')
        return
      }
      if (checkVote.birthday && !checkData.birthday) {
        Toast('请输入生日')
        return
      }
      if (checkVote.email && !checkData.email) {
        Toast('请输入详细地址')
        return
      }
      if (checkVote.address && !checkData.address) {
        Toast('请输入邮箱')
        return
      }
      API.collectInfo({
        query: {
          id: this.voteId
        },
        data: checkData
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
    background: rgba(0,0,0,0.5);
    z-index: 99;
    display: flex;
    align-items: center;
    .scroll-wrap {
      padding: px2rem(50px) 0;
      width: 100%;
      // height: 100%;
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
          .menu-text {
            @include font-dpr(14px);
            color: #fff;
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
