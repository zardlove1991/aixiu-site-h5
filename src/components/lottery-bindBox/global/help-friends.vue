<template>
<div class='help-friends-dialog' v-if="show">
  <div class="help-friends">
    <div class="help-friends-header">
      <div class="title">助力好友</div>
    </div>
  <div class="closw-wrap" @click.stop="onClose">
        <i class="close"></i>
    </div>
    <div class="container">
      <div class="slogan">万水千山总是情 帮Ta助力行不行</div>
      <van-button  block  class="btns" @click="onHelp">立即助力</van-button>
    </div>
  </div>
  <HelpSuccess :show.sync="isHelpSuccessShow" v-if="isHelpSuccessShow" @close='isHelpSuccessShow = false' :activityId='activityId' :firend='firend'/>
</div>
</template>

<script>
import HelpSuccess from '@/components/lottery-bindBox/global/help-success' // 助力成功
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
export default {
  name: '',
  components: {
    HelpSuccess
  },
  props: {
    show: {type: Boolean, require: true},
    activityId: {type: String, require: true},
    firend: {type: Object, require: true}
  },
  data () {
    return {
      isHelpSuccessShow: false
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
    async onHelp () {
      try {
        const res = await API.getHelpTip({
          query: { id: this.activityId },
          data: {
            help_member_id: this.firend.memberId,
            help_nick_name: this.firend.nickName,
            help_images: this.firend.images,
            help_source: this.firend.source
          }
        })
        console.log(res)
        if (res.error_code === 'invite_is_null') {
          this.$toast(res.error_message)
        } else if (res.error_code === 'own_help_failed') {
          this.$toast(res.error_message)
        } else if (res.error_message === 'close_help_tip') {
          this.$toast(res.error_message)
        } else if (res.success === 1) {
          this.$toast('助力成功')
          this.isHelpSuccessShow = true
          this.onClose()
        }
      } catch (error) {
        // this.$toast(error.error_message)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.help-friends-dialog{
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
  .help-friends{
    width: px2rem(600px);
    height: px2rem(540px);
    position: relative;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: px2rem(24px);
    background: #f6eaf9;
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    .closw-wrap{
      width: px2rem(50px);
      height: px2rem(50px);
      position: absolute;
      right: 0; top: 0;
      padding-top: px2rem(30px);
      padding-right: px2rem(30px);
      z-index: 10;
      .close {
        display: inline-block;
        width: px2rem(20px);
        height: px2rem(20px);
        @include img-retina("~@/assets/lottery-bindBox/close-white.png",
        "~@/assets/lottery-bindBox/close-white@2x.png", 100%, 100%);
        background-repeat: no-repeat;
      }
    }
    .container{
      width: 100%;
      // height: 100%;
      height: px2rem(360px);
      padding-top: px2rem(73px);
      .slogan{
        width: px2rem(230px);
        height: px2rem(86px);
        font-size: px2rem(32px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: center;
        color: #431744;
        line-height: px2rem(48px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(61px);
      }
      .btns{
        width: px2rem(320px);
        height: px2rem(80px);
        background: linear-gradient(180deg,#d27bff, #9358ff);
        border-radius: px2rem(40px);
        font-size: px2rem(28px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        line-height: px2rem(80px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(30px);
      }
    }
  }
  .help-friends-header{
    // position: absolute;
    // top: px2rem(235px);
    width: px2rem(600px);
    height: px2rem(230px);
    @include img-retina("~@/assets/lottery-bindBox/help-friends-bg.png",
    "~@/assets/lottery-bindBox/help-friends-bg@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    // z-index: 2;
    // margin-top: px2rem(385px);
    margin-top: px2rem(-50px);
    padding-top: px2rem(154px);
    .title {
      width: px2rem(160px);
      height: px2rem(40px);
      font-size: px2rem(40px);
      font-family: SourceHanSansCN, SourceHanSansCN-Medium;
      font-weight: 500;
      text-align: left;
      color: #ffffff;
      line-height: px2rem(40px);
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
