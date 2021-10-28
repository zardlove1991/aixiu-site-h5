<template>
<div class='record-info-dialog' v-if="show" v-fixed>
  <div class="record-info-border">
    <div class="record-info">
      <div class="record-info-header">
        <div class="title-bg">
          <div class="title">中奖记录</div>
        </div>
        <div class="close-wrap" @click.stop="onClose">
          <i class="close"></i>
        </div>
      </div>
      <div class="container">
        <!-- <div class="award-name">获得 一等奖趣味手摇音乐盒</div> -->
        <div class="award-name">获得 {{itemData.prize_info.award_name}}{{itemData.prize_info.award_content}}</div>
        <!-- <div class="award-image">
          <img src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
        </div> -->
        <div class="award-image" v-if="itemData.prize_info.images">
          <img :src="itemData.prize_info.images" alt="">
        </div>
        <div class="ticked-wrap" v-if="itemData.status_name === '已兑奖'"></div>
        <div class="ticked-wrap ticked-wrap-overdue" v-else-if="itemData.status_name === '已过期'"></div>
        <div class="info-wrap">
          <!-- <p>兑奖码： &nbsp;&nbsp;&nbsp;KM13NJDJNCKK </p>
          <p>门店地址：楚翘城3号商务楼</p>
          <p>营业时间：8:00-18:00</p>
          <p>兑奖时间：2021-06-28 至 2021-07-28</p> -->
          <p>兑奖码： &nbsp;&nbsp;&nbsp;{{itemData && itemData.prize_info.code || '--'}} </p>
          <p>门店地址：{{itemData && itemData.prize_info.select_merchant.address || '--'}}</p>
          <p v-if="itemData.prize_info.select_merchant.start_time && itemData.prize_info.select_merchant.end_time">营业时间：{{itemData.prize_info.select_merchant.start_time}} - {{itemData.prize_info.select_merchant.end_time}}</p>
          <p v-else>营业时间：--</p>
          <p>兑奖时间：{{itemData && itemData.prize_info.award_time || '--'}}</p>
        </div>
        <div class="btn-groups">
          <van-button  block class="btns back" @click="onClose">返回</van-button>
          <van-button  block class="btns lottery" v-if="itemData.status_name === '已抽中' " @click="isPrizeQrCodeShow = true">中奖二维码</van-button>
          <van-button  block class="btns due" disabled v-else-if="itemData.status_name === '已过期' ||  itemData.status_name === '已兑奖'">中奖二维码</van-button>
        </div>
        <div class="tip">兑奖提示：请前往指定时间和门店地址进行核销， 超时即失效</div>
      </div>
    </div>
  </div>
  <PrizeQrCode :show.sync='isPrizeQrCodeShow' v-if="isPrizeQrCodeShow"  @close='isPrizeQrCodeShow = false'
    :data.sync='itemData.prize_info'/>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import PrizeQrCode from '@/components/lottery-bindBox/global/prize-qrCode' // 兑换码凭证
export default {
  name: '',
  components: {
    PrizeQrCode
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
      isPrizeQrCodeShow: false
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
  created () {
  },
  mounted () {

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
.record-info-dialog{
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
  .record-info-border{
    width: px2rem(620px);
    height: px2rem(837px);
    background: linear-gradient(0deg,rgba(240,123,255,0.00), #a676ff);
    border-radius: px2rem(24px);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    .record-info{
      width: px2rem(600px);
      height: px2rem(817px);
      background: #f6eaf9;
      border-radius: px2rem(20px);
      position: relative;
      box-sizing: border-box;
      margin-top: px2rem(10px);
      margin-left: auto;
      margin-right: auto;
      .record-info-header{
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
        height: px2rem(757px);
        padding-top: px2rem(40px);
        position: relative;
        .award-name{
          height: px2rem(32px);
          font-size: px2rem(32px);
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: center;
          color: #431744;
          line-height: px2rem(32px);
          margin-bottom: px2rem(40px);
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .award-image{
          width: px2rem(160px);
          height: px2rem(160px);
          background: #ffffff;
          border-radius: 50%;
          margin-bottom: px2rem(40px);
          margin-left: auto;
          margin-right: auto;
          padding: px2rem(40px) px2rem(32px);
          img{
            display: inline-block;
            width: px2rem(96px);
            height: px2rem(79px);
          }
        }
        .ticked-wrap{
          position: absolute;
          top:px2rem(101px);
          right: px2rem(30px);
          width: px2rem(122px);
          height: px2rem(102px);
          @include img-retina("~@/assets/lottery-bindBox/convert-bg.png",
          "~@/assets/lottery-bindBox/convert-bg@2x.png", 100%, 100%);
          background-repeat: no-repeat;
          &.ticked-wrap-overdue{
            @include img-retina("~@/assets/lottery-bindBox/overdue-bg.png",
            "~@/assets/lottery-bindBox/overdue-bg@2x.png", 100%, 100%);
          }
        }
        .info-wrap{
          height: px2rem(164px);
          opacity: 1;
          font-size: px2rem(26px);
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #431744;
          line-height: px2rem(26px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: px2rem(40px);
          margin-bottom: px2rem(60px);
        }
        .btn-groups{
          width: 100%;
          height: px2rem(80px);
          padding-left: px2rem(40px);
          padding-right: px2rem(40px);
          margin-bottom: px2rem(40px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          .btns {
            width: px2rem(240px);
            height: px2rem(80px);
            border-radius: px2rem(40px);
            font-size: px2rem(28px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #431744;
            line-height: px2rem(80px);
            &.back{
              background: linear-gradient(0deg,#cca4ff, #ffb5f9);
            }
            &.lottery{
              background: linear-gradient(0deg,#ffa243, #ffe490);
            }
            &.due{
              background: linear-gradient(0deg,#fff 1%, #b7b09b);
            }
          }
        }
        .tip{
            margin-left: px2rem(40px);
            width: px2rem(528px);
            height: px2rem(62px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #431744;
            line-height: px2rem(32px);
        }
      }
    }
  }
}
</style>
