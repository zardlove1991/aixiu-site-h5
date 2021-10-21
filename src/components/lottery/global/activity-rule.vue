<template>
    <div class='dialog' v-if="show">
        <div class="activity-rule">
            <div class="activity-rule-header-bg"></div>
            <div class="activity-rule-header">
                 <div class="title">
                    <div class="tille-name">活动规则</div>
                </div>
                <div class="activity-rule-header-right" @click.stop="close">
                  <i class="i-close"></i>
                </div>
            </div>
            <div class="container"  name='container'  v-html="data"></div>
            <div class="dialog-footer"></div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'activityRule',
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
    close () {
      this.$emit('close', false)
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>
<style lang='scss'>
.container {
    img {
      max-width: 100% !important;
      width: auto;
      height:auto;
      object-fit: fill;
    }
}
</style>
<style scoped lang="scss">
@import "@/styles/index.scss";
.dialog {
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
    height: px2rem(826px);
    background: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    .activity-rule-header-bg{
      width: px2rem(600px);
      height: px2rem(192px);
      @include img-retina("~@/assets/lottery/activityRule/propup3.png",
      "~@/assets/lottery/activityRule/propup3@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: top;
      position: absolute;
      top: 0;
      left: 0;
    }
    .activity-rule-header{
      width: px2rem(600px);
      height: px2rem(68px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
        // margin-bottom: px2rem(50px);
      .title{
        margin-top: px2rem(-7px);
        min-width: px2rem(297px);
        max-width: px2rem(360px);
        height:px2rem(68px);
        margin-left: px2rem(151px);
        // margin-right: auto;
        @include img-retina("~@/assets/lottery/activityRule/title.png",
        "~@/assets/lottery/activityRule/title@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        display: flex;
        justify-content: center;
        z-index: 10px;
        float: left;
      .tille-name{
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
      .activity-rule-header-right{
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
    .container{
        width: 100%;
        height: px2rem(708px);
        position: absolute;
        top: px2rem(68px);
        z-index: 10;
        overflow-y: auto;
        padding-top: px2rem(50px);
        padding-left: px2rem(40px);
        padding-right: px2rem(40px);
        padding-bottom: px2rem(42px);
    }
    .dialog-footer{
      width: px2rem(600px);
      height: px2rem(140px);
      border-bottom-left-radius: px2rem(16px);
      border-bottom-right-radius: px2rem(16px);
      @include img-retina("~@/assets/lottery/activityRule/propup4.png","~@/assets/lottery/activityRule/propup4.png", 100%, 100%);
      background-repeat: no-repeat;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
