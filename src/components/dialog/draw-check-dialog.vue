<template>
  <div :class="['check-dialog-wrap', isScroll]" v-if="show">
    <div class="check-dialog-content">
      <div class="check-dialog-main">
        <div class="check-header">答题验证</div>
        <div class="check-item" v-for="(item, index) in checkDraw" :key="index">
          <el-input
            :placeholder="item.name"
            :type="item.type"
            :maxlength="item.maxlength"
            :readonly="item.unique_name === 'gender' || item.unique_name === 'birthday' || item.unique_name === 'address'"
            @focus="focusAction(item.unique_name)"
            @blur="blurAction()"
            v-model="checkData[item.unique_name]"></el-input>
          <div
            v-if="item.unique_name === 'mobile' &&  codeTime === 0"
            class="get-code"
            @click="getCode()">获取验证码</div>
          <div
            v-if="item.unique_name === 'mobile' && codeTime !== 0"
            class="get-code">{{codeTime}}秒</div>
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
    <select-dialog
      :show="isShowSelect"
      :defaultSelect="defaultSelect"
      :selectData="selectData"
      @close="isShowSelect = false"
      @success="selectSuccessAction">
    </select-dialog>
    <date-select-dialog
      :show="isShowDateSelect"
      @close="isShowDateSelect = false"
      @success="selectSuccessAction">
    </date-select-dialog>
    <city-select-dialog
      :show="isShowCitySelect"
      @close="isShowCitySelect = false"
      @success="selectSuccessAction">
    </city-select-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import API from '@/api/module/examination'
import { Toast } from 'mint-ui'
import SelectDialog from '@/components/dialog/select-dialog'
import DateSelectDialog from '@/components/dialog/date-select-dialog'
import CitySelectDialog from '@/components/dialog/city-select-dialog'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    checkDraw: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    SelectDialog, DateSelectDialog, CitySelectDialog
  },
  computed: {
    isScroll () {
      if (this.isShowSelect || this.isShowDateSelect || this.isShowCitySelect) {
        return 'is-noscroll'
      }
      return ''
    },
    ...mapGetters('depence', ['examInfo'])
  },
  watch: {
    show (newState) {
      if (!newState) {
        this.checkData = {}
        this.imgCodeUrl = ''
        this.imgCodeKey = ''
        this.clearSetInterval()
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
      imgCodeKey: '', // 图形验证码的key
      isShowSelect: false, // 性别
      isShowDateSelect: false, // 日期选择器
      isShowCitySelect: false,
      selectData: [],
      defaultSelect: '',
      focusKey: '',
      codeTime: 0,
      codeTimer: null,
      totalTime: 60
    }
  },
  methods: {
    focusAction (key) {
      this.focusKey = key
      if (key === 'gender') {
        this.isShowSelect = true
        this.defaultSelect = '男'
        this.selectData = [{
          flex: 1,
          values: ['男', '女'],
          className: 'gender-select',
          defaultIndex: 0
        }]
      } else if (key === 'birthday') {
        this.isShowDateSelect = true
      } else if (key === 'address') {
        this.isShowCitySelect = true
      }
    },
    blurAction () {
      document.body.scrollTop = 0
    },
    selectSuccessAction (val) {
      let key = this.focusKey
      if (key === 'gender') {
        this.checkData.gender = val
        this.isShowSelect = false
      } else if (key === 'birthday') {
        this.checkData.birthday = val
        this.isShowDateSelect = false
      } else if (key === 'address') {
        this.checkData.address = val
        this.isShowCitySelect = false
      }
    },
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
    getCodeTimer () {
      let codeTime = this.codeTime
      if (codeTime === 0) {
        // console.log('codeTime')
        this.getImgCode()
        this.clearSetInterval()
      } else {
        codeTime--
        this.codeTime = codeTime
        // console.log(this.codeTime)
        this.clearSetInterval()
        this.codeTimer = setTimeout(() => {
          this.getCodeTimer()
        }, 1000)
      }
    },
    getCode () {
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
          this.getImgCode()
          Toast(res.ErrorText)
          return
        }
        Toast('已发送验证码')
        this.codeTime = this.totalTime
        this.clearSetInterval()
        this.getCodeTimer()
      })
    },
    clearSetInterval () {
      if (this.codeTimer) {
        clearInterval(this.codeTimer)
      }
    },
    sureCheckDraw () {
      let checkData = this.checkData
      let examInfo = this.examInfo
      let checkDraw = this.checkDraw
      if (!examInfo) {
        Toast('请刷新重试')
        return
      }
      let flag = true
      for (let item of checkDraw) {
        let key = item.unique_name
        let val = checkData[key]
        if (!val) {
          Toast('请输入' + item.name)
          flag = false
          break
        }
      }
      if (!flag) {
        return
      }
      let data = {
        activity_id: examInfo.id,
        activity_mark: 'examination',
        ...checkData
      }
      API.saveDrawRecord({
        data
      }).then(res => {
        if (res.ErrorCode) {
          this.getImgCode()
          Toast(res.ErrorText)
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
    &.is-noscroll {
      overflow: hidden;
    }
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
        width: px2rem(620px);
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
            -webkit-appearance: none;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: px2rem(4px);
            padding: px2rem(20px);
            @include font-dpr(14px);
            color: #333;
            border: 1px solid #dadada;
            &::placeholder {
              @include font-dpr(14px);
              color: #999;
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
            // color: #FF6A45;
            @include font-color('btnColor');
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
