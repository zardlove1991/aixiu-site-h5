<template>
<div v-if='show' class='lottery-tips-wrap'>
  <div class="lottery-tips-wrap-dialog">
    <div class='tips-wrap'>抽奖提示</div>
    <div @click.stop='closeLotteryTipsFun' class='close-icon-box'>
      <img :src="closeIcon" alt="">
    </div>
    <div class='lottery-list-wrap'>
      <template v-for='(item, index) in lotteyList'>
        <div v-if='item.isShowBox' :key='index' class='single-lottery-box'>
          <div class='single-lottery-left'>
            <img :src="item.img" alt="" class='img-box'>
            <div>
              <div>{{item.title}}</div>
              <div>可抽奖{{item.raffle_num}}次</div>
            </div>
          </div>
          <div v-if='item.isLotterNum' @click='goLotterFun(item)' class='btn-style'>去抽奖</div>
          <div v-if='item.isLotterList' @click='goRecoredList(item)' class='btn-style'>中奖记录</div>
        </div>
      </template>

    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    lotteryObj: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      closeIcon: require('@/assets/vote/close.png'),
      imgs: {
        enroll: require('@/assets/vote/enroll.png'),
        vote: require('@/assets/vote/vote.png')
      },
      lotteyList: [
        {
          img: require('@/assets/vote/enroll.png'),
          title: '',
          tips: '',
          raffle_num: 0,
          isShowBox: true,
          isLotterNum: false,
          isLotterList: false,
          lotterListUrl: '',
          goLotter: '',
          data: {}
        },
        {
          img: require('@/assets/vote/vote.png'),
          title: '',
          tips: '',
          raffle_num: 0,
          isShowBox: true,
          isLotterNum: false,
          isLotterList: false,
          lotterListUrl: '',
          goLotter: '',
          data: {}
        }
      ]

    }
  },
  components: {

  },
  mounted () {
    this.renderList1()
    this.renderList2()
  },
  methods: {
    closeLotteryTipsFun () {
      this.$emit('closeLotteryTipsFun')
    },
    renderList1 () {
      let _enroll = this.lotteryObj.enroll
      this.lotteyList[0].title = _enroll.name
      this.lotteyList[0].raffle_num = _enroll.raffle_num

      this.lotteyList[0].lotterListUrl = 'lotteryRecord'
      this.lotteyList[0].goLotter = 'lotteryDial'

      this.lotteyList[0].data = _enroll
      if (_enroll.raffle_num === 0 && _enroll.is_win === 0) {
        this.lotteyList[0].isShowBox = false
      } else {
        this.lotteyList[0].isShowBox = true
      }
      if (_enroll.raffle_num > 0) {
        this.lotteyList[0].isLotterNum = true // 抽奖
        return false
      } else {
        if (_enroll.is_win > 0) {
          this.lotteyList[0].isLotterList = true
        }
      }
    },
    renderList2 () {
      let _voteRelation = this.lotteryObj.vote_relation
      this.lotteyList[1].title = _voteRelation.name
      this.lotteyList[1].raffle_num = _voteRelation.raffle_num

      this.lotteyList[1].lotterListUrl = 'lotteryRecord'
      this.lotteyList[1].goLotter = 'lotteryDial'

      this.lotteyList[1].data = _voteRelation
      if (_voteRelation.raffle_num === 0 && _voteRelation.is_win === 0) {
        this.lotteyList[1].isShowBox = false
      } else {
        this.lotteyList[1].isShowBox = true
      }
      if (_voteRelation.raffle_num > 0) {
        this.lotteyList[1].isLotterNum = true // 抽奖
        return false
      } else {
        if (_voteRelation.is_win > 0) {
          this.lotteyList[1].isLotterList = true
        }
      }
    },
    goLotterFun (data) {
      this.$router.push({
        name: data.goLotter,
        query: { id: data.data.id }
      })
    },
    goRecoredList (data) {
      this.$router.push({
        name: data.goLotter,
        query: { id: data.data.id }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/index.scss";
.lottery-tips-wrap{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: px2rem(16px);
  .lottery-tips-wrap-dialog{
    position: relative;
    border-radius: px2rem(16px);
    width: px2rem(600px);
    height: px2rem(450px);
    background: linear-gradient(360deg, #FFEDE8 0%, #FFFFFF 100%);
    background-size: px2rem(600px) px2rem(450px);
    pointer-events: auto;
    padding: 15px;
    .tips-wrap{
      color: #333333;
      font-size: px2rem(32px);
      text-align: center;
      margin-top: px2rem(20px);
    }
    .close-icon-box{
      position: absolute;
      top: px2rem(30px);
      right: px2rem(30px);
      &>img{
        width: px2rem(30px);
        height: px2rem(30px);
      }
    }
  }
}

.lottery-list-wrap{
  .single-lottery-box{
    margin-top: px2rem(40px);
  }
  .single-lottery-box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .single-lottery-left{
      display: flex;
      justify-content: flex-start;
      &>div:nth-of-type(1) {
        margin-left: px2rem(20px);
        &>div:nth-child(1) {
          color: #333333;
          font-size: px2rem(32px);
          width: px2rem(250px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &>div:nth-child(2) {
          color: #999999;
          font-size: px2rem(24px);
        }
      }
    }

    .img-box{
      width: px2rem(80px);
      height: px2rem(80px);
    }

    .btn-style{
      width: px2rem(150px);
      height: px2rem(60px);
      line-height: px2rem(60px);
      border-radius: px2rem(30px);
      background: linear-gradient(225deg, #FF572A 0%, #FFA878 100%);
      color: #ffffff;
      font-weight: 500;
      text-align: center;
    }
  }
}
</style>
