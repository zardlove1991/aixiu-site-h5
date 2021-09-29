<template>
<div class="cardview" v-if="show">
  <Model :show="show" @close="onClose" class="prize-model">
        <div slot="container" class="container">
            <div class="title">中奖啦~</div>
            <div class="prize-box">
                <div class="bg"></div>
                <div class="prize-header"></div>
                <div class="prize-bannner">
                    <van-divider dashed  content-position='center' class="line"><span class="prize-name" slot="default">{{cardViewData.award_name}}·卡券</span></van-divider>
                </div>
                <div class="prize-content">
                    <div class="coupon-bg">
                        <span>{{cardViewData.award_content}}元</span>
                    </div>
                    <!-- <div class="code">兑奖码：KM12HJSNS23</div> -->
                </div>
                <!-- <div class="prize">
                    <div class="header"></div>
                    <div class="circle">
                        <van-image class="gift" src="https://img01.yzcdn.cn/vant/cat.jpeg"></van-image>
                    </div>
                    <div class="prize-bg">
                        <span>一等奖</span>
                    </div>
                    <div class="prize-name">简约日式实木落地镜</div>
                    <div class="left-icon"></div>
                    <div class="right-icon"></div>
                </div> -->
                <div class="prize-bottom"></div>
            </div>
            <div class="point"></div>
            <div class="avatar-box" v-if="cardViewData.is_merchants">
                <div class="avatar">
                    <van-image class="img" :src="cardViewData.is_merchants.logo_url"></van-image>
                </div>
                <div class="avatar-name">{{cardViewData.is_merchants.merchant_info}}</div>
            </div>
            <!-- <van-button  block  class="btn">去兑奖</van-button> -->
            <div class="container-bottom">
                <div class="qr-code" v-if="cardViewData.qr_code">
                    <van-image class="code" :src="cardViewData.qr_code"></van-image>
                </div>
                <div class="tips">
                    <p>长按识别二维码领取卡券，可在微 </p>
                    <p>信-我的卡券查看</p>
                    <!-- <p>兑奖码：KM12HJSNS23</p>
                    <textarea name="" id="" cols="30" rows="10">中奖后，工作人员将在7到15个工作 日内联系您</textarea> -->
                </div>
            </div>
            <!-- <van-divider  :dashed="true" class="line"/> -->
            <!-- <p class="name"><span>肖沾沾</span>15850602022</p>
            <div class="address-warp">
                <textarea name="" id="" cols="30" rows="10">南京市雨花区安德门大街57号楚翘城3号 商务楼6楼</textarea>
                <div class="icon"></div>
            </div> -->
            <!-- <div class="info-wrap">
                <p>有效期: 2021.06.29 00:00:00 - </p>
                <p>2021.06.30 00:00:00</p>
                <p>优惠券仅支持在本店铺使用，全场商品通用</p>
            </div> -->
        </div>
    </Model>
</div>
</template>

<script>
import Model from '@/components/lottery/global/dial-model-img'
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: { Model },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    cardView: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    cardViewData: {
      get () {
        return this.cardView
      },
      set (val) {
        console.log('rule page数据改变')
        this.$emit('update:data', val)
      }
    }
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {
    // this.cardViewData.qr_code = this.cardViewData.qr_code ? this.getImage(this.cardViewData.qr_code[0]) : this.cardViewData.qr_code
    // this.$set(this.cardViewData, 'qr_code', this.getImage(this.cardViewData.qr_code[0]))
    console.log(this.cardViewData, 'is_qr_codeis_qr_codeis_qr_code')
  },
  mounted () {
  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    getImage (image = {}, width, height) {
      if (image instanceof Array && image.length === 0) {
        return ''
      } else if (typeof image === 'string' || image instanceof Object) {
        let src = (typeof image === 'string') ? image : image.host + image.filename
        src = src || ''
        if (src) { // 替换域名
          src = src.replace('pimg.aihoge.com', 'xzimg.hoge.cn')
          src = src.replace('pimg.xiuzan.com', 'pimg-ax.aihoge.com')
          src = src.replace('pimg.v2.xiuzan.com', 'pimg-ax.aihoge.com')
          src = src.replace('pimg.v2.aihoge.com', 'pimg-ax.aihoge.com')
        }
        width = isNaN(width) ? 0 : width
        height = isNaN(height) ? 0 : height
        if (image.process || width || height) {
          src += '?x-oss-process=image'
        }
        if (image.process && image.process.crop) { // 先裁切，再缩放
          src += '/crop,' + image.process.crop
        }
        if (width > 0 && !height) { // 宽度优先，高度等比缩放
          src += `/resize,w_${width}`
        } else if (height > 0 && !width) { // 高度优先，宽度等比缩放
          src += `/resize,h_${height}`
        } else if (width && height) { // 指定宽高
          src += `/resize,m_mfit,h_${height},w_${width}/crop,x_0,y_0,w_${width},h_${height}`
        } else if (image.process && image.process.resize) {
          src += `/resize,${image.process.resize}`
        }
        const protocol = window.location.protocol
        if (src) {
          src = src.startsWith('//') ? protocol + src : src.replace(/^https?/, protocol.split(':')[0])
        }
        // const protocol = window.location.protocol
        // const handelSrc = src.replace(/^https?/, protocol.split(':')[0])
        return src
      } else {
        return ''
      }
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
// 父组件样式
.cardview{ height: 100%; width: 100%;}
.cardview  .model /deep/.model-wrap{
    height: px2rem(650px);
}
.cardview .model /deep/.model-bg{
    top:-24%;
}
.cardview .model /deep/.header-bg{
 top:-18%;
}
.cardview .model /deep/.model-footer{
 bottom:-6%;
 z-index: 1;
}
// 本身样式
.container{
    position: absolute;
    top: 5%;
    .title{
        width: px2rem(126px);
        height: px2rem(36px);
        opacity: 1;
        font-size: px2rem(36px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #fff4e3;
        line-height: px2rem(36px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(29px);
    }
    .prize-box{
        width: px2rem(540px);
        height: px2rem(250px);
        position: relative;
        margin-left: auto;
        margin-right: auto;
        .bg{
            width: px2rem(540px);
            height: px2rem(20px);
            opacity: 1;
            background-color: #e13842;
            border-radius: px2rem(10px);
        }
        .prize-header{
            width: px2rem(520px);
            height: px2rem(6px);
            background-color: #F9E1CF;
            position: absolute;
            top: px2rem(4px); left:px2rem(11px);
        }
        .prize-bannner{
            position: absolute;
            top: px2rem(10px); left:px2rem(11px);
            width: px2rem(520px);
            height: px2rem(54px);
            opacity: 1;
            @include img-retina("~@/assets/lottery/coupon/bg.png",
            "~@/assets/lottery/coupon/bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            padding-top: px2rem(38px);
            padding-left: px2rem(23px);
            padding-right: px2rem(23px);
            .line{
                border-bottom-color: rgba(79, 15, 15,.2);
                width: px2rem(474px);
                .prize-name{
                    width: px2rem(182px);
                    height: px2rem(28px);
                    opacity: 1;
                    font-size: px2rem(28px);
                    font-family: PingFangSC, PingFangSC-Medium;
                    font-weight: 500;
                    text-align: left;
                    color: #4f0f0f;
                    line-height: px2rem(28px)
                }
            }
        }
        .prize-content{
            position: absolute;
            top: px2rem(60px); left:px2rem(11px);
            width: px2rem(520px);
            height: px2rem(180px);
            opacity: 1;
            background: #fff9ec;
            // position: relative;
            .coupon-bg{
                width: px2rem(340px);
                height: px2rem(110px);
                position: absolute;
                top: px2rem(30px); left: px2rem(89px);
                @include img-retina("~@/assets/lottery/cardView/cardView-bg.png",
                "~@/assets/lottery/cardView/cardView-bg@2x.png", 100%,100%);
                background-repeat: no-repeat;
                display: flex;
                justify-content: center;
                align-items: center;
                span{
                    // width: px2rem(212px);
                    height: px2rem(44px);
                    opacity: 1;
                    font-size: px2rem(44px);
                    font-family: PingFangSC, PingFangSC-Medium;
                    font-weight: 500;
                    text-align: left;
                    color: #fff4e3;
                    line-height: px2rem(44px);
                }
            }
            .code{
                width: px2rem(264px);
                height: px2rem(24px);
                opacity: 1;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #4f0f0f;
                line-height: px2rem(24px);
                position: absolute;
                top:px2rem(170px);left:px2rem(127px)
            }
        }

        .prize{
            width: px2rem(520px);
            height: px2rem(260px);
            opacity: 1;
            background-color: #fff9ec;
            border-radius: px2rem(2px) px2rem(2px) 0px 0px;
            position: absolute;
            top:px2rem(-14px);
            left:px2rem(10px);
            position: relative;
            .header{
                width: px2rem(520px);
                height: px2rem(6px);
                opacity: 0.15;
                background-color: #d75d2d;
            }
            .circle{
                width: px2rem(160px);
                height: px2rem(160px);
                opacity: 1;
                background-color: #ffffff;
                border: px2rem(2px) solid #edd8b0;
                border-radius: 50%;
                position: absolute;
                top: px2rem(21px);left:px2rem(180px);
                z-index: 7;
                position: relative;
                .gift{
                    width: px2rem(94px);
                    height: px2rem(119px);
                    background-size: cover;
                    background-repeat: no-repeat;
                    position: absolute;
                    top: px2rem(20px); left: px2rem(33px);
                    z-index: 5;
                }
            }
            .prize-bg{
                position: absolute;
                left: px2rem(184px); bottom: px2rem(87px);
                width: px2rem(152px);
                height: px2rem(38px);
                opacity: 1;
                @include img-retina("~@/assets/lottery/prizeRecord/prize-bg.png",
                "~@/assets/lottery/prizeRecord/prize-bg@2x.png",'~@/assets/lottery/prizeRecord/prize-bg@3x.png' 100%, 100%);
                background-repeat: no-repeat;
                z-index: 10;
                display: flex;
                // align-items: center;
                justify-content: center;
                span{
                    // width: 60px;
                    height: px2rem(20px);
                    opacity: 1;
                    font-size: px2rem(20px);
                    font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                    font-weight: 500;
                    text-align: center;
                    color: #ffffff;
                    // line-height: px2rem(30px);
                    margin-top: px2rem(6px);
                }
            }
            .left-icon{
                position: absolute;
                top:px2rem(127px);left:px2rem(170px);
                width: px2rem(26px);
                height: px2rem(24px);
                opacity: 1;
                @include img-retina("~@/assets/lottery/prizeRecord/left-icon 18.png",
                "~@/assets/lottery/prizeRecord/left-icon 18@2x.png",'~@/assets/lottery/prizeRecord/left-icon 18@3x.png' 100%, 100%);
                background-repeat: no-repeat;
                z-index: 2;
            }
            .right-icon{
                position: absolute;
                top:px2rem(127px);right:px2rem(170px);
                width: px2rem(26px);
                height: px2rem(24px);
                opacity: 1;
                @include img-retina("~@/assets/lottery/prizeRecord/right-icon 18_1.png",
                "~@/assets/lottery/prizeRecord/right-icon 18_1@2x.png",'~@/assets/lottery/prizeRecord/right-icon 18_1@3x.png' 100%, 100%);
                background-repeat: no-repeat;
                z-index: 2;
            }
            .prize-name{
                width: px2rem(288px);
                height: px2rem(36px);
                opacity: 1;
                font-size: px2rem(32px);
                font-family: PingFangSC, PingFangSC-Medium;
                font-weight: 500;
                text-align: left;
                color: #4f0f0f;
                line-height: px2rem(36px);
                position: absolute;
                left:px2rem(116px);bottom: px2rem(26px);
            }
        }
        .prize-bottom{
            width: px2rem(520px);
            height: px2rem(10px);
            opacity: 1;
            position: absolute;
            bottom:px2rem(0px);left:px2rem(11px);
            @include img-retina("~@/assets/lottery/prize/prize_2.png",
            "~@/assets/lottery/prize/prize_2@2x.png", 100%,100%);
            background-repeat: no-repeat;
        }
    }
    .point{
        position: absolute;
        left: px2rem(6px); bottom: px2rem(343px);
        width: px2rem(54px);
        height: px2rem(114px);
        opacity: 0.2;
         @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
        "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
        background-repeat: no-repeat;
        // background-color: #fff8e3;
    }
    .avatar-box{
        display: flex;
        align-content: center;
        justify-content: center;
        width: 100%;
        height: px2rem(40px);
        margin-top: px2rem(40px);
        margin-bottom: px2rem(40px);
        .avatar{
            width: px2rem(40px);
            height: px2rem(40px);
            opacity: 1;
            background: #ffffff;
            border: px2rem(1px) solid rgba(255,255,255,0.40);
            margin-right: px2rem(16px);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            .img{
                width: px2rem(24px);
                height: px2rem(30px);
                background-size: cover;
                background-repeat: no-repeat;
            }
        }
        .avatar-name{
            width: px2rem(144px);
            height: px2rem(24px);
            opacity: 1;
            font-size: px2rem(24px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: left;
            color: #fff4e3;
            line-height: px2rem(36px);
        }
    }
    .btn{
        width: px2rem(300px);
        height: px2rem(80px);
        opacity: 1;
        border-radius: px2rem(16px);
        background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
        box-shadow: 0 px2rem(16px) 0px 0px #e5b56b;
        margin: auto;
        margin-bottom: px2rem(40px);
    }
    .container-bottom{
        display: flex;
        width: 100%;
        height: px2rem(120px);
        margin-left: px2rem(40px);
        margin-bottom: px2rem(42px);
        position: absolute;
        z-index: 10;
        .qr-code{
            width: px2rem(120px);
            height: px2rem(120px);
            opacity: 1;
            background-color: #ffffff;
            border-radius: px2rem(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: px2rem(20px);
             padding: px2rem(5px);
            .code{
                width: px2rem(110px);
                height: px2rem(110px);
                background-color: cover;
                background-repeat: no-repeat;
            }
        }
        .tips{
           width: px2rem(360px);
            height: px2rem(66px);
            margin-right: px2rem(46px);
            padding-top: px2rem(40px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p{
                width: px2rem(360px);
                height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(24px);
                margin-bottom: px2rem(10px);
            }
            textarea{
                width: px2rem(374px);
                height: px2rem(62px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(34px);
                // line-height: 200%;
            }
        }
    }
    .line{
        width: px2rem(520px);
        height: px2rem(2px);
        // opacity: 0.4;
        border-bottom: px2rem(1px) dashed #ffeccf;
        // background-color: #ffeccf;
        color: #ffeccf;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(39px);
    }
    .name{
            span{
                width: px2rem(72px);
                height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(24px);
                margin-right: px2rem(16px);
            }
                // width: 154px;
            height: px2rem(24px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #fff4e3;
            line-height: px2rem(24px);
            margin-bottom: px2rem(20px);
            padding-left: px2rem(39px);
    }
    .address-warp{
        padding-left: px2rem(39px);
        display: flex;
        textarea{
            width: px2rem(426px);
            height: px2rem(62px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #fff4e3;
            line-height: px2rem(34px);
            word-wrap:break-word;
            word-break:break-all;
            // @include bg-color('bgColor');
            margin-right: px2rem(72px);
        }
        .icon{
            width: px2rem(22px);
            height: px2rem(22px);
            opacity: 0.8;
            @include img-retina("~@/assets/lottery/prize/icon-edit.png",
            "~@/assets/lottery/prize/icon-edit@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            cursor: pointer;
            // background: #fef8e7;
        }
    }
    .info-wrap{
        width: px2rem(456px);
        height: px2rem(100px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(24px);
        margin-left: px2rem(40px);
        p{
            margin-bottom: px2rem(20px);
        }
        & p:nth-child(2){
            // font-in
            text-indent:3.5em;
        }
    }
}
</style>
