<template>
  <div class="card-packetPull" v-if="show">
      <DialogPage :show="show" @close="onClose">
          <div slot="title" class="record-info-title">
               <span>中奖记录</span>
           </div>
          <div slot="content" class="record-info-pre">
            <div class="content-pre-title">获得{{itemData.prize_info.award_name}}红包</div>
              <div class="content-pre-wrap">
                  <div class="packetPull">
                    <p>{{itemData.prize_info.money}}
                      <span>元</span>
                    </p>
                      <!-- <span>{{itemData.prize_info.money}}</span>
                      <span>元</span> -->
                  </div>
              </div>
            <div class="content-pre-info">
                <p>现金红包需在24小时内前往公众号领取，超 </p>
                <p>时自动过期</p>
            </div>
          </div>
          <div slot="content-next" class="record-info-next">
            <van-button  block  class="btn" @click="onClose"><span>返回</span></van-button>
          </div>
      </DialogPage>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import DialogPage from '@/components/lottery/global/dial-dialog-page'
export default {
  name: '',
  components: { DialogPage },
  props: {
    show: {type: Boolean, require: true},
    data: {
      type: Object,
      require: true
    }
  },
  data () {
    return {}
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
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.card-packetPull .dialog /deep/.dialog-wrap{
  height: px2rem(716px);
}
.card-packetPull .dialog /deep/.dialog-wrap /deep/.dialog-pre{
  height: px2rem(462px) ;
}
.card-packetPull .dialog /deep/.dialog-wrap /deep/.divider{
    // top:px2rem(462px)
    top:px2rem(530px)
}
.card-packetPull .dialog /deep/.dialog-wrap /deep/.dialog-next{
  height: px2rem(145px);
}
.record-info-title{
  width: px2rem(299px);
  height: px2rem(76px);
  opacity: 1;
  position: absolute;
  left: px2rem(146px);
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
  height: 100%;
  .content-pre-title{
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
    width: 100%;
    height: px2rem(242px);
    // margin: px2rem(40px) auto;
    margin-top: px2rem(40px);
    margin-bottom: px2rem(22px);
    .packetPull{
      position: absolute;
      top:px2rem(72px);left:px2rem(187px);
      width: px2rem(228px);
      height: px2rem(242px);
      opacity: 1;
      @include img-retina("~@/assets/lottery/packetPull/packetPull.png",
      "~@/assets/lottery/packetPull/packetPull@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      text-align: center;
      p {
        width: 100%;
        height: px2rem(70px);
        font-size: px2rem(32px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #d10000;
        line-height: px2rem(70px);
        position: absolute;
        top:px2rem(55px);
        span {
            height: px2rem(22px);
            opacity: 1;
            font-size: px2rem(22px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #d10000;
            line-height: px2rem(40px);
            // line-height: px2rem(22px);
        }
      }
      // span:first-child{
      //   width: px2rem(81px);
      //   height: px2rem(70px);
      //   opacity: 1;
      //   font-size: px2rem(50px);
      //   font-family: PingFangSC, PingFangSC-Medium;
      //   font-weight: 500;
      //   text-align: center;
      //   color: #d10000;
      //   line-height: px2rem(70px);
      //   position: absolute;
      //   top:px2rem(55px);left:px2rem(55px);
      // }
      // span:last-child{
      //   width: px2rem(22px);
      //   height: px2rem(22px);
      //   opacity: 1;
      //   font-size: px2rem(22px);
      //   font-family: PingFangSC, PingFangSC-Regular;
      //   font-weight: 400;
      //   text-align: center;
      //   color: #d10000;
      //   line-height: px2rem(22px);
      //   position: absolute;
      //   top:px2rem(82px);left:px2rem(141px);
      // }
    }
  }
  .content-pre-info{
    position: absolute;
    left: px2rem(47px); bottom: px2rem(19px);
    width: px2rem(500px);
    height: px2rem(64px);
    opacity: 1;
    font-size: px2rem(26px);
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #4f0f0f;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p{
      height: px2rem(26px);
      line-height: px2rem(26px);
    }
    // & p:nth-child(2){
    //   text-indent:3.5em;
    // }
  }
}
.record-info-next{
  padding-top: px2rem(20px);
    .btn{
        width: px2rem(230px);
        height: px2rem(72px);
        opacity: 1;
        border-radius: px2rem(16px);
        background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
        box-shadow: 0 px2rem(16px) 0px 0px #e5b56b;
        margin-left: px2rem(135px);
        border: none;
        margin-right: auto;
        margin-left: auto;
        text-align: center;
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
</style>
