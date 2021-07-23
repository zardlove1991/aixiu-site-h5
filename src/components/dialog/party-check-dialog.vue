<template>
  <div :class="['check-dialog-wrap', isScroll]" v-if="show">
    <div class="check-dialog-content" :class="isShowVideo ? 'show-video' : ''" v-if='!noPhoneType || !noAuthType'>
      <div class="check-dialog-main">
        <div class="check-header">党员信息验证</div>
        <div class="check-item">
          <el-input :disabled="true" v-model="party.name"></el-input>
        </div>
        <div class="check-item">
          <el-input :disabled="true" v-model="party.mobile"></el-input>
        </div>
        <div class="check-item">
          <el-input :disabled="true" v-model="party.party_name"></el-input>
        </div>
        <div class="check-item">
          <el-input :disabled="true" v-model="party.party_address"></el-input>
        </div>
        <div class="submit-btn-wrap color-button_color party" :class="canClick?'canClick':''"  @click.stop="sureCheckDraw()">确认</div>
      </div>
      <div class="close-btn-wrap">
        <div class="close-btn" @click.stop="closeCheckDraw()"></div>
      </div>
    </div>

    <div v-if='noPhoneType || noAuthType' class='party-member-dialog'>
      <div><van-icon name="warning-o" style='font-size: 20px;'/></div>
      <div v-if='noPhoneType' class='title-box'>您的账号暂未绑定手机号，请前往App [个人中心] 先绑 定手机号后再参与活动</div>
      <div v-if='noAuthType'>您绑定的手机号暂无参赛资格，请前往App [个人中心] 更换手机号，或可联系活动方更改党员信息</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import API from '@/api/module/examination'
import { Toast } from 'mint-ui'
import { getPlat } from '@/utils/utils'
import STORAGE from '@/utils/storage'

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
    },
    isShowVideo: {
      type: Boolean,
      default: false
    },
    isGetDept: {
      type: Boolean,
      default: false
    },
    examId: {
      type: String,
      default: ''
    }
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
  data () {
    return {
      party: {},
      canClick: false,
      noPhoneType: false,
      noAuthType: false
    }
  },
  methods: {
    closeCheckDraw () {
      this.initStatus()
      this.$emit('close')
    },
    async getPartyInfo () {
      let userInfo = STORAGE.get('userinfo')
      if (!userInfo) {
        Toast('获取用户信息失败')
        return
      }
      // 没有手机号 => 未绑定手机
      if (userInfo.mobile === '') {
        this.noPhoneType = true
        return false
      }
      if (getPlat() !== 'wechat') {
        await API.saveDrawRecord({
          query: {
            id: this.examInfo.id
          }
        }).then(res => {
          this.party = {...res}
          if (res.error_code !== undefined && res.error_code === 'collect_member_fail') {
            this.noAuthType = true
          }
        })
      }
    },
    initStatus () {
      this.noPhoneType = false
      this.noAuthType = false
    },
    sureCheckDraw () {
      if (this.canClick) {
        this.initStatus()
        this.$emit('close')
        this.$emit('success')
      }
    }
  },
  watch: {
    party: {
      handler: function (v) {
        if (v.party_name) {
          this.canClick = true
        }
      },
      deep: true,
      immediate: true
    },
    show: {
      handler: function (v) {
        if (v) {
          console.log('8989')
          this.getPartyInfo()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";

  .party-member-dialog{
    position: fixed;
    top: 0;
    width: 100vw;
    height: px2rem(112px);
    color: #D85F40;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 px2rem(30px);
    .title-box{
      margin-left: px2rem(10px);
    }
  }
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
      &.show-video {
        margin-top: px2rem(414px);
      }
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
          .el-input.is-disabled .el-input__inner {
            color: #ccc;
            border: 1px solid #DBDBDB;
            background-color: #FBFBFB;
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
          .drop-icon {
            position: absolute;
            right: px2rem(28px);
            top: px2rem(35px);
            width: px2rem(30px);
            height: px2rem(16px);
            background-size: px2rem(30px) px2rem(16px);
            @include img-retina("~@/assets/common/dropdown-icon@2x.png","~@/assets/common/dropdown-icon@3x.png", 100%, 100%);
          }
          .get-code {
            position: absolute;
            right: px2rem(28px);
            top: px2rem(25px);
            @include font-dpr(14px);
            // color: #FF6A45;
            @include font-color('btnColor');
            &.get-code-video {
              @include font-color('highColor');
            }
          }
        }
        .submit-btn-wrap {
          width: 100%;
          margin-top: px2rem(44px);
          height: px2rem(80px);
          line-height: px2rem(80px);
          text-align: center;
          border-radius: px2rem(40px);
          @include font-dpr(14px);
          color: #fff;
          &.party{
            background-color: #ccc!important;
          }
          &.party.canClick{
            background-color: #FC7465!important;
          }
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
