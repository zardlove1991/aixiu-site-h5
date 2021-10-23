<template>
    <div class="prize-address-model" v-if="show">
        <div class="prize-address-model-wrap">
            <div class="model-bg"></div>
            <div class="prize-address-model-wrap-bg"></div>
            <div class="prize-address-header">
                <div class="prize-address-header-right" @click.stop="onClose">
                <i class="i-close"></i>
                </div>
            </div>
             <div class="container">
                <div class="title">中奖啦~</div>
                <div class="prize-box">
                    <div class="bg"></div>
                    <div class="prize-info">
                        <div class="prize-header"></div>
                        <div class="prize-content">
                            <div class="circle">
                                <!-- <img class="gift" src="https://img01.yzcdn.cn/vant/cat.jpeg" alt=""> -->
                                <img class="gift" :src="prizeData.images" alt="">
                            </div>
                            <div class="prize-bg">
                                <!-- <span>一等奖</span> -->
                                <span>{{prizeData.award_name || '--'}}</span>
                            </div>
                            <!-- <div class="prize-name">简约日式实木落地镜</div> -->
                            <div class="prize-name">{{prizeData.award_content || '--'}}</div>
                            <div class="left-icon"></div>
                            <div class="right-icon"></div>
                        </div>
                        <div class="prize-footer"></div>
                    </div>
                </div>
                <div class="avatar-box">
                    <!-- <div class="avatar" >
                        <img class="gift" src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
                    </div> -->
                    <div class="avatar" v-if="prizeData.is_merchants.logo_url">
                        <img  class="img"  :src="prizeData.is_merchants.logo_url" alt="">
                    </div>
                    <!-- <div class="avatar-name" >乐乐茶奶茶店</div> -->
                    <div class="avatar-name" v-if="prizeData.is_merchants.name">{{prizeData.is_merchants.name}}</div>
                </div>
                <div class="container-bottom">
                    <!-- <div class="qr-code" >
                        <img class="gift" src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
                    </div> -->
                    <div class="qr-code" v-if="prizeData.qr_code">
                        <img class="code" :src="prizeData.qr_code" alt="">
                    </div>
                    <div class="tips">
                        <!-- <p>兑奖码：KM12HJSNS23</p> -->
                        <p>兑奖码：{{prizeData.code}}</p>
                        <p name="" id="" cols="30" rows="10" >中奖后，工作人员将在7到15个工作日内联系您</p>
                    </div>
                </div>
                <div class="line"></div>
                <form action="#">
                    <p class="name">
                        <input type="text" class="span" v-model="prizeData.address[0]" :readonly='edit'  placeholder="姓名"/>
                        <input type="text" v-model="prizeData.address[1]" :readonly='edit' :maxlength="11" placeholder="手机号"/>
                    </p>
                    <div class="address-warp">
                        <van-field type="textarea"  autosize class="p" v-model="prizeData.address[2]" :readonly='edit' placeholder="详细地址" />
                        <!-- <input type="text" class="p" v-model="prizeData.address[2]" :readonly='edit' placeholder="收获地址"/> -->
                        <div class="btn-icon" v-if="edit" @click="onEdit">
                        <div class="icon"  ></div>
                        </div>
                        <div class="btn-icon" v-else @click="onSubmit" >
                        <div class="icon" ></div>
                        </div>
                    </div>
                </form>
             </div>
            <div class="points"></div>
            <div class="prize-address-footer"></div>
        </div>

    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
export default {
  name: '',
  components: {
  },
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
    return {
      edit: true
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
  created () {
  },
  mounted () {

  },
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
      if (this.prizeData.address[1]) {
        let res = this.checkMobile(this.prizeData.address[1])
        if (!res) {
          this.$toast('手机号格式错误')
          return false
        }
      }
      const res = await API.getAddress({
        query: { id: this.id },
        data: {
          code: this.prizeData.code,
          name: this.prizeData.address[0],
          mobile: this.prizeData.address[1],
          address: this.prizeData.address[2]
        }
      })
      console.log(res)
      if (res.success === 1) this.$toast.success('编辑成功')
      this.edit = true
    },
    // 手机校验
    checkMobile (val) {
      let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!reg.test(val)) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style lang="scss">
.prize-address-model {
    .van-field{
        .van-field__control{
            color: #fff4e3;
        }
    }
}
</style>
<style scoped lang="scss">
@import "@/styles/index.scss";
.prize-address-model {
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
  .prize-address-model-wrap{
    width: px2rem(600px);
    height: px2rem(858px);
    opacity: 1;
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
    .prize-address-model-wrap-bg{
      width: px2rem(600px);
      height: px2rem(202px);
     @include img-retina("~@/assets/lottery/activityRule/propup3.png",
      "~@/assets/lottery/activityRule/propup3@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      border-top-right-radius: px2rem(16px);
      border-top-left-radius: px2rem(16px);
      position: absolute;
      top: 0; left: 0;
    }
    .prize-address-header{
        width: px2rem(600px);
        height: px2rem(52px);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        border-top-right-radius: px2rem(16px);
        border-top-left-radius: px2rem(16px);
        .prize-address-header-right {
            width: px2rem(50px);
            height: px2rem(52px);
            padding-right: px2rem(30px);
            padding-top: px2rem(30px);
            float: right;
            cursor: pointer;
            .i-close{
              display: inline-block;
              width: px2rem(20px);
              height: px2rem(20px);
                @include img-retina("~@/assets/lottery/close_1.png",
              "~@/assets/lottery/close_1@2x.png", 100%, 100%);
              background-repeat: no-repeat;
            }
        }
    }
    .container{
        width: 100%;
        height: px2rem(806px);
        position: absolute;
        top: px2rem(52px);
        z-index: 10;
        .title{
            font-size: px2rem(36px);
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #fff4e3;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(29px);
        }
        .prize-box{
            width: px2rem(540px);
            height: px2rem(270px);
            position: relative;
            margin-left: auto;
            margin-right: auto;
            box-sizing: border-box;
            margin-bottom: px2rem(60px);
            .bg{
                width: px2rem(540px);
                height: px2rem(20px);
                opacity: 1;
                background-color: #e13842;
                border-radius: px2rem(10px);
            }
            .prize-info{
                width: px2rem(520px);
                height: px2rem(270px);
                position: absolute;
                top: px2rem(4px); left:px2rem(10px);
                .prize-header{
                    width: 100%;
                    height: px2rem(6px);
                    background-color: #F9E1CF;
                }
                .prize-content{
                    width: 100%;
                    height: px2rem(254px);
                    background: #fff9ec;
                    position: relative;
                    // margin-top:px2rem(6px);
                    .circle {
                        position: absolute;
                        top: px2rem(15px); left: px2rem(180px);
                        width: px2rem(160px);
                        height: px2rem(160px);
                        background: #ffffff;
                        border: px2rem(2px) solid #edd8b0;
                        box-sizing: border-box;
                        margin-bottom: px2rem(20px);
                        margin-left: auto;
                        margin-right: auto;
                        border-radius: 50%;
                        padding: px2rem(20px) px2rem(33px) px2rem(21px) px2rem(33px);
                        z-index: 3;
                        .gift{
                            width: px2rem(94px);
                            height: px2rem(119px);
                            background-size: cover;
                            background-repeat: no-repeat;
                            /deep/ .van-image__error-icon{
                                display: inline-block;
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                    .prize-bg{
                        position: absolute;
                        left: px2rem(184px); top: px2rem(129px);
                        width: px2rem(152px);
                        height: px2rem(38px);
                        opacity: 1;
                        @include img-retina("~@/assets/lottery/prizeRecord/prize-bg.png",
                        "~@/assets/lottery/prizeRecord/prize-bg@2x.png", 100%, 100%);
                        background-repeat: no-repeat;
                        z-index: 10;
                        display: flex;
                        justify-content: center;
                        line-height: px2rem(38px);
                        span {
                            opacity: 1;
                            font-size: px2rem(20px);
                            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                            font-weight: 500;
                            text-align: center;
                            color: #ffffff;
                        }
                    }
                    .prize-name{
                        width: px2rem(288px);
                        height: px2rem(36px);
                        opacity: 1;
                        font-size: px2rem(32px);
                        font-family: PingFangSC, PingFangSC-Medium;
                        font-weight: 500;
                        text-align: center;
                        color: #4f0f0f;
                        line-height: px2rem(36px);
                        // margin: auto;
                        position: absolute;
                        top: px2rem(195px);
                        left: px2rem(116px);
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    .left-icon{
                        position: absolute;
                        top:px2rem(121px);left:px2rem(170px);
                        width: px2rem(26px);
                        height: px2rem(24px);
                        opacity: 1;
                        @include img-retina("~@/assets/lottery/prizeRecord/left-icon 18.png",
                        "~@/assets/lottery/prizeRecord/left-icon 18@2x.png", 100%, 100%);
                        background-repeat: no-repeat;
                        z-index: 2;
                    }
                    .right-icon{
                        position: absolute;
                        top:px2rem(121px);right:px2rem(170px);
                        width: px2rem(26px);
                        height: px2rem(24px);
                        opacity: 1;
                        @include img-retina("~@/assets/lottery/prizeRecord/right-icon 18_1.png",
                        "~@/assets/lottery/prizeRecord/right-icon 18_1@2x.png", 100%, 100%);
                        background-repeat: no-repeat;
                        z-index: 2;
                    }
                }
                .prize-footer{
                    width: 100%;
                    height: px2rem(10px);
                    @include img-retina("~@/assets/lottery/prize/prize_2.png",
                    "~@/assets/lottery/prize/prize_2@2x.png", 100%,100%);
                    background-repeat: no-repeat;
                }
            }
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
                padding: px2rem(5px) px2rem(8px);
                box-sizing: border-box;
                .img{
                    width: px2rem(24px);
                    height: px2rem(30px);
                    background-size: cover;
                    background-repeat: no-repeat;
                }
            }
            .avatar-name{
                // width: px2rem(144px);
                // height: px2rem(24px);
                opacity: 1;
                font-size: px2rem(24px);
                font-family: SourceHanSansCN, SourceHanSansCN-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(40px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
        .container-bottom{
            display: flex;
            width: 100%;
            height: px2rem(120px);
            margin-left: px2rem(40px);
            margin-bottom: px2rem(40px);
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
                    background-size: cover;
                    background-repeat: no-repeat;
                }
            }
            .tips{
                // width: 100%;
                // height: 100%;
                margin-right: px2rem(46px);
                padding-top: px2rem(7px);
                width: px2rem(374px);
                height: px2rem(72px);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p{
                    // width: px2rem(264px);
                    // height: px2rem(24px);
                    opacity: 0.8;
                    font-size: px2rem(24px);
                    font-family: PingFangSC, PingFangSC-Regular;
                    font-weight: 400;
                    text-align: left;
                    color: #fff4e3;
                    // line-height: px2rem(24px);
                    // margin-bottom: px2rem(20px);
                }
                span{
                    display: inline-block;
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
            opacity: 0.4;
            border-bottom: px2rem(1px) dashed #ffeccf;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(39px);
        }
        .name{
            .span{
                width: px2rem(120px);
                // width: px2rem(72px);
                height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                // line-height: px2rem(24px);
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
            // line-height: px2rem(24px);
            margin-bottom: px2rem(20px);
            padding-left: px2rem(39px);
        }
        .address-warp{
            padding-left: px2rem(39px);
            display: flex;
            .p{
                width: px2rem(426px);
                // height: px2rem(62px);
                height: auto;
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3 ;
                // color: #4f0f0f;
                line-height: px2rem(34px);
                word-wrap:break-word;
                word-break:break-all;
                // @include bg-color('bgColor');
                margin-right: px2rem(72px);
            }
            .btn-icon {
                width: px2rem(63px);
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
    .prize-address-footer{
        width: px2rem(600px);
        height: px2rem(240px);
        border-bottom-left-radius: px2rem(16px);
        border-bottom-right-radius: px2rem(16px);
        @include img-retina("~@/assets/lottery/modelImg/model-footer.png","~@/assets/lottery/modelImg/model-footer.png", 100%, 100%);
        background-repeat: no-repeat;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .points{
        position: absolute;
        top: px2rem(358px);
        left: px2rem(6px);
        width: px2rem(54px);
        height: px2rem(114px);
        @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
        "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
        background-repeat: no-repeat;
    }
    .model-bg{
        width: px2rem(426px);
        height: px2rem(225px);
        @include img-retina("~@/assets/lottery/modelImg/model-bg.png",
        "~@/assets/lottery/modelImg/model-bg.png", 100%, 100%);
        background-repeat: no-repeat;
        margin-top: px2rem(-154px);
        margin-left: auto;
        margin-right: auto;
    }
  }
}
</style>
