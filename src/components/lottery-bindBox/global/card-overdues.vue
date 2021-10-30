<template>
<div class='card-overdues-dialog' v-if="show" v-fixed>
  <div class="card-overdues-border">
    <div class="card-overdues">
      <div class="card-overdues-header">
        <div class="title-bg">
            <div class="title">中奖记录</div>
        </div>
        <div class="close-wrap" @click.stop="onClose">
            <i class="close"></i>
        </div>
      </div>
      <div class="container">
        <!-- <div class="award-name">获得 四等奖优惠券</div> -->
        <div class="award-name">获得 {{itemData.prize_info.award_name}}优惠券</div>
        <div class="card-overdues-wrap">
            <!-- <div class="card-overdues-name">满100减50</div> -->
          <div class="card-overdues-name">{{itemData.prize_info.award_content}}</div>
        </div>
        <!-- <div class="overdues" ></div> -->
        <!-- <div class="overdues convert"></div> -->
        <div class="overdues" v-if="itemData.status === '已过期'"></div>
        <div class="overdues convert" v-else-if="itemData.status === '已兑奖'"></div>
        <div class="info-wrap">
            <!-- <p>有效期: 2021.06.29 00:00:00 - </p>
            <p>2021.06.30 00:00:00</p>
            <p>优惠券仅支持在本店铺使用，全场商品通用</p> -->
            <!-- <p>兑奖码: {{itemData.prize_info.code}}</p> -->
            <p>有效期: {{itemData.prize_info.prize_date[0]}} - </p>
            <p>{{itemData.prize_info.prize_date[1]}}</p>
            <p>优惠券仅支持在本店铺使用，全场商品通用</p>
        </div>
        <van-button  block  class="btns" @click="onClose">返回</van-button>
      </div>
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
.card-overdues-dialog{
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
  .card-overdues-border{
    width: px2rem(620px);
    height: px2rem(709px);
    background: linear-gradient(0deg,rgba(240,123,255,0.00), #a676ff);
    border-radius: px2rem(24px);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    .card-overdues{
        width: px2rem(600px);
        height: px2rem(689px);
        background: #f6eaf9;
        border-radius: px2rem(20px);
        position: relative;
        box-sizing: border-box;
        margin-top: px2rem(10px);
        margin-left: auto;
        margin-right: auto;
        .card-overdues-header{
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
            height: px2rem(629px);
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
            .card-overdues-wrap{
                width: px2rem(420px);
                height: px2rem(150px);
                @include img-retina("~@/assets/lottery-bindBox/card-view-bg.png",
                "~@/assets/lottery-bindBox/card-view-bg@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: px2rem(50px);
                padding: px2rem(53px) px2rem(12px);
                .card-overdues-name{
                    height: px2rem(44px);
                    font-size: px2rem(44px);
                    font-family: PingFangSC, PingFangSC-Medium;
                    font-weight: 500;
                    text-align: center;
                    color: #431744;
                    line-height: px2rem(44px);
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
            .info-wrap{
                width: px2rem(456px);
                height: px2rem(108px);
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #431744;
                line-height: px2rem(24px);
                margin-left: px2rem(40px);
                margin-bottom: px2rem(60px);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p {
                    // margin-bottom: px2rem(20px);
                 }
                & p:nth-child(2){
                    text-indent:3.5em;
                }
            }
            .btns{
                width: px2rem(240px);
                height: px2rem(80px);
                background: linear-gradient(0deg,#cca4ff, #ffb5f9);
                border-radius: px2rem(40px);
                font-size: px2rem(28px);
                font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                font-weight: 500;
                text-align: center;
                color: #431744;
                line-height: px2rem(80px);
                margin-left: auto;
                margin-right: auto;
            }
            .overdues{
                width: px2rem(122px);
                height: px2rem(102px);
                position: absolute;
                top: px2rem(101px);
                right: px2rem(30px);
                @include img-retina("~@/assets/lottery-bindBox/overdue-bg.png",
                "~@/assets/lottery-bindBox/overdue-bg@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                &.convert{
                    @include img-retina("~@/assets/lottery-bindBox/convert-bg.png",
                    "~@/assets/lottery-bindBox/convert-bg@2x.png", 100%, 100%);
                    background-repeat: no-repeat;
                }
            }
        }
    }
  }
}
</style>
