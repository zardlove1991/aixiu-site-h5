<template>
  <div class="overall">
    <div class="zp-box">
      <div class="prize ">
        <div class="bck-box" :style="`transform: rotate(${-90 + 360/list.length}deg)`" v-cloak>
          <div
            class="bck"
            v-for="(i,index) in list"
            :key="index"
            :style="`transform: rotate(${index*360/list.length}deg) skew(${-90 + 360/list.length}deg);`"
          ></div>
        </div>
        <div
          class="jiang"
          :style="`transform: rotate(${index*360/list.length + (360 / list.length)/ 2}deg) translateY(-6rem);`"
          v-for="(i,index) in list"
          :key="index"
        >
          <span class="title">{{i.is_award_name}}</span>
          <div class="img thanking"  v-show="i.type ===7">
            <img src="@/assets/lottery/thanking.png" alt />
          </div>
          <div class="img again"  v-show="i.type ===6">
            <img src="@/assets/lottery/face.png" alt />
          </div>
          <div class="img integral"  v-show="i.type ===5">
           <!-- <img src="@/assets/lottery/integral/integral.png" alt /> -->
            <!-- <div class="integral-count integral-count-1" >{{i.choose_award.is_prize_integral}}</div> -->
            <div class="integral-count">{{i.choose_award.is_prize_integral}}</div>
            <div class="integral-name">积分</div>
          </div>
           <div class="img wechat"  v-show="i.type ===4">
            <img src="@/assets/lottery/wechat.png" alt />
            <div class="wechat-name center"  v-if="i.choose_award.is_prize_name.length > 4">{{i.choose_award.is_prize_name}}</div>
            <div class="wechat-name" v-else >{{i.choose_award.is_prize_name}}</div>
          </div>
           <div class="img wx-packet"  v-show="i.type ===3">
            <img src="@/assets/lottery/wx-packet.png" alt />
          </div>
          <div class="img tocket"  v-show="i.type ===2">
            <img src="@/assets/lottery/tocket.png" alt />
            <div class="tocket-name center" v-if="i.choose_award.is_prize_name.length > 4" >{{i.choose_award.is_prize_name}}</div>
            <div class="tocket-name" v-else >{{i.choose_award.is_prize_name}}</div>
          </div>
          <div class="img physical"  v-show="i.type ===1">
            <img :src="i.images" alt/>
          </div>
        </div>
      </div>
      <div class="start-btn" ></div>
    </div>
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
    //   winner: 2, // 指定获奖下标 specified为true时生效
    //   specified: false, // 是否指定获奖结果，false时为随机
    //   loading: false, // 抽奖执行状态，防止用户多次点击
    //   panziElement: null,
    //   list: [
    //     {
    //       title: '特等奖'
    //     },
    //     {
    //       title: '一等奖'
    //     },
    //     {
    //       title: '二等奖'
    //     },
    //     {
    //       title: '三等奖'
    //     },
    //     {
    //       title: '四等奖'
    //     },
    //     {
    //       title: '五等奖'
    //     },
    //     {
    //       title: '六等奖'
    //     },
    //     {
    //       title: '七等奖'
    //     }
    //   ]
    }
  },
  props: {
    list: {
      type: Array,
      require: true
    }
  },
  mounted () {
    // 通过获取奖品个数，来改变css样式中每个奖品动画的旋转角度
    // var(--nums) 实现css动画根据奖品个数，动态改变
    // let root = document.querySelector(':root')
    // root.style.setProperty('--nums', this.list.length)
  },
  watch: {
    // list: {
    //   handler: function (newValue, oldValue) {
    //     this.detailInfo = newValue
    //     // console.log('%cdetailInfo：', 'color: red;font-size:14px;', newValue.remain_counts)
    //   },
    //   deep: true,
    //   immediate: true
    // }
    // list (value) {
    //   this.list.forEach((item, index) => {
    //     switch (item.type) {
    //       case 1:
    //         this.$set(item, 'is_award_name', value[index].is_award_name)
    //         break
    //       case 6:
    //         this.$set(item, 'is_award_name', value[index].is_award_name)
    //         break
    //     }
    //   })
    // }
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
<style lang="scss" scoped>
@import "@/styles/index.scss";
[v-cloak] {
  display: none;
}
// $zp_size: 23rem; //转盘尺寸
// $btn_size: 7rem; //抽奖按钮尺寸
$zp_size: px2rem(600px); //转盘尺寸
$btn_sizeW: px2rem(189px); //抽奖按钮尺寸
$btn_sizeH: px2rem(203px); //抽奖按钮尺寸
$time: 5s; //转动多少秒后停下的时间
.zp-box {
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: $zp_size;
  height: $zp_size;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  -webkit-transform: translate3d(0,0,0); /*开启硬件加速*/
  -webkit-backface-visibility: hidden; /*元素旋转时隐藏背面*/
  -webkit-transform-style: preserve-3d; /*保留3D空间*/
  /* 抽奖按钮 */
  .start-btn {
    display: inline-block;
    // background: #f53737;
    position: relative;
    z-index: 2;
    cursor: pointer;
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
    font-size: 30px;
    font-weight: bold;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
    // &::before {
    //   content: '';
    //   width: 0;
    //   height: 0;
    //   border: 2rem solid transparent;
    //   border-top: 3rem solid transparent;
    //   border-bottom: 3rem solid #f53737;
    //   position: absolute;
    //   top: -5rem;
    //   z-index: -1;
    // }
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
    border: 10px solid #f74e4e;
    box-sizing: border-box;
    // -webkit-transform-style: preserve-3d;
    // -webkit-backface-visibility: hidden;
    // -webkit-perspective: 1000;
    -webkit-transform: translate3d(0,0,0); /*开启硬件加速*/
    -webkit-backface-visibility: hidden; /*元素旋转时隐藏背面*/
    -webkit-transform-style: preserve-3d; /*保留3D空间*/
    /* 每个奖项的样式 */
    .jiang {
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
        line-height: px2rem(40px);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .img {
        // margin: 0.5rem auto;
        // width: 2.5rem;
        // height: 2.5rem;
        // line-height: 2.5rem;
        // border: 2px dashed #f87373;
        overflow: hidden;
        color: white;
        position: relative;
        &.thanking{
           width: px2rem(105px);
          height: px2rem(105px);
        }
        &.again{
          width: px2rem(94px);
          height: px2rem(108px);
        }
        &.integral{
          width: px2rem(72px);
          height: px2rem(80px);
          display: flex;
          flex-direction: column;
          padding-top: px2rem(20px);
          background-repeat: no-repeat;
          @include img-retina("~@/assets/lottery/integral/integral.png","~@/assets/lottery/integral/integral.png",100%,100%);
        }
        &.wechat{
          width: px2rem(110px);
          height: px2rem(88px);
        }
        &.wx-packet{
          width: px2rem(92px);
          height: px2rem(108px);
        }
        &.tocket{
          width: px2rem(110px);
          height: px2rem(88px);
        }
        &.physical{
          width: px2rem(103px);
          height: px2rem(103px);
          padding: px2rem(12px);
          border-radius: px2rem(8px);
        }
        img {
          height: 100%;
        }
        .integral-count{
          font-size: px2rem(22px);
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: center;
          color: #d10000;
          // transform: scale(.7);
          // position: absolute;
          // top:px2rem(20px);
          // left:px2rem(24px);
          // margin: auto;
          // &.integral-count-1{
          //   left:px2rem(28px);
          // }
          // &.integral-count-2{
          //   left:px2rem(26px);
          // }
          // position: absolute;
        }
        .integral-name {
          opacity: 0.8;
          // font-size: px2rem(10px);
          font-size: px2rem(14px);
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #d10000;
          // position: absolute;
          // bottom:px2rem(18px);
          // left:px2rem(27px);
        }
        .wechat-name{
          width: px2rem(61px);
          height: px2rem(34px);
          opacity: 1;
          font-size: px2rem(16px);
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: center;
          color: #ffeccf;
          position: absolute;
          top:px2rem(25px);
          left:px2rem(24px);
          line-height: px2rem(16px);
           &.center{
            line-height: px2rem(34px);
          }
        }
        .tocket-name{
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
    }
  }
  .bck-box {
    overflow: hidden;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    // background: blue;
    border-radius: 50%;

    /* 转盘扇形背景 */
    .bck {
      box-sizing: border-box;
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 1;
      top: -50%;
      left: 50%;
      transform-origin: 0% 100%;
      // transform:skew(30deg);
    }
    /* 转盘背景色 */
    .bck:nth-child(2n) {
      // background: #fffcb9;
      background: linear-gradient(243deg,#ffe2b7, #fff5e2 81%);
    }
    .bck:nth-child(2n + 1) {
      background: linear-gradient(297deg,#ffe2b7 18%, #fff5e2);
      // background: linear-gradient(243deg,#ff0045, #ff4e2b 81%);
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
      transform: rotate(calc(5 * 360deg + 360deg / var(--nums) * 2 - 360deg / var(--nums) / 2));
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
}
</style>
