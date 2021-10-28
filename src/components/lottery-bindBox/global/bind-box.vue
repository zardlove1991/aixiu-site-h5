<template>
    <div class="bindBox-wrap">
        <!-- <h1 class="title">VUE实现九宫格抽奖</h1> -->
        <div class="lottery">
            <div class="lottery-item">
                <div class="lottery-start">
                    <div class="box gray" v-if="isStart===0">
                        <p>活动未开始</p>
                    </div>
                    <!-- <div class="box" @click="startLottery" v-if="isStart===1">
                        <p><b>抽奖</b></p>
                        <p>消耗{{score}}积分</p>
                    </div> -->
                    <div class="box gray" v-if="isStart===2">
                        <p>活动已过期</p>
                    </div>
                </div>
                <ul>
                    <li v-for="(item,i) in list" :class="i==index?'on':''" :key="i">
                        <div class="box">
                            <!-- <p><img :src="item.img" alt=""></p> -->
                            <!-- <p>{{item.title}}</p> -->
                        </div>
                        <p class="index">{{i + 1}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 中奖弹窗 -->
        <div class="mask" v-if="showToast"></div>
        <div class="lottery-alert" v-if="showToast">
            <h1>恭喜您</h1>
            <p><img src="~@/assets/lottery/wx-packet.png" alt=""></p>
            <h2>获得{{list[index].title}}</h2>
            <div class="btnsave" @click="showToast=false">确定</div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'app',
  data () {
    return {
      // list: [{
      //   img: require('@/assets/lottery/thanking.png'),
      //   title: '谢谢参与'
      // },
      // {
      //   img: require('@/assets/lottery/wx-packet.png'),
      //   title: '美女一个'
      // },
      // {
      //   img: require('@/assets/lottery/wx-packet.png'),
      //   title: '宝马一辆'
      // },
      // {
      //   img: require('@/assets/lottery/thanking.png'),
      //   title: '单车一辆'
      // },
      // {
      //   img: require('@/assets/lottery/wx-packet.png'),
      //   title: '鸡蛋一蓝'
      // },
      // {
      //   img: require('@/assets/lottery/thanking.png'),
      //   title: '500红包'
      // },
      // {
      //   img: require('@/assets/lottery/wx-packet.png'),
      //   title: '靓号一个'
      // },
      // {
      //   img: require('@/assets/lottery/wx-packet.png'),
      //   title: '靓号一个'
      // },
      // {
      //   img: require('@/assets/lottery/thanking.png'),
      //   title: '鲜花一蓝'
      // }
      // ], // 奖品1-9
    }
  },
  props: {
    index: Number,
    count: Number,
    timer: Number,
    speed: Number,
    times: Number,
    cycle: Number,
    prize: Number,
    click: Boolean,
    showToast: Boolean,
    isStart: Number,
    list: Array
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
    .bindBox-wrap {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        // padding-top: px2rem(33px);
        // margin-top: 60px;
    }

    * {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }

    body {
        background: radial-gradient(49% 160%, #22b5ff 0, #3a72fa 100%);
        font-size: 14px;
    }

    img {
        border: 0px;
    }

    ul,
    li {
        list-style-type: none;
    }

    .lottery-box {
        overflow: hidden;
    }

    .lottery-box .title {
        text-align: center;
        padding: 50px 0;
        font-size: 18px;
        color: #fff;
    }

    .lottery {
        animation: changeBg .5s ease infinite;
        overflow: hidden;
        // padding: 20px;
        width: px2rem(535px);
        margin: 0 auto;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        // margin-top: 20px;
    }

    @keyframes changeBg {
        0% {
          // @include img-retina("~@/assets/lottery-bindBox/bind-box-maker.png",
          // "~@/assets/lottery-bindBox/bind-box-maker@2x.png",100%,100%);
            @include img-retina("~@/assets/lottery-bindBox/box-bg1.png",
            "~@/assets/lottery-bindBox/box-bg1@2x.png",100%,100%);
            // background-image: url(./assets/k1.png);
        }

        100% {
          // @include img-retina("~@/assets/lottery-bindBox/bind-box-maker.png",
          // "~@/assets/lottery-bindBox/bind-box-maker@2x.png",100%,100%);
           @include img-retina("~@/assets/lottery-bindBox/box-bg1.png",
            "~@/assets/lottery-bindBox/box-bg1@2x.png",100%,100%);
            // background-image: url(./assets/k2.png);
        }
    }

    .lottery .lottery-item {
        // height: 340px;
        height: px2rem(540px);
        position: relative;
        // margin-top: 10px;
        margin-left: 10px;
    }
    .lottery .lottery-item ul {
        display: flex;
        flex-wrap: wrap;
    }
    .lottery .lottery-item ul li {
        // width: 33.33333333%;
        // position: absolute;
        // padding-right: 10px;
        width: px2rem(92px);
        height: px2rem(143px);
        margin-right: px2rem(40px);
        margin-bottom: px2rem(29px);
        &:first-child,&:nth-child(4),&:nth-child(7){
            margin-left: px2rem(52px);
        }
    }

    // .lottery .lottery-item ul li:nth-child(2) {
    //     left: 33.33333333%;
    // }

    // .lottery .lottery-item ul li:nth-child(3) {
    //     left: 66.66666666%;
    // }

    // .lottery .lottery-item ul li:nth-child(4) {
    //     left: 66.66666666%;
    //     top: 110px;
    // }

    // .lottery .lottery-item ul li:nth-child(5) {
    //     left: 66.66666666%;
    //     top: 220px;
    // }

    // .lottery .lottery-item ul li:nth-child(6) {
    //     left: 33.33333333%;
    //     top: 220px;
    // }

    // .lottery .lottery-item ul li:nth-child(7) {
    //     left: 0;
    //     top: 220px;
    // }

    // .lottery .lottery-item ul li:nth-child(8) {
    //     left: 0;
    //     top: 110px;
    // }
    .lottery .lottery-item ul li {
        &:nth-child(1) .box, &:nth-child(6) .box, &:nth-child(7) .box{
            @include img-retina("~@/assets/lottery-bindBox/box-bg1.png",
            "~@/assets/lottery-bindBox/box-bg1@2x.png",100%,100%);
        }
        &:nth-child(2) .box, &:nth-child(4) .box, &:nth-child(8) .box{
            @include img-retina("~@/assets/lottery-bindBox/box-bg2.png",
            "~@/assets/lottery-bindBox/box-bg2@2x.png",100%,100%);
        }
        &:nth-child(3) .box, &:nth-child(5) .box, &:nth-child(9) .box{
            @include img-retina("~@/assets/lottery-bindBox/box-bg3.png",
            "~@/assets/lottery-bindBox/box-bg3@2x.png",100%,100%);
        }
    }
    .lottery .lottery-item ul li .box {
        width: px2rem(92px);
        height: px2rem(113px);
        position: relative;
        text-align: center;
        overflow: hidden;
        // background: url(./assets/bg2.png) no-repeat center;
        // background: url('../../../assets/lottery-bindBox/box-bg1.png') no-repeat center;
        // background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-bottom: px2rem(8px);
    }

    .lottery .lottery-item ul li .box img {
        display: block;
        height: 50px;
        margin: 0 auto;
        // margin-top: 10px;
        // margin-bottom: 5px;
    }

    .lottery .lottery-item ul li .box p {
        color: #708ABF;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
    }
    // .lottery .lottery-item ul li .box .index {
    .lottery .lottery-item ul li .index {
        width: px2rem(40px);
        height: px2rem(22px);
        background: linear-gradient(180deg,#ffcb46 0%, #fe7347 100%);
        border-radius: px2rem(12px);
        margin-left: px2rem(26px);
        margin-right: auto;
        font-size: px2rem(18px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        line-height: px2rem(18px);
    }

    .lottery .lottery-item ul li.on .box {
        // background: url('../../../assets/lottery-bindBox/box-bg1.png') no-repeat center;
        // background: url(./assets/bg1.png) no-repeat center;
        background-size: 100% 100%;
    }

    .lottery .lottery-item ul li.on .box p {
        color: #fff;
    }

    .lottery .lottery-item .lottery-start {
        position: absolute;
        left: 33.33333333%;
        width: 33.33333333%;
        top: 110px;
        padding-right: 10px;
    }

    .lottery .lottery-item .lottery-start .box {
        height: 100px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
        text-align: center;
        overflow: hidden;
        //  background: url('../../../assets/lottery-bindBox/box-bg1.png') no-repeat center;
        // background: url(./assets/bg1.png) no-repeat center;
        background-size: 100% 100%;
    }

    .lottery .lottery-item .lottery-start .box p b {
        font-size: 40px;
        margin-top: 16px;
        margin-bottom: 15px;
        line-height: 30px;
        display: block;
    }

    .lottery .lottery-item .lottery-start .box:active {
        opacity: 0.7;
    }

    .lottery .lottery-item .lottery-start .box.gray {
        // background: url('../../../assets/lottery-bindBox/box-bg1.png') no-repeat center;
        // background: url(./assets/bg3.png) no-repeat center;
        background-size: 100% 100%;
    }

    .lottery .lottery-item .lottery-start .box.gray p {
        color: #708ABF;
        font-weight: bold;
    }

    .mask {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        position: fixed;
        overflow: hidden;
        z-index: 222;
        top: 0;
        left: 0;
    }

    .lottery-alert {
        max-width: 400px;
        text-align: center;
        z-index: 10000;
        border-radius: 10px;
        background: #fff;
        padding: 20px;
        position: fixed;
        left: 0;
        right: 0;
        margin: auto;
        top: 50%;
        transform: translateY(-50%);
    }

    .lottery-alert h1 {
        font-size: 18px;
        font-weight: bold;
        color: #D92B2F;
    }

    .lottery-alert img {
        display: block;
        height: 120px;
        margin: 0 auto;
    }

    .lottery-alert h2 {
        font-weight: normal;
        color: #D92B2F;
        font-size: 15px;
        padding-top: 15px;
    }

    .lottery-alert p {
        color: #666;
        font-size: 16px;
        padding-top: 5px;
    }

    .lottery-alert .btnsave {
        border-radius: 3px;
        box-shadow: none;
        height: 40px;
        cursor: pointer;
        line-height: 40px;
        color: #fff;
        margin-top: 12px;
        background: linear-gradient(180deg, rgba(213, 60, 63, 1) 0%, rgba(201, 20, 24, 1) 100%);
        font-size: 16px;
    }
</style>
