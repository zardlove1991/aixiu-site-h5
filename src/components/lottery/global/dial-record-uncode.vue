<template>
  <div class="record-info">
       <DialogPage :show="show" @close="onClose">
           <div slot="title" class="record-info-title">
               <span>中奖记录</span>
           </div>
           <div slot="content" class="record-info-pre">
               <div class="content-pre-title">获得{{itemData.prize_info.award_content}}</div>
                <div class="content-pre-wrap">
                    <div class="content-pre-circle">
                        <van-image :src="itemData.prize_info.images" class="avatar"/>
                    </div>
                    <div class="center-icon">
                        <span>{{itemData.prize_info.award_name}}</span>
                    </div>
                    <div class="left-icon"></div>
                    <div class="right-icon"></div>
                </div>
                <div class="content-pre-userInfo">
                    <p>兑奖码：{{itemData.prize_info.code}} </p>
                    <p>门店地址：{{itemData.prize_info.select_merchant.address}}</p>
                    <p>营业时间：{{itemData.prize_info.select_merchant.start_time}} - {{itemData.prize_info.select_merchant.end_time}}</p>
                    <p>兑奖时间：{{itemData.prize_info.award_time}}</p>
                </div>
           </div>
          <div slot="content-next" class="record-info-next">
              <div class="grounp-btns-wrap">
                  <van-button  block  class="btn" @click="onClose"><span>返回</span></van-button>
                  <van-button  block  class="btn" v-if="itemData.status === '已抽中' " @click="isPrizeQrCodeShow = true"><span>中奖二维码</span></van-button>
              </div>
              <div class="tips-wrap">
                  <p>兑奖提示：请指定时间和门店地址进行核销超 </p>
                  <p>时即失效</p>
              </div>
          </div>
       </DialogPage>
    <PrizeQrCode :show.sync='isPrizeQrCodeShow' v-if="isPrizeQrCodeShow"  @close='isPrizeQrCodeShow = false'
        :data.sync='itemData.prize_info'/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import DialogPage from '@/components/lottery/global/dial-dialog-page'
import PrizeQrCode from '@/components/lottery/global/dial-prize-qrCode'
export default {
  name: '',
  components: { DialogPage, PrizeQrCode },
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
  computed: {},
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    },
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
  created () {},
  mounted () {},
  methods: {
    onClose () {
      this.$emit('close')
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.record-info{
    .record-info-title{
        width: px2rem(280px);
        height: px2rem(76px);
        opacity: 1;
        position: absolute;
        left: px2rem(160px);
        top:(-10%);
        @include img-retina("~@/assets/lottery/activityRule/title.png",
        "~@/assets/lottery/activityRule/title@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        text-align: center;
        span{
            width: px2rem(144px);
            height: px2rem(36px);
            opacity: 1;
            font-size: px2rem(36px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #fff4e3;
            line-height: px2rem(76px);
        }
    }
    .record-info-pre{
        position: relative;
        .content-pre-title{
            width: px2rem(363px);
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
        }
        .content-pre-wrap{
            // position: absolute;
            // top:px2rem(76px);
            // left:px2rem(220px);
            margin-top: px2rem(40px);
            margin-bottom: px2rem(40px);
            width: 100%;
            height: px2rem(160px);
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
             .content-pre-circle{
                position: absolute;
                top:px2rem(76px);
                left:px2rem(220px);
                width: px2rem(160px);
                height: px2rem(160px);
                opacity: 1;
                background-color: #ffffff;
                border: px2rem(2px) solid #edd8b0;
                box-sizing: border-box;
                // margin: px2rem(40px) auto;
                border-radius: 50%;
                z-index: 5;
                .avatar{
                    display: block;
                    width: px2rem(94px);
                    height: px2rem(119px);
                    background-repeat: no-repeat;
                    background-size: cover;
                    position: absolute;
                    top:px2rem(20px);left:px2rem(33px);
                }
            }
        }
        .content-pre-userInfo{
            // width: px2rem(475px);
            height: px2rem(164px);
            opacity: 1;
            font-size: px2rem(26px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #4f0f0f;
            position: absolute;
            left:px2rem(50px);
            display: flex;
            flex-direction: column;
            // justify-content: space-between;
            p{
                font-size: px2rem(26px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #4f0f0f;
                line-height: px2rem(26px);
                margin-bottom: px2rem(10px);
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
    }
    .record-info-next{
        // padding-left: px2rem(50px);
        .grounp-btns-wrap{
            margin-top: px2rem(21px);
            margin-bottom: px2rem(38px);
            display: flex;
            .btn{
                width: px2rem(230px);
                height: px2rem(72px);
                opacity: 1;
                border-radius: px2rem(16px);
                border: none;
                text-align: center;
                &:first-child{
                    background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
                    box-shadow: 0 px2rem(16px) 0px 0px #e5b56b;
                    margin-left: px2rem(52px);
                    margin-right: px2rem(40px);
                    span{
                        font-size: px2rem(28px);
                        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                        font-weight: 500;
                        text-align: left;
                        color: #4f0f0f;
                        line-height: px2rem(72px);
                    }
                }
                &:last-child{
                    background: linear-gradient(0deg,#ff214b 1%, #ff5368);
                    box-shadow: 0 px2rem(16px) 0px 0px #DE183D;
                    span{
                        font-size: px2rem(28px);
                        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                        font-weight: 500;
                        text-align: left;
                        color: #fff4e3;
                        line-height: px2rem(72px);
                    }
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
}
</style>
