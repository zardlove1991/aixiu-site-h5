<template>
    <div class='record-ticketed-dialog' v-if="show" v-fixed>
        <div class="record-ticketed">
            <div class="record-ticketed-header-bg"></div>
            <div class="record-ticketed-header">
                <div class="title">
                    <div class="tille-name">中奖记录</div>
                </div>
                <div class="record-ticketed-header-right" @click.stop="onClose">
                    <i class="i-close"></i>
                </div>
            </div>
            <div class="container">
                <div class="content-pre-title">获得 {{itemData.prize_info.award_content}}</div>
                <!-- <div class="content-pre-title">获得 简约日式实木落地镜</div> -->
                <div class="content-pre-wrap">
                    <div class="content-pre-circle">
                        <!-- <img class="avatar"  src="https://img01.yzcdn.cn/vant/cat.jpeg" alt=""> -->
                        <img :src="itemData.prize_info.images" class="avatar" v-if="itemData.prize_info.images"/>
                    </div>
                    <div class="center-icon">
                            <span>{{itemData.prize_info.award_name}}</span>
                            <!-- <span>一等奖</span> -->
                    </div>
                    <div class="left-icon"></div>
                    <div class="right-icon"></div>
                </div>
                <div class="ticked-wrap" v-if="itemData.status_name === '已兑奖'"></div>
                <div class="ticked-wrap ticked-wrap-overdue" v-else-if="itemData.status_name === '已过期'"></div>
                <div class="content-pre-userInfo">
                    <!-- <p>兑奖码： &nbsp;&nbsp;&nbsp;KM13NJDJNCKK </p>
                    <p>门店地址：楚翘城3号商务楼</p>
                    <p >营业时间：8:00-18:00</p>
                    <p>兑奖时间：2021-06-28 至 2021-07-28</p> -->
                    <p>兑奖码： &nbsp;&nbsp;&nbsp;{{itemData && itemData.prize_info.code || '--'}} </p>
                    <p>门店地址：{{itemData && itemData.prize_info.select_merchant.address || '--'}}</p>
                    <p v-if="itemData.prize_info.select_merchant.start_time && itemData.prize_info.select_merchant.end_time">营业时间：{{itemData.prize_info.select_merchant.start_time}} - {{itemData.prize_info.select_merchant.end_time}}</p>
                    <p v-else>营业时间：--</p>
                    <p>兑奖时间：{{itemData && itemData.prize_info.award_time || '--'}}</p>
                </div>
                <div class="content-split">
                    <img src="../../../assets/wheel/split.png" alt="">
                    <div class="line"></div>
                </div>
                <van-button  block  class="btn back" @click="onClose"><span>返回</span></van-button>
                <div class="tips-wrap">
                  <p>兑奖提示：请指定时间和门店地址进行核销超 </p>
                  <p>时即失效</p>
                </div>
            </div>
            <div class="record-ticketed-footer"></div>
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
      type: Object,
      require: true
    }
  },
  data () {
    return {

    }
  },
  computed: {
    itemData: {
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
  directives: {
    fixed: {
      // inserted 被绑定元素插入父节点时调用
      inserted () {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
      },
      // unbind 指令与元素解绑时调用
      unbind () {
        let body = document.body
        body.style.position = ''
        let top = body.style.top
        document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
        body.style.top = ''
      }
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

<style scoped lang="scss">
@import "@/styles/index.scss";
.record-ticketed-dialog{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .record-ticketed{
    width: px2rem(600px);
    height: px2rem(854px);
    background-color: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    .record-ticketed-header-bg{
      width:100%;
      height: px2rem(192px);
      @include img-retina("~@/assets/lottery/activityRule/propup3.png",
      "~@/assets/lottery/activityRule/propup3@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: top;
      position: absolute;
      top: 0;
      left: 0;
    }
    .record-ticketed-header{
      width:100%;
      height: px2rem(68px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      .title{
        width: px2rem(280px);
        height:px2rem(68px);
        margin-left: px2rem(160px);
        margin-top: px2rem(-7px);
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
      .record-ticketed-header-right{
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
      height: px2rem(786px);
      position: absolute;
      top: px2rem(68px);
      z-index: 10;
      padding-top: px2rem(50px);
      .content-pre-title{
        //   width: px2rem(363px);
        height: px2rem(36px);
        opacity: 1;
        font-size: px2rem(32px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #4f0f0f;
        line-height: px2rem(36px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(40px);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .content-pre-wrap{
        margin-bottom: px2rem(40px);
        width: 100%;
        height: px2rem(160px);
        position: relative;
        .content-pre-circle{
            position: absolute;
            // top:px2rem(76px);
            left:px2rem(220px);
            width: px2rem(160px);
            height: px2rem(160px);
            opacity: 1;
            background-color: #ffffff;
            border: px2rem(2px) solid #edd8b0;
            box-sizing: border-box;
            border-radius: 50%;
            z-index: 5;
            padding: px2rem(20px) px2rem(33px) px2rem(21px) px2rem(33px);
            .avatar{
                display: block;
                width: px2rem(94px);
                height: px2rem(119px);
                background-repeat: no-repeat;
                background-size: cover;
                // position: absolute;
                // top:px2rem(20px);left:px2rem(33px);
            }
        }
        .center-icon{
            width: px2rem(152px);
            height: px2rem(38px);
            @include img-retina("~@/assets/lottery/prizeRecord/prize-bg.png",
            "~@/assets/lottery/prizeRecord/prize-bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            position: absolute;
            bottom: px2rem(8px); left: px2rem(224px);
            text-align: center;
            z-index: 10;
            span{
                width: px2rem(60px);
                height: px2rem(20px);
                opacity: 1;
                font-size: px2rem(20px);
                font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                font-weight: 500;
                text-align: center;
                color: #ffffff;
                line-height: px2rem(38px);
            }
        }
        .left-icon{
            width: px2rem(26px);
            height: px2rem(24px);
            @include img-retina("~@/assets/lottery/prizeRecord/left-icon 18.png",
            "~@/assets/lottery/prizeRecord/left-icon 18@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            position: absolute;
            bottom: px2rem(30px);left: px2rem(210px);
            z-index: 2;
        }
        .right-icon{
            width: px2rem(26px);
            height: px2rem(24px);
            @include img-retina("~@/assets/lottery/prizeRecord/right-icon 18_1.png",
            "~@/assets/lottery/prizeRecord/right-icon 18_1@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            position: absolute;
            bottom: px2rem(30px);right: px2rem(210px);
            z-index: 2;
        }
      }
      .ticked-wrap{
        width: px2rem(122px);
        height: px2rem(102px);
        opacity: 1;
        @include img-retina("~@/assets/lottery/ticketed.png",
        "~@/assets/lottery/ticketed@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        position: absolute;
        top:px2rem(92px);right: px2rem(30px);
        &.ticked-wrap-overdue {
          @include img-retina("~@/assets/lottery/overdues/overdues.png",
          "~@/assets/lottery/overdues/overdues@2x.png", 100%, 100%);
        }
      }
      .content-pre-userInfo{
        height: px2rem(164px);
        opacity: 1;
        font-size: px2rem(26px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #4f0f0f;
        margin-left: px2rem(50px);
        // position: absolute;
        // left:px2rem(50px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
      }
      .content-split{
        width: px2rem(600px);
        height: px2rem(40px);
        // @include img-retina("~@/assets/wheel/split.png",
        // "~@/assets/wheel/split.png", 100%, 100%);
        background-repeat: no-repeat;
        color: transparent;
        background-color: rgba(0, 0, 0, 0.5);
        // filter:alpha(opacity=50);
        // -webkit-filter: alpha(opacity=50) !important;
        position: relative;
        margin: px2rem(20px) auto;
        .line {
            position: absolute;
            top: px2rem(20px);
            left: px2rem(50px);
            width: px2rem(500px);
            // height: 1px;
            opacity: 0.2;
            border-bottom: px2rem(1px) dashed #4f0f0f;
        }
      }
      .btn{
          width: px2rem(230px);
          height: px2rem(72px);
          opacity: 1;
          border-radius: px2rem(16px);
          border: none;
          text-align: center;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: px2rem(30px);
          &.back{
              background: linear-gradient(0deg,#ffdaa3 1%, #ffebc5);
              box-shadow: 0 px2rem(8px) 0px 0px #e5b56b;
            //   margin-left: px2rem(52px);
            //   margin-right: px2rem(40px);
              span{
                  font-size: px2rem(28px);
                  font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                  font-weight: 500;
                  text-align: left;
                  color: #4f0f0f;
                  line-height: px2rem(72px);
              }
          }
      }
      .tips-wrap{
        margin-left: px2rem(50px);
        width: px2rem(480px);
        height: px2rem(62px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #4f0f0f;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // line-height: 24px;
      }
    }
    .record-ticketed-footer{
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
