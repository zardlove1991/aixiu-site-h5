<template>
    <div class='activity-rule-dialog'  v-if="show">
        <div class="activity-rule-border">
            <div class="activity-rule">
                <div class="activity-rule-header">
                    <div class="title-bg">
                        <div class="title">活动规则</div>
                    </div>
                    <div class="close-wrap" @click.stop="onClose">
                        <i class="close"></i>
                    </div>
                </div>
                <div class="container"   v-html="data"></div>
            </div>

        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: {
  },
  props: {
    show: {type: Boolean, require: true},
    data: {
      type: String
    }
  },
  data () {
    return {

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
    })
  }
}
</script>
<style lang='scss'>
.activity-rule{
    .container {
        img {
          max-width: 100% !important;
          width: auto;
          height:auto;
          object-fit: fill;
        }
    }
}
</style>
<style scoped lang="scss">
@import "@/styles/index.scss";
.activity-rule-dialog{
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
  .activity-rule{
    width: px2rem(600px);
    height: px2rem(806px);
    background: #f6eaf9;
    border-radius: px2rem(20px);
    position: relative;
    box-sizing: border-box;
    margin-top: px2rem(10px);
    margin-left: auto;
    margin-right: auto;
    .activity-rule-header{
        width: 100%;
        height: px2rem(60px);
        position: relative;
        .title-bg{
            width: px2rem(260px);
            height: px2rem(60px);
            @include img-retina("~@/assets/lottery-bindBox/header-title-bg.png",
            "~@/assets/lottery-bindBox/header-title-bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            margin-left: auto;
            margin-right: auto;
            padding: px2rem(6px) px2rem(58px) px2rem(18px) px2rem(58px);
            .title{
                font-size: px2rem(36px);
                font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                font-weight: 500;
                text-align: left;
                color: #ffffff;
            }
        }
        .close-wrap{
            width: px2rem(50px);
            height: px2rem(50px);
            float: right;
            padding-top: px2rem(30px);
            padding-right: px2rem(30px);
            position: absolute;
            top: 0; right: 0;
            .close{
                display: inline-block;
                width: px2rem(20px);
                height: px2rem(20px);
                @include img-retina("~@/assets/lottery-bindBox/icon-close.png",
                "~@/assets/lottery-bindBox/icon-close@2x.png", 100%, 100%);
                background-repeat: no-repeat;
            }
        }
    }
    .container{
        width: 100%;
        height: px2rem(746px);
        padding-top: px2rem(40px);
        padding-left: px2rem(40px);
        padding-right: px2rem(40px);
        font-size: px2rem(28px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: left;
        color: #431744;
    }
  }
  .activity-rule-border{
    width: px2rem(620px);
    height: px2rem(806px);
    background: linear-gradient(0deg,rgba(240,123,255,0.00), #a676ff);
    border-radius: px2rem(24px);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    // margin-top: px2rem(286px)
  }
}
</style>
