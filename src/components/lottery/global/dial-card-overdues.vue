<template>
  <div class="card-overdues">
      <DialogPage :show="show" @close="onClose">
          <div slot="title" class="record-info-title">
               <span>中奖记录</span>
           </div>
          <div slot="content" class="record-info-pre">
            <div class="content-pre-title">获得 {{itemData.prize_info.award_name}}优惠券</div>
              <div class="content-pre-wrap">
                  <div class="coupon">
                      <span>{{itemData.prize_info.award_content}}</span>
                  </div>
                  <div class="overdues" v-if="itemData.status === '已过期'"></div>
              </div>
              <div class="content-pre-info">
                <p>有效期: {{itemData.prize_info.prize_date[0]}} - </p>
                <p>{{itemData.prize_info.prize_date[1]}}</p>
                <p>优惠券仅支持在本店铺使用，全场商品通用</p>
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
.card-overdues .dialog /deep/.dialog-wrap{
  height: px2rem(664px);
}
.card-overdues .dialog /deep/.dialog-wrap /deep/.dialog-pre{
  height: px2rem(394px) ;
}
.card-overdues .dialog /deep/.dialog-wrap /deep/.divider{
    top:px2rem(462px)
}
.card-overdues .dialog /deep/.dialog-wrap /deep/.dialog-next{
  height: px2rem(161px) ;
}
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
      // width: px2rem(267px);
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
    margin: px2rem(40px) auto;
    .coupon{
      position: absolute;
      top:px2rem(76px);left:px2rem(129px);
      width: px2rem(340px);
      height: px2rem(110px);
      opacity: 1;
      @include img-retina("~@/assets/lottery/coupon/coupon-bg.png",
      "~@/assets/lottery/coupon/coupon-bg@2x.png", 100%, 100%);
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
    .overdues{
      width: px2rem(122px);
      height: px2rem(102px);
      @include img-retina("~@/assets/lottery/overdues/overdues.png",
      "~@/assets/lottery/overdues/overdues@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      position: absolute;
      top:px2rem(42px);
      right:px2rem(30px);
    }
  }
  .content-pre-info{
    width: px2rem(494px);
    height: px2rem(118px);
    opacity: 1;
    font-size: px2rem(26px);
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #4f0f0f;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: px2rem(50px);
    p{
      height: px2rem(26px);
      line-height: px2rem(26px);
    }
    & p:nth-child(2){
      text-indent:3.5em;
    }
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
