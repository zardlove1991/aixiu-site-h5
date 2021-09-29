<template>
    <div class="prize-box">
      <div class="prize">
        <div
          class="prize-box-bg"
          :style="`transform: rotate(${-90 + 180 / list.length}deg)`"
        >
          <!-- <div
            class="prize-item-bg"
            v-for="(i, index) in list"
            :key="index"
            :style="`transform: rotate(${
              (-index * 360) / list.length
            }deg) skew(${-90 + 360 / list.length}deg);`"
          ></div> -->
          <div
            class="prize-item-bg"
            v-for="(i, index) in list"
            :key="index"
            :style="`transform: rotate(${
              (-index * 360) / list.length
            }deg) skew(${-90 + 360 / list.length}deg);`"
          ></div>
        </div>
        <!-- <div
          class="prize-gift"
          :style="`transform: rotate(${
            (-index * 360) / list.length
          }deg) translateY(-6rem);`"
          v-for="(i, index) in list"
          :key="index">
          <span class="circle"></span>
          <span class="title">{{ i.title }}</span>
          <div class="wechat-img" v-if="i.type ==='wechat' ">
            <img :src="i.img" alt />
            <div class="wechat center"  v-if="i.desc.length === 5">{{i.desc}}</div>
            <div class="wechat" v-else >{{i.desc}}</div>
          </div>
          <div class="tocket-img" v-if="i.type ==='tocket' ">
            <img :src="i.img" alt />
            <div class="tocket center" v-if="i.desc.length === 4" >{{i.desc}}</div>
            <div class="tocket" v-else >{{i.desc}}</div>
          </div>
          <div class="integral-img" v-if="i.type ==='integral' ">
            <img :src="i.img" alt />
            <div class="integral"  >{{i.desc}}</div>
            <div class="integral-name">积分</div>
          </div>
          <div class="wx-packet-img" v-if="i.type ==='wx-packet' ">
            <img :src="i.img" alt />
          </div>
          <div class="thanking-img" v-if="i.type ==='thanking' ">
            <img :src="i.img" alt />
          </div>
          <div class="again-img" v-if="i.type ==='again' ">
            <img :src="i.img" alt />
          </div>
        </div> -->
        <template>
          <!-- <div
            class="prize-gift"
            :style="`transform: rotate(${
              (-index * 360) / list.length
            }deg) translateY(-6rem);`"
            v-for="(i, index) in list"
            :key="index"
            > -->
          <div
            class="prize-gift"
            :style="`transform: rotate(${
              (-index * 360) / list.length
            }deg) translateY(-6rem);`"
            v-for="(i, index) in list"
            :key="index"
            >
            <span class="circle"></span>
            <span class="title">{{ i.is_award_name }}</span>
            <div class="wechat-img" v-if="i.type ===4 ">
              <img :src="i.images" alt />
              <div class="wechat center"  v-if="i.choose_award.is_prize_name.length === 5">{{i.choose_award.is_prize_name}}</div>
              <div class="wechat" v-else >{{i.choose_award.is_prize_name}}</div>
            </div>
            <div class="tocket-img" v-if="i.type ===2 ">
              <img :src="i.images" alt />
              <div class="tocket center" v-if="i.choose_award.is_prize_name.length === 4" >{{i.choose_award.is_prize_name}}</div>
              <div class="tocket" v-else >{{i.choose_award.is_prize_name}}</div>
            </div>
            <div class="integral-img" v-if="i.type ===5 ">
              <img :src="i.images" alt />
              <div class="integral" >{{i.choose_award.is_prize_integral}}</div>
              <div class="integral-name">积分</div>
            </div>
            <div class="wx-packet-img" v-if="i.type ===3 ">
              <img :src="i.images" alt />
            </div>
            <div class="thanking-img" v-if="i.type === 7">
              <img :src="i.images" alt />
            </div>
            <div class="again-img" v-if="i.type ===6 ">
              <img :src="i.images" alt />
            </div>
            <div class="physical-img" v-if="i.type ===1 ">
              <img :src="i.images" alt />
            </div>
          </div>
        </template>
      </div>
      <div class="start-btn"></div>
    </div>
</template>

<script>
export default {
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
      panziElement: null,
      length: ''
    }
  },
  props: {
    list: {
      type: Array,
      require: true
    },
    winner: { // 指定获奖下标 specified为true时生效
      type: Number,
      default: 0
    },
    specified: { // 是否指定获奖结果，false时为随机
      type: Boolean,
      default: false
    },
    loading: { // 抽奖执行状态，防止用户多次点击
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.length = this.list.length
    // 通过获取奖品个数，来改变css样式中每个奖品动画的旋转角度
    // var(--nums) 实现css动画根据奖品个数，动态改变
    // let root = document.querySelector(':root')
    // root.style.setProperty('--nums', this.list.length)
  },
  methods: {
    // // 开始抽奖
    // start () {
    //   if (!this.loading) {
    //     this.panziElement = document.querySelector('.prize')
    //     this.panziElement.classList.remove(this.animationClass)
    //     if (this.specified) {
    //       // 此处可指定后端返回的指定奖品
    //       // this.winner = this.winner
    //       this.winCallback()
    //     } else {
    //       this.winner = this.random(0, this.list.length - 1)
    //       this.winCallback()
    //     }
    //     this.loading = true
    //   }
    // },
    // // 中奖返回方法
    // winCallback () {
    //   setTimeout(() => {
    //     /* 此处是为了解决当下次抽中的奖励与这次相同，动画不重新执行的 */
    //     /* 添加一个定时器，是为了解决动画属性的替换效果，实现动画的重新执行 */
    //     this.panziElement.classList.add(this.animationClass)
    //   }, 0)
    //   // 因为动画时间为 3s ，所以这里3s后获取结果，其实结果早就定下了，只是何时显示，告诉用户
    //   setTimeout(() => {
    //     this.loading = false
    //     console.log(`恭喜你获得了${this.winner}`)
    //   }, 3000)
    // },
    // // 随机一个整数的方法
    // random (min, max) {
    //   return parseInt(Math.random() * (max - min + 1) + min)
    // }
  }
}
</script>
<style scoped lang='scss'>
@import "@/styles/index.scss";
// $zp_size: 23rem; //转盘尺寸
$zp_size: px2rem(600px); //转盘尺寸
// $btn_size: 7rem; //抽奖按钮尺寸
$btn_sizeW: px2rem(189px); //抽奖按钮尺寸
$btn_sizeH: px2rem(203px); //抽奖按钮尺寸
$time: 3s; //转动多少秒后停下的时间
.prize-box {
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: $zp_size;
  height: $zp_size;
  border-radius: 100%;
  margin-left: auto;
  margin-right: auto;
  // transform: rotate(135deg);
  &.rotate30 {
    transform: rotate(30deg);
  }
  /* 抽奖按钮 */
  .start-btn {
    display: inline-block;
    width: $btn_sizeW;
    height: $btn_sizeH;
    @include img-retina(
      "~@/assets/lottery/wheel-pointer.png",
      "~@/assets/lottery/wheel-pointer@2x.png",
      100%,
      100%
    );
    background-size: cover;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
    &.rotate30 {
      transform: rotate(-30deg);
    }
  }
  /* 盘子样式 */
  .prize {
    overflow: hidden;
    border-radius: 50%;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    // position: relative;
    // border: 10px solid #f74e4e;
    box-sizing: border-box;
    // transform: rotate(30deg);
    /* 每个奖项的样式 */
    .prize-gift {
      position: absolute;
      .title {
        // font-weight: bold;
        // font-size: 18px;
        // color: #3b3b3b;
        font-size: px2rem(28px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #d10000;
      }
      .physical-img {
        width: px2rem(124px);
        height: px2rem(111px);
        opacity: 1;
        background-size: contain;
        margin: auto;
        position: relative;
        &.physical-img-7 {
           width: px2rem(100px);
        }
      }
      .wechat-img{
        width: px2rem(110px);
        height: px2rem(84px);
        background-size: cover;
        margin: auto;
        position: relative;
        .wechat{
          position: absolute;
          top:px2rem(25px);
          left:px2rem(24px);
          width: px2rem(61px);
          height: px2rem(34px);
          opacity: 1;
          font-size: px2rem(16px);
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: center;
          color: #ffeccf;
          line-height: px2rem(16px);
          &.center{
             line-height: px2rem(34px);
          }
        }
      }
      .tocket-img{
        width: px2rem(110px);
        height: px2rem(88px);
        background-size: cover;
        margin: auto;
        position: relative;
        .tocket{
          position: absolute;
          top:px2rem(25px);
          left:px2rem(24px);
          width: px2rem(64px);
          height: px2rem(42px);
          opacity: 1;
          font-size: px2rem(16px);
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: center;
          color: #ffeccf;
           line-height: px2rem(21px);
          &.center{
            line-height: px2rem(42px);
          }
        }
      }
      .integral-img{
          width: px2rem(72px);
          height: px2rem(80px);
          background-size: cover;
          margin: auto;
          position: relative;
        .integral{
          position: absolute;
          top:px2rem(25px);
          left:px2rem(23px);
          width: px2rem(27px);
          height: px2rem(21px);
          opacity: 1;
          font-size: px2rem(22px);
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: center;
          color: #d10000;
          line-height: px2rem(21px);
        }
        .integral-name{
          position: absolute;
          bottom:px2rem(18px);
          left:px2rem(27px);
          width: px2rem(20px);
          height: px2rem(12px);
          opacity: 0.8;
          font-size: px2rem(10px);
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #d10000;
          line-height: px2rem(11px);
        }
      }
      .wx-packet-img{
        width: px2rem(92px);
        height: px2rem(108px);
        background-size: cover;
        margin: auto;
        position: relative;
      }
      .thanking-img{
        width: px2rem(94px);
        height: px2rem(108px);
        background-size: cover;
        margin: auto;
        position: relative;
      }
      .again-img{
        width: px2rem(103px);
        height: px2rem(103px);
        background-size: cover;
        margin: auto;
        position: relative;
      }
      .img {
        // margin: 0.5rem auto;
        // width: 2.5rem;
        // height: 2.5rem;
        // line-height: 2.5rem;
        // border: 2px dashed #f87373;
        // overflow: hidden;
        // color: white;
        width: px2rem(97px);
        height: px2rem(102px);
        opacity: 1;
        background-size: cover;
        margin: auto;
        position: relative;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .prize-box-bg {
    overflow: hidden;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 100%;
    /* 转盘扇形背景 */
    .prize-item-bg {
      box-sizing: border-box;
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 1;
      top: -50%;
      left: 50%;
      transform-origin: 0% 100%;
    }
    /* 转盘背景色 */
    .prize-item-bg:nth-child(2n) {
      background: #fffcb9;
      // background: linear-gradient(116deg, #ffe2b7 17%, #fff5e2);
      // background: linear-gradient(243deg,#ff0045, #ff4e2b 81%);
      // background: linear-gradient(60deg  #FF2638 10%, #FFEDD1 90%);

    }
    .prize-item-bg:nth-child(2n + 1) {
      background: #FFF1D8;
      // background: linear-gradient(297deg, #e47f43 17%, #ffbe81);
    }
  }
  /* 下面的css样式为每个奖品的旋转动画，这里写了对应8个奖品的动画，如果想要更多的话，可以添加 */
  /* 例如： .wr8  @keyframes play8 */
  .wr0,
  .wr1,
  .wr2,
  .wr3,
  .wr4,
  .wr5,
  .wr6,
  .wr7 {
    animation-duration: $time;
    animation-timing-function: ease;
    animation-fill-mode: both;
    animation-iteration-count: 1;
  }
  .wr0 {
    animation-name: play0;
  }
  .wr1 {
    animation-name: play1;
  }
  .wr2 {
    animation-name: play2;
  }
  .wr3 {
    animation-name: play3;
  }
  .wr4 {
    animation-name: play4;
  }
  .wr5 {
    animation-name: play5;
  }
  .wr6 {
    animation-name: play6;
  }
  .wr7 {
    animation-name: play7;
  }
  @keyframes play0 {
    to {
      transform: rotate(calc(5 * 360deg + 360deg / var(--nums) * 0));
    }
  }
  @keyframes play1 {
    to {
      transform: rotate(calc(5 * 360deg + 360deg / var(--nums) * 1));
    }
  }
  @keyframes play2 {
    to {
      transform: rotate(calc(5 * 360deg + 360deg / var(--nums) * 2));
    }
  }
  @keyframes play3 {
    to {
      transform: rotate(calc(5 * 360deg + 360deg / var(--nums) * 3));
    }
  }
  @keyframes play4 {
    to {
      transform: rotate(calc(5 * 360deg + 360deg / var(--nums) * 4));
    }
  }
  @keyframes play5 {
    to {
      transform: rotate(calc(5 * 360deg + 360deg / var(--nums) * 5));
    }
  }
  @keyframes play6 {
    to {
      transform: rotate(calc(5 * 360deg + 360deg / var(--nums) * 6));
    }
  }
  @keyframes play7 {
    to {
      transform: rotate(calc(5 * 360deg + 360deg / var(--nums) * 7));
    }
  }
  // @keyframes play0 {
  //   to {
  //     transform: rotate(calc(var(--nums) * 360deg + 360deg / var(--nums) * 0));
  //   }
  // }
  // @keyframes play1 {
  //   to {
  //     transform: rotate(calc(var(--nums) * 360deg + 360deg / var(--nums) * 1));
  //   }
  // }
  // @keyframes play2 {
  //   to {
  //     transform: rotate(calc(var(--nums) * 360deg + 360deg / var(--nums) * 2));
  //   }
  // }
  // @keyframes play3 {
  //   to {
  //     transform: rotate(calc(var(--nums) * 360deg + 360deg / var(--nums) * 3));
  //   }
  // }
  // @keyframes play4 {
  //   to {
  //     transform: rotate(calc(var(--nums) * 360deg + 360deg / var(--nums) * 4));
  //   }
  // }
  // @keyframes play5 {
  //   to {
  //     transform: rotate(calc(var(--nums) * 360deg + 360deg / var(--nums) * 5));
  //   }
  // }
  // @keyframes play6 {
  //   to {
  //     transform: rotate(calc(var(--nums) * 360deg + 360deg / var(--nums) * 6));
  //   }
  // }
  // @keyframes play7 {
  //   to {
  //     transform: rotate(calc(var(--nums) * 360deg + 360deg / var(--nums) * 7));
  //   }
  // }
}
</style>
