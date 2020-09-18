<template>
  <div class="myenroll-wrap">
    <div class="myenrll-item">
      <div class="left-split">
        <div class="point"></div>
        <div class="line"></div>
      </div>
      <div class="right-content">
        <div class="myenroll-date">
          <i class="myenroll-day-icon"></i>
          <span class="myenroll-date-txt">2020年9月24日 12:00:00</span>
        </div>
        <div class="myenroll-info">
          <div class="myenroll-rank">预约排名：675</div>
          <div class="myenroll-num">预约场次：9月20日 10:00-11:00</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String
  },
  data () {
    return {
      enrollList: []
    }
  },
  created () {
    this.inintMyEnrllList()
  },
  methods: {
    inintMyEnrllList () {
      console.log('inintMyEnrllList', this.id)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .myenroll-wrap {
    .myenrll-item {
      width: 100%;
      height: px2rem(245px);
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      .left-split {
        width: px2rem(16px);
        height: px2rem(245px);
        .point {
          width: px2rem(16px);
          height: px2rem(16px);
          border-radius: 50%;
          background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
        }
        .line {
          width: 1px;
          height: 100%;
          background-color: #EBEBEB;
        }
      }
      .right-content {
        flex: 1;
        .myenroll-date {
          margin-bottom: px2rem(30px);
          font-size: 0;
          display: flex;
          align-items: center;
          .myenroll-day-icon {
            display: inline-block;
            margin-right: px2rem(10px);
            width: px2rem(25px);
            height: px2rem(24px);
            background-repeat: no-repeat;
            @include img-retina('~@/assets/enroll/myenroll-day-icon@2x.png', '~@/assets/enroll/myenroll-day-icon@3x.png', 100%, 100%);
          }
          .myenroll-date-txt {
            @include font-dpr(14px);
            color: #666;
          }
        }
      }
    }
  }
</style>
