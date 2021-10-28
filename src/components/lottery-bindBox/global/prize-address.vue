<template>
<div class='prize-address-dialog'  v-if="show">
    <div class="prize-address-header-bg">
        <div class="title">中奖啦</div>
        <div class="close-wrap" @click.stop="onClose">
            <i class="close"></i>
        </div>
    </div>
    <div class="prize-address">
        <div class="container">
             <!-- <div class="award-name">一等奖 · 趣味手摇音乐盒</div> -->
            <div class="award-name">{{prizeData.award_name}} · {{prizeData.award_content}}</div>
             <!-- <div class="award-image">
                <img src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
            </div> -->
            <div class="award-image" v-if="prizeData.images">
                <img :src="prizeData.images" alt="">
            </div>
            <div class="avatar-wrap">
                <!-- <div class="avatar" >
                    <img class="img" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
                </div>
                <div class="avatar-name" >乐乐茶奶茶店</div> -->
                <div class="avatar" v-if="prizeData.is_merchants.logo_url">
                    <img class="img" :src="prizeData.is_merchants.logo_url" />
                </div>
                <div class="avatar-name" v-if="prizeData.is_merchants.name">{{prizeData.is_merchants.name}}</div>
            </div>
            <div class="container-bottom">
                <!-- <div class="qr-code" >
                    <img class="code" src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
                </div> -->
                <div class="qr-code" v-if="prizeData.qr_code">
                    <img class="code" :src="prizeData.qr_code" alt="">
                </div>
                <div class="tips">
                    <!-- <p>兑奖码：KM12HJSNS23</p> -->
                    <p>兑奖码：{{prizeData.code}}</p>
                    <span name="" id="" cols="30" rows="10" >中奖后，工作人员将在7到15个工作日内联系您</span>
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
    show: {type: Boolean, require: true},
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
.prize-address-dialog {
  textarea{
    -webkit-user-select: auto !important;
  }
  /deep/.p {
    .van-field__control{
      -webkit-user-select: auto !important;
      color: #fff;
    }
  }
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: rgba(255, 255, 255, .5);
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    color: rgba(255, 255, 255, .5);
  }
  input::-moz-placeholder, textarea::-moz-placeholder {
    color: rgba(255, 255, 255, .5);
  }
  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    color: rgba(255, 255, 255, .5);
  }
}
</style>
<style scoped lang="scss">
@import "@/styles/index.scss";
.prize-address-dialog{
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
  .prize-address-header-bg{
    width: px2rem(676px);
    height: px2rem(225px);
    @include img-retina("~@/assets/lottery-bindBox/hedader-bg-2.png",
    "~@/assets/lottery-bindBox/hedader-bg-2@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    position: relative;
    .title{
      width: px2rem(108px);
      height: px2rem(36px);
      font-size: px2rem(36px);
      font-family: SourceHanSansCN, SourceHanSansCN-Bold;
      font-weight: 700;
      text-align: center;
      color: #ffffff;
      line-height: px2rem(36px);
      margin-top: px2rem(143px);
      margin-left: auto;
      margin-right: auto;
    }
    .close-wrap{
      position: absolute;
      bottom: 0; right: 0;
      display: block;
      width: px2rem(73px);
      height: px2rem(79px);
      padding-right: px2rem(53px);
      padding-bottom: px2rem(58px);
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
  .prize-address{
    width: px2rem(600px);
    height: px2rem(710px);
    position: relative;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: 0 0  px2rem(32px) px2rem(32px);
    background: linear-gradient(179deg,#d460e3 0%, #9054ff 100%);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    margin-top: px2rem(-20px);
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
    .container{
      width: 100%;
      height: 100%;
      padding-top: px2rem(40px);
      .award-name{
        height: px2rem(32px);
        font-size: px2rem(32px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
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
        padding: px2rem(40px) px2rem(32px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(30px);
        img{
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      .avatar-wrap{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: px2rem(40px);
        line-height: px2rem(40px);
        margin-bottom: px2rem(40px);
        .avatar{
          width: px2rem(40px);
          height: px2rem(40px);
          background: #ffffff;
          padding: px2rem(5px) px2rem(8px);
          border-radius: 50%;
          margin-right: px2rem(16px);
          .img{
            display: inline-block;
            width: px2rem(24px);
            height: px2rem(30px);
          }
        }
        .avatar-name{
          height: px2rem(24px);
          font-size: px2rem(24px);
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          line-height: px2rem(24px);
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
        margin-bottom: px2rem(30px);
        padding-right: px2rem(46px);
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
            width: 100%;
            height: 100%;
            margin-right: px2rem(46px);
            padding-top: px2rem(7px);
            // width: px2rem(374px);
            // height: px2rem(72px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p{
                // width: px2rem(264px);
                height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                // line-height: px2rem(24px);
                margin-bottom: px2rem(20px);
            }
            span{
                display: inline-block;
                // width: px2rem(374px);
                height: px2rem(62px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(36px);
                // line-height: 200%;
            }
        }
      }
      .line{
        width: px2rem(520px);
        border-bottom: px2rem(1px) dashed rgba(255,255,255, .25);
        margin-left: auto;
        margin-right: auto;
        // margin-bottom: px2rem(39px);
        margin-bottom: px2rem(29px);
      }
      .name{
        .span{
            width: px2rem(120px);
            // width: px2rem(72px);
            // height: px2rem(24px);
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
        // height: px2rem(24px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #fff4e3;
        // line-height: px2rem(24px);
        // margin-bottom: px2rem(20px);
        margin-bottom: px2rem(20px);
        padding-left: px2rem(40px);
      }
      .address-warp{
        padding-left: px2rem(40px);
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
            &::after{
              border-bottom: none;
            }
        }
        .btn-icon {
            width: px2rem(63px);
        }
        .icon{
            width: px2rem(22px);
            height: px2rem(22px);
            @include img-retina("~@/assets/lottery-bindBox/icon-edit.png",
            "~@/assets/lottery-bindBox/icon-edit@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            cursor: pointer;
            // background: #fef8e7;
        }
      }
    }
  }
}
</style>
