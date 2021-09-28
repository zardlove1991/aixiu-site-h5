<template>
<div class="prize-address" v-if="show">
  <Model :show="show" @close="onClose" class="prize-model">
        <div slot="container" class="container">
            <div class="title">中奖啦~</div>
            <div class="prize-box">
                <div class="bg"></div>
                <div class="prize">
                    <div class="header"></div>
                    <div class="circle">
                        <van-image class="gift" :src="prizeData.images"></van-image>
                    </div>
                    <div class="prize-bg">
                        <span>{{prizeData.award_name}}</span>
                    </div>
                    <div class="prize-name">{{prizeData.award_content}}</div>
                    <div class="left-icon"></div>
                    <div class="right-icon"></div>
                </div>
                <div class="prize-bottom"></div>
            </div>
            <div class="point"></div>
            <div class="avatar-box" v-if="prizeData.is_merchants">
              <div class="avatar">
                    <van-image class="img" :src="prizeData.is_merchants.logo_url"></van-image>
                </div>
                <div class="avatar-name">{{prizeData.is_merchants.merchant_info}}</div>
            </div>
            <!-- <van-button  block  class="btn">填写收货地址</van-button> -->
            <div class="container-bottom">
                <div class="qr-code" v-if="prizeData.qr_code">
                    <van-image class="code" :src="prizeData.qr_code"></van-image>
                </div>
                <div class="tips">
                    <p>兑奖码：{{prizeData.code}}</p>
                    <!-- <span name="" id="" cols="30" rows="10" v-if="prizeData.give_aways === 1">中奖后，工作人员将在{{prizeData.award_time}}个工作日内联系您</span> -->
                    <span name="" id="" cols="30" rows="10" >中奖后，工作人员将在7到15个工作日内联系您</span>
                </div>
            </div>
            <van-divider  :dashed="true" class="line"/>
            <form action="#">
                <p class="name">
                    <input type="text" class="span" v-model="prizeData.address[0]" :readonly='edit' />
                    <input type="text" v-model="prizeData.address[1]" :readonly='edit'
                    @input="prizeData.address[1] = prizeData.address[1].replace(/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, '')"/>
                </p>
                <div class="address-warp">
                    <input type="text" class="p" v-model="prizeData.address[2]" :readonly='edit'/>
                    <div class="icon" @click="onEdit" v-if="edit"></div>
                    <div class="icon" @click="onSubmit" v-else></div>
                </div>
            </form>
        </div>
    </Model>
</div>
</template>

<script>
import Model from '@/components/lottery/global/dial-model-img'
import API from '@/api/module/examination'
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: { Model },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      require: true
    },
    prize: {
      type: Object,
      require: true
    }
  },
  data () {
    return { edit: true
    }
  },
  computed: {
    prizeData: {
      get () {
        return this.prize
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
  created () {},
  mounted () {},
  methods: {
    onClose () {
      this.$emit('close')
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    }),
    onEdit () {
      this.edit = !this.edit
    },
    async onSubmit () {
      let err = ''
      if (!this.prizeData.address[0]) {
        err = '请填姓名'
      } else if (!this.prizeData.address[1]) {
        err = '请填写手机号'
      } else if (!this.prizeData.address[2]) {
        err = '请填写详细地址'
      }
      if (err) {
        this.$toast.fail(err)
        return false
      }
      const res = await API.getAddress({
        query: { id: this.id },
        data: {
          name: this.prizeData.address[0],
          mobile: this.prizeData.address[1],
          address: this.prizeData.address[2]
        }
      })
      console.log(res)
      this.edit = true
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
// 父组件样式
.prize-address{ height: 100%; width: 100%;}
.prize-address  .model /deep/.model-wrap{
    height: px2rem(858px);
}
.prize-address .model /deep/.model-bg{
    top:-18%;
}
.prize-address .model /deep/.header-bg{
 top:-13.5%;
}
// 本身样式
.container{
    position: absolute;
    top: 5%;
    z-index: 10;
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
        height: px2rem(274px);
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
                // width: px2rem(288px);
                height: px2rem(36px);
                opacity: 1;
                font-size: px2rem(32px);
                font-family: PingFangSC, PingFangSC-Medium;
                font-weight: 500;
                text-align: center;
                color: #4f0f0f;
                line-height: px2rem(36px);
                margin-top: px2rem(28px);
                // position: absolute;
                // left:px2rem(116px);bottom: px2rem(26px);
            }
        }
        .prize-bottom{
            width: px2rem(520px);
            height: px2rem(10px);
            opacity: 1;
            position: absolute;
            bottom:px2rem(0px);left:px2rem(10px);
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
            width: 100%;
            height: 100%;
            margin-right: px2rem(46px);
            padding-top: px2rem(6px);
            p{
                // width: px2rem(264px);
                height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(24px);
                margin-bottom: px2rem(20px);
            }
            span{
                // width: px2rem(374px);
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
            .span{
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
        .p{
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
}
</style>
