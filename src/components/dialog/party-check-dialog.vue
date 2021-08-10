<template>
<div>
  <div v-if="show"
    :class="[
      'check-dialog-wrap',
      isScroll,
      isBtnForbid ? 'forbid-btn-wrap' : '']">
    <div class="check-dialog-content party-dialog-content"
      :class="isShowParty ? 'show' : ''">
      <div class="check-dialog-main">
        <div class="check-header">党员信息验证</div>
        <div class="check-item">
          <el-input v-model="party.name" placeholder="姓名"></el-input>
        </div>
        <div class="check-item">
          <el-input readonly v-model="party.mobile" placeholder="手机号"></el-input>
        </div>
        <div class="check-item">
          <el-input v-model="party.party_name" placeholder="党支部"></el-input>
        </div>
        <div class="check-item">
          <el-select v-model="party.party_address" placeholder="赛区">
            <el-option
              v-for="item in partyAddressList"
              :key="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="tips">以上信息如有错误可直接修改（注意：仅有一次修改机会，所有参赛党员所在党支部名称必须完全一致！否则将视为不同党支部参赛，影响最终积分）</div>
        <div class="submit-btn-wrap color-button_color party" :class="canClick?'canClick':''"  @click.stop="sureCheckDraw()">确认</div>
        <div class="close-btn" @click.stop="closeCheckDraw()"></div>
      </div>
    </div>

    <div v-if='noPhoneType || noAuthType' class='party-member-dialog'>
      <div><van-icon name="warning-o" style='font-size: 20px;'/></div>
      <div v-if='noPhoneType' class='title-box'>您的账号暂未绑定手机号，请前往App [个人中心] 先绑 定手机号后再参与活动</div>
      <div v-if='noAuthType'>您绑定的手机号暂无参赛资格，请前往App [个人中心] 更换手机号，或可联系活动方更改党员信息</div>
    </div>
  </div>
  <div :class="['check-dialog-wrap', isScroll]" v-if="isShowpartyConfirm" class="party-confirm-dialog">
    <div class="check-dialog-content party-dialog-content" :class="isShowParty ? 'show' : ''">
      <div class="check-dialog-main">
        <div class="check-header">操作提示</div>
        <div class="confirm-content">
        {{ isShowPartyCheckClick ? '确认现在提交您的党员信息吗，仅有一次修改机会， 确认后党员信息不可更改。' : '确认现在提交您的党员信息吗， 点击“确认”会直接进入答题流程， 开始答题后党员信息不可更改。' }}
        </div>
        <div class="confirm-btn-wrap">
          <div class="cancle-btn" @click.stop="calcelConfirm()">取消</div>
          <div class="submit-btn" @click.stop="sureConfirm()">确认</div>
        </div>
        <div class="close-btn" @click.stop="calcelConfirm()"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Select, Option } from 'element-ui'
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
    isShowPartyCheckClick: {
      type: Boolean,
      default: false
    },
    checkDraw: {
      type: Array,
      default: () => {
        return []
      }
    },
    isInitType: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ElSelect: Select,
    ElOption: Option
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
      curIndex: '---',
      curdata: '000',
      party: {},
      canClick: false,
      noPhoneType: false,
      noAuthType: false,
      isShowParty: false,
      isShowpartyConfirm: false,
      partyAddressList: [],
      isBtnForbid: false
    }
  },
  watch: {
    party: {
      handler: function (v) {
        console.log(v, 'party-handler')
        if (v.party_name && v.name && v.party_address) {
          this.canClick = true
        } else {
          this.canClick = false
        }
      },
      deep: true,
      immediate: true
    },
    show: {
      handler: function (v) {
        if (v) {
          this.getPartyInfo()
        }
      },
      deep: true,
      immediate: true
    }
    // isInitType: {
    //   handler: function (data) {
    //     // this.curdata = data
    //     this.getPartyInfo()
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    closeCheckDraw () {
      this.initStatus()
      this.$emit('close')
    },
    async getPartyAddress () {
      await API.getPartyGameArea({
        query: {
          id: this.examInfo.id
        }
      }).then(res => {
        if (res) {
          this.partyAddressList = res
        }
      })
    },
    async getPartyInfo () {
      let userInfo = STORAGE.get('userinfo')
      if (!userInfo) {
        Toast('获取用户信息失败')
        return
      }
      // this.curMobile = userInfo.mobile
      // 没有手机号 => 未绑定手机
      if (userInfo.mobile === '') {
        this.noPhoneType = true
        this.$emit('isBtnForbidFun', true)
        this.isBtnForbid = true
        return false
      }

      if (getPlat() !== 'wechat') {
        this.getPartyAddress()
        await API.getPartyInfo({
          query: {
            id: this.examInfo.id
          }
        }).then(res => {
          if (res && res.mobile) {
            this.party = {...res}
            if (!this.isInitType) {
              // 初始进入 不需要党员弹窗
              this.isShowParty = true
            } else {
              // 初次 关闭弹窗
              this.closeCheckDraw()
            }
          } else {
            this.$emit('isBtnForbidFun', true)
            this.isBtnForbid = true
            this.noAuthType = true
          }
        })
      }
    },
    async savePartyInfo () {
      await API.saveDrawRecord({
        query: {
          id: this.examInfo.id
        },
        data: {
          name: this.party.name,
          party_name: this.party.party_name,
          party_address: this.party.party_address
        }
      }).then(res => {
        if (res.success) {
          this.closeCheckDraw()
          if (!this.isShowPartyCheckClick) {
            this.$emit('success')
          }
        }
      }).catch(err => {
        if (err.error_code === 'collect_member_fail') {
          Toast('手机号验证失败,请联系管理员!')
        }
      })
    },
    initStatus () {
      this.noPhoneType = false
      this.noAuthType = false
      this.isShowpartyConfirm = false

      this.isBtnForbid = false
      this.isInitType = false
      this.isShowParty = false
    },
    sureCheckDraw () {
      if (this.canClick) {
        this.isShowpartyConfirm = true
      }
    },
    calcelConfirm () {
      this.isShowpartyConfirm = false
    },
    sureConfirm () {
      this.savePartyInfo()
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .forbid-btn-wrap{
    height: px2rem(112px) !important;
    background: rgba(0, 0, 0, 0.3) !important;
  }

  .disabled-dialog-wrap {
    height: 0
  }
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
      &.party-dialog-content {
        display:none;
      }
      max-height: 100vh;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      padding-top: px2rem(30px);
      &.show {
        display:block!important;
      }
      .check-dialog-main {
        position:relative;
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
        .tips {
          color:#FF6A45;
          font-size: px2rem(24px);
          width:100%;
        }
        .check-item {
          width: 100%;
          margin-bottom: px2rem(30px);
          position: relative;
          .el-select {
            width:100%!important;
          }
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
          .el-input .el-input__inner[readonly] {
            color: #333333!important;
            background-color: #FBFBFB;
            border: 1px solid #DBDBDB;
          }
          .el-input .el-input__inner {
            height: px2rem(90px);
            line-height: px2rem(90px);
          }
          .el-input.is-disabled .el-input__inner {
            color: #333333!important;
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
          width: px2rem(305px)!important;
          margin-top: px2rem(44px);
          height: px2rem(90px);
          line-height: px2rem(90px);
          text-align: center;
          border-radius: px2rem(12px)!important;
          @include font-dpr(16px);
          color: #fff;
          &.party{
            background-color: #ccc!important;
          }
          &.party.canClick{
            background-color: #FFA800!important;
          }
        }
        .close-btn {
          position: absolute;
          top: px2rem(40px);
          right: px2rem(40px);
          display: inline-block;
          width: px2rem(24px);
          height: px2rem(24px);
          background-size: px2rem(80px);
          @include img-retina("~@/assets/common/close@2x.png","~@/assets/common/close@3x.png", 100%, 100%);
        }
      }
    }
  }
  .party-confirm-dialog {
    .check-dialog-main {
        width: px2rem(500px);
        .confirm-content {
          font-size:px2rem(28px);
        }
        .confirm-btn-wrap {
          display:flex;
          width:100%!important;
          height: px2rem(80px);
          margin-bottom:px2rem(60px);
          .cancle-btn {
            width: px2rem(220px);
            margin-top: px2rem(50px);
            margin-left: px2rem(20px);
            height: px2rem(80px);
            line-height: px2rem(80px);
            text-align: center;
            border-radius: px2rem(12px);
            @include font-dpr(16px);
            color: #FFA800;
            background-color:#FFF1D7;
          }
          .submit-btn {
            width: px2rem(220px);
            margin-top: px2rem(50px);
            margin-left:px2rem(40px);
            height: px2rem(80px);
            line-height: px2rem(80px);
            text-align: center;
            border-radius: px2rem(12px);
            @include font-dpr(16px);
            color: #fff;
            background-color:#FFA800;
          }
        }
    }
  }
</style>
