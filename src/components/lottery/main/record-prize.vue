<template>
  <div class="record-prize">
    <div class="record-prize-header-bg"></div>
    <div class="back" @click="$router.back()">
      <div class="arrow-left"></div>
    </div>
    <div class="record-prize-content">
      <h3>中奖记录</h3>
      <div class="container pl40 pr40" v-if="list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list v-model="loading" :finished="finished" @load="onLoad">
            <van-cell
              v-for="item in list"
              :key="item"
              value="查看"
              class="list-wrap"
            >
              <div slot="title" class="title">{{ item.name }}</div>
              <div slot="default" class="jump">{{ item.tip }}</div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </div>
      <div class="container center" v-else>
        <div class="bg"></div>
        <div class="tip">您还未中奖哦~</div>
      </div>
    </div>
    <div class="logo"></div>
  </div>
</template>

<script>
export default {
  name: 'RecordPrize',
  components: {},
  props: {},
  data () {
    return {
      list: [
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得女士温暖绒毛家居拖鞋', tip: '查看' },
        { name: 'AB面乳胶独立弹簧床垫升级款', tip: '查看' },
        { name: '获得女士温暖绒毛家居拖鞋', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得女士温暖绒毛家居拖鞋', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: 'AB面乳胶独立弹簧床垫升级款', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得女士温暖绒毛家居拖鞋', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得女士温暖绒毛家居拖鞋', tip: '查看' },
        { name: 'AB面乳胶独立弹簧床垫升级款', tip: '查看' },
        { name: '获得女士温暖绒毛家居拖鞋', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得女士温暖绒毛家居拖鞋', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: 'AB面乳胶独立弹簧床垫升级款', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得女士温暖绒毛家居拖鞋', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' },
        { name: '获得手摇式音乐盒', tip: '查看' }
      ],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLoad () {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = []
          this.refreshing = false
        }

        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        this.loading = false

        if (this.list.length >= 10) {
          this.finished = true
        }
      }, 1000)
    },
    onRefresh () {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.record-prize {
  // width: 750px;
  height: px2rem(1448px);
  width: 100%;
  // height: 100vh;
  opacity: 1;
  background: linear-gradient(181deg, #ff8f68 0%, #ff093f 100%);
  position: relative;
  display: flex;
  .record-prize-header-bg {
    width: 100%;
    height: px2rem(213px);
    opacity: 1;
    @include img-retina(
      "~@/assets/lottery/diallist/header-bg.png",
      "~@/assets/lottery/diallist/header-bg@2x.png",
      100%,
      100%
    );
    background-repeat: no-repeat;
    background-position-y: top;
    position: absolute;
    top: -9%;
  }
  .back {
    width: px2rem(64px);
    height: px2rem(60px);
    opacity: 0.5;
    background: #000000;
    border-radius: 0px 0px px2rem(100px) px2rem(100px);
    position: absolute;
    left: -1%;
    top: px2rem(30px);
    transform: rotate(-90deg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    .arrow-left {
      width: px2rem(17px);
      height: px2rem(32px);
      transform: rotate(-270deg);
      @include img-retina(
        "~@/assets/lottery/diallist/arrow-left.png",
        "~@/assets/lottery/diallist/arrow-left@2x.png",
        100%,
        100%
      );
      color: #fff;
      opacity: 1;
    }
  }
  .record-prize-content {
    width: px2rem(690px);
    height: px2rem(1270px);
    opacity: 1;
    background: #ffffff;
    border-radius: px2rem(16px);
    box-shadow: 0px px2rem(6px) px2rem(14px) px2rem(2px) rgba(0, 0, 0, 0.12);
    position: absolute;
    top: px2rem(127px);
    left: px2rem(30px);
    padding-top: px2rem(66px);
    h3 {
      width: px2rem(160px);
      height: px2rem(40px);
      opacity: 1;
      font-size: px2rem(40px);
      font-family: SourceHanSansCN, SourceHanSansCN-Medium;
      font-weight: 500;
      text-align: left;
      color: #333333;
      line-height: px2rem(60px);
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      margin-bottom: px2rem(40px);
    }
    .container {
      width: 100%;
      height: 80%;
      background-color: #ffffff;
      position: relative;
      overflow-y: auto;
      &.center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      &.pl40 {
        padding-left: px2rem(40px);
      }
      &.pr40 {
        padding-right: px2rem(40px);
      }
      .list-wrap {
        height: px2rem(42px);
        line-height: px2rem(42px);
        .title {
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
          opacity: 1;
          font-size: px2rem(28px);
          line-height: px2rem(42px);
        }
        .jump {
          opacity: 0.6;
          font-size: px2rem(28px);
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          text-align: right;
          color: #333333;
          line-height: px2rem(42px);
        }
        &::after {
          width: 100%;
          opacity: 0.2;
          border-bottom-style: dashed;
          border-bottom-color: #4f0f0f;
        }
      }
      .bg {
        width: px2rem(299px);
        height: px2rem(228px);
        margin-left: px2rem(99px);
        @include img-retina(
          "~@/assets/lottery/unRecord/bg_2.png",
          "~@/assets/lottery/unRecord/bg_2@2x.png",
          100%,
          100%
        );
        background-position-x: right;
        background-repeat: no-repeat;
      }
      .tip {
        width: px2rem(208px);
        height: px2rem(32px);
        opacity: 1;
        font-size: px2rem(32px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #999999;
        line-height: px2rem(32px);
        z-index: 10;
      }
    }
  }
  .logo {
    position: absolute;
    top: px2rem(40px);
    left: px2rem(205px);
    @include img-retina(
      "~@/assets/lottery/diallist/bg.png",
      "~@/assets/lottery/diallist/bg@2x.png",
      100%,
      100%
    );
    background-position-x: right;
    background-repeat: no-repeat;
    width: px2rem(339px);
    height: px2rem(157px);
  }
}
</style>
