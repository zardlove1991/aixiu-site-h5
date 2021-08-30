<template>
  <div class="dial-start-wrap">
    <van-cell size="small" class="dial-header" :border="false">
      <div class="dial-header-icon" slot="title">
        <div class="circle">
          <img src="" alt="" />
        </div>
        <!-- <img src="@/components/dial/main/dialog-close@3x.png" class="img" /> -->
      </div>
      <div slot="default" class="dial-header-right">
        <van-button plain class="btn-header" @click="isActivityShow=true">活动规则</van-button>
        <van-button plain class="btn-header" @click="isAddressShow=true">中奖纪录</van-button>
      </div>
    </van-cell>
    <div class="dial-container">
      <div class="container-title">厚建软件党史答题幸运 大转盘</div>
      <div class="container-title-notice">
      <van-notice-bar class="notice" scrollable
        text="疯狂派“兑”，快来邀请好友一起来参与吧！" v-if='isWheelShow'
      />
      </div>
      <div class="dial-container-wrap">
        <span class="wheel-title">你有{{count}}次抽奖机会</span>
        <div class="wheel-box">
          <div class="wheel-pointer"></div>
          <prize-list :list="list" :specified="specified" />/
        </div>
        <div class="wheel-tips">
          <van-notice-bar :scrollable="true" class="wheel-notice-bar">
            <ul class="wheel-tips-list">
              <li class="wheel-tips-item">
                <img
                  src="https://img01.yzcdn.cn/vant/cat.jpeg"
                  alt=""
                  class="wheel-item-avatar"
                />
                <div class="wheel-item-text">158****2062 获得颈椎牵引器</div>
              </li>
              <li class="wheel-tips-item">
                <img
                  src="https://img01.yzcdn.cn/vant/cat.jpeg"
                  alt=""
                  class="wheel-item-avatar"
                />
                <div class="wheel-item-text">158****2062 获得颈椎牵引器</div>
              </li>
              <li class="wheel-tips-item">
                <img
                  src="https://img01.yzcdn.cn/vant/cat.jpeg"
                  alt=""
                  class="wheel-item-avatar"
                />
                <div class="wheel-item-text">158****2062 获得颈椎牵引器</div>
              </li>
            </ul>
          </van-notice-bar>
          <van-notice-bar :scrollable="true" class="wheel-notice-bar">
            <ul class="wheel-tips-list">
              <li class="wheel-tips-item">
                <img
                  src="https://img01.yzcdn.cn/vant/cat.jpeg"
                  alt=""
                  class="wheel-item-avatar"
                />
                <div class="wheel-item-text">我**去 获得现金红包</div>
              </li>
              <li class="wheel-tips-item">
                <img
                  src="https://img01.yzcdn.cn/vant/cat.jpeg"
                  alt=""
                  class="wheel-item-avatar"
                />
                <div class="wheel-item-text">我**去 获得现金红包</div>
              </li>
            </ul>
          </van-notice-bar>
        </div>
        <div v-if="isWheelShow" class="wheel-btn-on" @click="onDraw">
          <span>立即抽奖</span>
        </div>
        <div v-else class="wheel-btn-off" @click="onDraw">
          <span>立即抽奖</span>
        </div>
        <div class="wheel-point">
          <div class="my">我的积分</div>
          <div class="point">30</div>
        </div>
      </div>
    </div>
    <ActivityRule :show='isActivityShow' @close="isActivityShow = false"/>
    <Address :show='isAddressShow' @close="isAddressShow = false"/>
    <Command :show='isCommandShow' @close ='isCommandShow = fasle'/>
  </div>
</template>

<script>
import prizeList from '@/components/dial/global/dial-prize-list'
import ActivityRule from '@/components/dial/global/dial-activity-rule'
import Address from '@/components/dial/global/dial-address'
import Command from '@/components/dial/global/dial-command'
export default {
  components: { prizeList, ActivityRule, Address, Command },
  computed: {
    animationClass () {
      // 对应css样式中定义的class属性值,如果有更多的话可以继续添加  case 8:   return 'wr8'
      switch (this.winner) {
        case 0:
          return 'wr0'
        case 1:
          return 'wr1'
        case 2:
          return 'wr2'
        case 3:
          return 'wr3'
        case 4:
          return 'wr4'
        case 5:
          return 'wr5'
        case 6:
          return 'wr6'
        case 7:
          return 'wr7'
      }
    }
  },
  data () {
    return {
      winner: 2, // 指定获奖下标 specified为true时生效
      specified: false, // 是否指定获奖结果，false时为随机
      loading: false, // 抽奖执行状态，防止用户多次点击
      panziElement: null,
      list: [
        {
          title: '现金红包',
          img: require('@/assets/dial/red-packet_1.png')
        },
        {
          title: '谢谢参与',
          img: require('@/assets/dial/red-packet_1.png')
        },
        {
          title: '铸铁珐琅锅',
          img: require('@/assets/dial/red-packet_1.png')
        },
        {
          title: '再来一次',
          img: require('@/assets/dial/red-packet_1.png')
        },
        {
          title: '优惠券',
          img: require('@/assets/dial/red-packet_1.png')
        },
        {
          title: '颈椎牵引器',
          img: require('@/assets/dial/red-packet_1.png')
        }
      ],
      isWheelShow: true, // 控制开始抽奖状态
      isActivityShow: false, // 控制活动规则状态
      isAddressShow: false, // 控制收获地址状态
      isCommandShow: true, // 控制输入口令开始抽奖状态
      count: 0
    }
  },
  created () {
    if (this.isWheelShow) this.count = 3
  },
  mounted () {
    // 通过获取奖品个数，来改变css样式中每个奖品动画的旋转角度
    // var(--nums) 实现css动画根据奖品个数，动态改变
    let root = document.querySelector(':root')
    root.style.setProperty('--nums', this.list.length)
  },
  methods: {
    // 开始抽奖
    onDraw () {
      if (!this.loading) {
        this.panziElement = document.querySelector('.prize')
        this.panziElement.classList.remove(this.animationClass)
        if (this.specified) {
          // 此处可指定后端返回的指定奖品
          // this.winner = this.winner
          this.winCallback()
        } else {
          this.winner = this.random(0, this.list.length - 1)
          this.winCallback()
        }
        this.loading = true
      }
    },
    // 中奖返回方法
    winCallback () {
      setTimeout(() => {
        /* 此处是为了解决当下次抽中的奖励与这次相同，动画不重新执行的 */
        /* 添加一个定时器，是为了解决动画属性的替换效果，实现动画的重新执行 */
        this.panziElement.classList.add(this.animationClass)
      }, 0)
      // 因为动画时间为 3s ，所以这里3s后获取结果，其实结果早就定下了，只是何时显示，告诉用户
      setTimeout(() => {
        this.loading = false
        console.log(`恭喜你获得了${this.winner}`)
      }, 3000)
    },
    // 随机一个整数的方法
    random (min, max) {
      return parseInt(Math.random() * (max - min + 1) + min)
    }
  }
}
</script>
<style scoped lang='scss'>
@import "@/styles/index.scss";
$time: 3s; //转动多少秒后停下的时间
.tips-dialog-content{
  width: px2rem(600px);
}
.dial-start-wrap {
  width: 100%;
  height: 100vh;
  @include img-retina(
    "~@/assets/dial/bg.png",
    "~@/assets/dial/bg@2x.png",
    100%,
    100%
  );
  overflow: hidden;
}
// 头部
.dial-header {
  width: 100%;
  height: px2rem(54px);
  padding-left: px2rem(30px);
  padding-right: px2rem(30px);
  // margin-bottom: px2rem(24px);
  display: flex;
  align-items: center;
  .dial-header-icon {
    width: px2rem(54px);
    height: px2rem(54px);
    background-color: #fff;
    border-radius: 0px 0px px2rem(100px) px2rem(100px);
    display: flex;
    align-items: center;
    justify-content: center;
    .circle {
      width: px2rem(50px);
      height: px2rem(50px);
      opacity: 1;
      background: #ffffff;
      border: px2rem(1px) solid #ebebeb;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      &img {
        display: block;
        width: px2rem(26px);
        height: px2rem(26px);
        background-size: cover;
        color: #000;
      }
    }
  }
  /deep/.van-cell__value {
    display: flex;
    align-items: center;
  }
  .dial-header-right {
    display: flex;
    float: right;
    .btn-header {
      margin-right: px2rem(30px);
      width: px2rem(140px);
      height: px2rem(54px);
      opacity: 0.5;
      background: #000000;
      border-radius: 0px 0px px2rem(10px) px2rem(10px);
      text-align: center;
      border: none;
      .van-button__text {
        opacity: 1;
        // @include font-dpr(26px);
        font-size: px2rem(26px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        line-height: px2rem(39px);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
// 内容
.dial-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: absolute;
  top: px2rem(78px);
  left: 0;
  right: 0;
  // display: flex;
  // align-items: center;
  .container-title-notice{
    width: px2rem(525px);
    height: px2rem(44px);
    opacity: 0.2;
    background: #000000;
    border-radius: px2rem(24px);
    margin: 0 auto px2rem(6px) auto;
    padding: (9px) auto;
    display: flex;
    align-items: center;
    justify-content: center;
    .notice{
      width: px2rem(496px);
      height: px2rem(26px);
      opacity: 1;
      font-size: px2rem(26px);
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      line-height: px2rem(26px)
    }
  }
  .container-title {
    height: px2rem(148px);
    opacity: 1;
    background: linear-gradient(180deg, #fffdfc, #ffeccf);
    /*必需加前缀 -webkit- 才支持这个text值 */
    -webkit-background-clip: text;
    /*text-fill-color会覆盖color所定义的字体颜色： */
    -webkit-text-fill-color: transparent;

    font-size: px2rem(74px);
    font-family: YouSheBiaoTiHei;
    font-style: oblique;
    font-weight: bold;
    text-align: center;
    color: #999999;
    line-height: px2rem(74px);
    letter-spacing: px2rem(1px);
    text-shadow: 0px px2rem(3px) px2rem(8px) 0px rgba(0, 0, 0, 0.15);
    margin-left: px2rem(29px);
    margin-right: px2rem(25px);
    // margin-bottom: px2rem(21px);
  }
  .dial-container-wrap {
    display: block;
    // width: 730px;
    // height: 100vh;
    width: px2rem(750px);
    height: px2rem(1115px);
    position: absolute;
    top: (21px);
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    @include img-retina(
      "~@/assets/dial/dial.png",
      "~@/assets/dial/dial@2x.png",
      100%,
      100%
    );
    padding-top: px2rem(23px);
    text-align: center;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    margin-top: px2rem(169px);
    // 转盘标题
    .wheel-title {
      width: px2rem(212px);
      height: px2rem(24px);
      opacity: 1;
      font-size: px2rem(24px);
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #fff4e3;
      line-height: px2rem(24px);
      letter-spacing: px2rem(2px);
      // margin-bottom: px2rem(59px);
    }
    // 转盘盒子
    .wheel-box {
      width: px2rem(660px);
      height: px2rem(660px);
      opacity: 0.8;
      // border: px2rem(8px) solid;
      // border-image: linear-gradient(
      //     180deg,
      //     #fff4ec,
      //     #fff58b 41%,
      //     #ffd85c 61%,
      //     rgba(255, 4, 45, 0.7)
      //   )
      //   8.22429906542056 8.22429906542056;
      border-radius: 50%;
      margin-left: auto;
      margin-right: auto;
      margin-top: px2rem(11px);
      padding-top: px2rem(38px);
      position: relative;
      // filter: blur(5px);
      // 转盘指针
      .wheel-pointer {
        @include img-retina(
          "~@/assets/dial/wheel-pointer.png",
          "~@/assets/dial/wheel-pointer@2x.png",
          100%,
          100%
        );
        width: px2rem(189px);
        height: px2rem(203px);
        position: absolute;
        top: 50%;
        left: 50%;
        background-size: cover;
        transform: translate3d(-50%, -50%, 0);
      }
      .wheel-context {
        width: px2rem(600px);
        height: px2rem(600px);
        opacity: 1;
        // border: px2rem(8px) solid;
        // border-image: linear-gradient(180deg, #ffc267, #c76d27)
        //   8.22429906542056 8.22429906542056;
        border-radius: 50%;
        margin-top: px2rem(30px);
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
        padding: 0 px2rem(30px);
        // margin-left: px2rem(65px);
        // margin-right: px2rem(65px);
        .prize-list {
          width: 100%;
          height: 100%;
          position: relative;
          .prize-item {
            width: px2rem(246px);
            height: px2rem(284px);
            margin-top: px2rem(39px);
            &:nth-child(odd) {
              @include img-retina(
                "~@/assets/dial/yellow-box.png",
                "~@/assets/dial/yellow-box@2x.png",
                100%,
                100%
              );
            }
            &:nth-child(even) {
              @include img-retina(
                "~@/assets/dial/red-box.png",
                "~@/assets/dial/red-box@2x.png",
                100%,
                100%
              );
            }
            .prize-type {
              width: px2rem(117px);
              height: px2rem(91px);
              font-size: px2rem(28px);
              font-family: PingFangSC, PingFangSC-Medium;
              font-weight: 500;
              text-align: center;
              color: #d10000;
              line-height: px2rem(91px);
              // transform: rotate(30deg);
              margin-left: auto;
              margin-right: auto;
              margin-bottom: auto;
            }
            .prize-img {
              width: px2rem(97px);
              height: px2rem(102px);
              margin-top: px2rem(39px);
              // border: 3px solid;
              // border-image: linear-gradient(180deg, #ff354d, #ffffff) 2.819759679572763 2.819759679572763;
              // border-radius: 7px 7px 8px 8px;
              // filter: blur(4px);
            }
          }
        }
      }
    }
    // 中奖信息
    .wheel-tips {
      width: px2rem(400px);
      height: px2rem(84px);
      opacity: 1;
      background: #dc0e30;
      border-radius: px2rem(12px);
      margin-left: auto;
      margin-right: auto;
      margin-top: px2rem(16px);
      padding-top: px2rem(10px);
      padding-bottom: px2rem(10px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      .notice-swipe,
      .wheel-tips-item {
        height: px2rem(22px);
        // line-height: px2rem(22px);
      }
      .wheel-notice-bar {
        height: (22px);
        // line-height: (22px);
      }
      .wheel-tips-list {
        display: flex;
        // margin-bottom: px2rem(12px);
      }
      .wheel-tips-item {
        display: flex;
        margin-right: px2rem(24px);
        .wheel-item-avatar {
          width: px2rem(22px);
          height: px2rem(22px);
          border-radius: 100%;
          margin-right: px2rem(6px);
        }
        .wheel-item-text {
          width: px2rem(294px);
          height: px2rem(22px);
          font-size: px2rem(22px);
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #fff4e3;
          line-height: px2rem(22px);
        }
      }
    }
    // 抽奖按钮
    .wheel-btn-off {
      width: px2rem(350px);
      height: px2rem(145px);
      margin-left: auto;
      margin-right: auto;
      margin-top: px2rem(-21px);
      cursor: pointer;
      @include img-retina(
        "~@/assets/dial/wheel-btn-no_1.png",
        "~@/assets/dial/wheel-btn-no_1@2x.png",
        100%,
        100%
      );
      span {
      // width: 168px;
      // height: 40px;
      font-size: px2rem(40px);
      font-family: SourceHanSansCN, SourceHanSansCN-Bold;
      font-weight: 700;
      text-align: left;
      color: #ffffff;
      line-height: px2rem(166px);
      letter-spacing: px2rem(2px);
      text-shadow: 0px px2rem(2px) px2rem(1px) 0px rgba(0, 0, 0, 0.15) inset;
        }
    }
    .wheel-btn-on {
      width: px2rem(350px);
      height: px2rem(145px);
      margin-left: auto;
      margin-right: auto;
      margin-top: px2rem(-21px);
      // @include img-retina(
      //   "~@/assets/dial/wheel-btn.png",
      //   "~@/assets/dial/wheel-btn@2x.png",
      //   100%,
      //   100%
      // );
      background: url('~@/assets/dial/wheel-btn.png') no-repeat;
      background-size: contain;
      background-position-y: 70%;
      cursor: pointer;
      span {
        font-size: px2rem(40px);
        font-family: SourceHanSansCN, SourceHanSansCN-Bold;
        font-weight: 700;
        text-align: left;
        color: #ffffff;
        // line-height: px2rem(166px);
        line-height: px2rem(145px);
        letter-spacing: px2rem(2px);
        text-shadow: 0px px2rem(2px) px2rem(1px) 0px rgba(0, 0, 0, 0.15) inset;
      }
    }
    // 我的积分
    .wheel-point {
      display: flex;
      height: px2rem(26px);
      align-items: center;
      justify-content: center;
      text-align: center;
      .my {
        width: px2rem(96px);
        height: px2rem(24px);
        opacity: 1;
        font-size: px2rem(24px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(36px);
        margin-right: px2rem(6px);
      }
      .point {
        width: px2rem(30px);
        height: px2rem(26px);
        opacity: 1;
        font-size: px2rem(26px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(39px);
      }
    }
  }
}
</style>
