<template>
<div class='party-no-auth'>
  <div v-if="partyNoAuthShow" :class="['check-dialog-wrap', isScroll]">
    <div v-if='noPhoneType || noAuthType' class='party-member-dialog'>
      <div><van-icon name="warning-o" style='font-size: 20px;'/></div>
      <div v-if='noPhoneType' class='title-box'>您的账号暂未绑定手机号，请前往App [个人中心] 先绑 定手机号后再参与活动</div>
      <div v-if='noAuthType'>您绑定的手机号暂无参赛资格，请前往App [个人中心] 更换手机号，或可联系活动方更改党员信息</div>
    </div>
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
    partyNoAuthShow: {
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
    }
  },
  watch: {
    party: {
      handler: function (v) {
        if (v.party_name && v.name && v.party_address) {
          this.canClick = true
        } else {
          this.canClick = false
        }
      },
      deep: true,
      immediate: true
    },
    partyNoAuthShow: {
      handler: function (v) {
        if (v) {
          this.getPartyInfo()
        }
      },
      deep: true,
      immediate: true
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
      noAuthType: false,
      isShowParty: false,
      isShowpartyConfirm: false,
      partyAddressList: []
    }
  },
  methods: {
    async getPartyInfo () {
      let userInfo = STORAGE.get('userinfo')
      if (!userInfo) {
        Toast('获取用户信息失败')
        return
      }
      // 没有手机号 => 未绑定手机
      if (userInfo.mobile === '') {
        this.noPhoneType = true
      }
      if (getPlat() !== 'wechat') {
        await API.getPartyInfo({
          query: {
            id: this.examInfo.id
          }
        }).then(res => {
          if (res && res.mobile) {
            this.isShowParty = true
            this.party = {...res}
          } else {
            this.noAuthType = true
          }
        })
      }
    },
    initStatus () {
      this.noPhoneType = false
      this.noAuthType = false
      this.isShowpartyConfirm = false
    },
    sureCheckDraw () {
      if (this.canClick) {
        this.isShowpartyConfirm = true
      }
    },
    calcelConfirm () {
      this.isShowpartyConfirm = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/styles/index.scss";
  .party-no-auth{
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
      // background: rgba(0,0,0,0.5);
      z-index: 99;
      &.is-noscroll {
        overflow: hidden;
      }
    }
  }
</style>
