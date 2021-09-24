<template>
  <div class="card-packet" v-if="show">
      <DialogPage :show="show" @close="onClose">
          <div slot="title" class="record-info-title">
               <span>中奖记录</span>
           </div>
          <div slot="content" class="record-info-pre">
            <div class="content-pre-title">获得{{itemData.prize_info.award_name}}红包</div>
              <div class="content-pre-wrap">
                  <div class="packet"></div>
              </div>
            <div class="content-pre-info">
                <p>现金红包需在24小时内前往公众号领取，超 </p>
                <p>时自动过期</p>
            </div>
          </div>
          <div slot="content-next" class="record-info-next">
            <div class="grounp-btns-wrap">
                <van-button  block  class="btn"><span>返回</span></van-button>
                <van-button  block  class="btn"><span>立即领取</span></van-button>
            </div>
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
    show: {type: Boolean, require: true}
  },
  data () {
    return {}
  },
  computed: {},
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
.card-packet .dialog /deep/.dialog-wrap{
  height: px2rem(700px);
}
.card-packet .dialog /deep/.dialog-wrap /deep/.dialog-pre{
  height: px2rem(463px) ;
}
.card-packet .dialog /deep/.dialog-wrap /deep/.divider{
    // top:px2rem(462px)
    top:px2rem(531px)
}
.card-packet .dialog /deep/.dialog-wrap /deep/.dialog-next{
  height: px2rem(129px);
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
    height: px2rem(110px);
    // margin: px2rem(40px) auto;
    margin-top: px2rem(23px);
    margin-bottom: px2rem(16px);
    .packet{
      position: absolute;
      top:px2rem(55px);left:px2rem(181px);
      width: px2rem(228px);
      height: px2rem(242px);
      opacity: 1;
      @include img-retina("~@/assets/lottery/red-packet_1.png",
      "~@/assets/lottery/red-packet_1@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      text-align: center;
      span{
        height: px2rem(44px);
        opacity: 1;
        font-size: px2rem(44px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(110px);
      }
    }
  }
  .content-pre-info{
    position: absolute;
    left: px2rem(47px); bottom: 0;
    width: px2rem(500px);
    height: px2rem(100px);
    opacity: 1;
    font-size: px2rem(26px);
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #4f0f0f;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
//   margin-top: px2rem(20px);
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
}
</style>
