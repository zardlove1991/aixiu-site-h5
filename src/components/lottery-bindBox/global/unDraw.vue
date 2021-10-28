<template>
<div class='unDraw-dialog' v-if="show">
    <div class="unDraw">
        <div class="unDraw-header">
            <div class="close-wrap" @click.stop="onClose">
                <i class="close"></i>
            </div>
        </div>
        <div class="unDraw-img"></div>
        <div class="container">
            <div class="title">没有抽中哦~</div>
            <div class="tip">好可惜，差点就抽中了</div>
            <!-- <van-button  block  native-type="submit" class="btn" @click="onDrawAgain">再抽一次(12)</van-button> -->
            <van-button  block  native-type="submit" class="btn" @click="onDrawAgain" v-if="count > 0">再抽一次({{count}})</van-button>
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
      type: [Object, Number, String],
      required: true
    }
  },
  data () {
    return {

    }
  },
  computed: {
    count: {
      get () {
        return this.data
      },
      set (val) {
        console.log('rule page数据改变')
        this.$emit('update:data', val)
      }
    }
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
    onDrawAgain () {
      this.$parent.onDraw()
      this.onClose()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.unDraw-dialog{
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
  .unDraw{
    width: px2rem(600px);
    height: px2rem(582px);
    position: relative;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: px2rem(32px);
    background: linear-gradient(179deg,#d460e3 0%, #9054ff 100%);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: -1;
        margin: px2rem(-8px);
        border-radius: inherit; /*important*/
        background: linear-gradient(181deg, #af36da 1%, rgba(98,31,212,0.00) 67%) 8 8;
        filter: blur(px2rem(10px));
        -webkit-filter: blur(px2rem(10px));
        -moz-filter: blur(px2rem(10px));
        -ms-filter: blur(px2rem(10px));
    }
    .unDraw-header{
        width: 100%;
        height: px2rem(50px);
        .close-wrap{
            width: px2rem(50px);
            height: px2rem(50px);
            padding-top: px2rem(30px);
            padding-right: px2rem(30px);
            float: right;
            .close{
                display: inline-block;
                width: px2rem(20px);
                height: px2rem(20px);
                @include img-retina("~@/assets/lottery-bindBox/close-white.png",
                "~@/assets/lottery-bindBox/close-white@2x.png", 100%, 100%);
                background-repeat: no-repeat;
            }
        }
    }
    .container{
        width: px2rem(600px);
        height: px2rem(298px);
        position: absolute;
        top: px2rem(284px); left: 0;
        // padding-top: px2rem(20px);
        .title{
            width: px2rem(201px);
            height: px2rem(36px);
            font-size: px2rem(36px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(36px);
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(30px);
        }
        .tip{
            width: px2rem(320px);
            height: px2rem(32px);
            font-size: px2rem(32px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(32px);
            margin-left: auto;
            margin-right: auto;
        }
        .btn{
            display: block;
            width: px2rem(300px);
            height: px2rem(80px);
            opacity: 1;
            border-radius: px2rem(40px);
            background: linear-gradient(0deg,#ffa243, #ffe490);
            margin: auto;
            font-size: px2rem(28px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #431744;
            border: none;
            margin-top: px2rem(60px);
            margin-left: px2rem(140px);
            // margin-right: auto;
        }
    }
    .unDraw-img{
        position: absolute;
        top: px2rem(30px);
        left: px2rem(170px);
        width: px2rem(313px);
        height: px2rem(246px);
        @include img-retina("~@/assets/lottery-bindBox/activity-end-bg.png",
        "~@/assets/lottery-bindBox/activity-end-bg@2x.png", 100%, 100%);
        background-repeat: no-repeat;
    }
  }
}
</style>
