<template>
  <div class="count-down-wrap color-decorated">
    <!--时间结构-->
    <div class="left-time-wrap">
      <span class="title-tip">距离<span class="title-tip-2">{{statusMsg[status]}}</span>还有</span>
      <div class="time-count-wrap">
        <p class="day-tip color-button_color">
          <span class="time-num color-button_text">{{voteDate[0]}}</span>
        </p>
        <span class="time-tip color-link_text">天</span>
        <p class="hour-tip color-button_color">
          <span class="time-num color-button_text">{{voteDate[1]}}</span>
        </p>
        <span class="time-tip color-link_text">时</span>
        <p class="minutes-tip color-button_color">
          <span class="time-num color-button_text">{{voteDate[2]}}</span>
        </p>
        <span class="time-tip color-link_text">分</span>
        <p class="second-tip color-button_color">
          <span class="time-num color-button_text">{{voteDate[3]}}</span>
        </p>
        <span class="time-tip color-link_text">秒</span>
      </div>
    </div>
    <!--可投票数字提醒-->
    <div class="right-vote-tip" v-show="status === 2">
      <span class="vote-title-tip color-link_text">{{textSetting.available ? textSetting.available : '可投票数'}}</span>
      <span class="vote-tip-num color-link_text">{{ remainVotes ? remainVotes : 0 }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    voteDate: {
      type: Array,
      default: () => {
        return [0, 0, 0, 0]
      }
    },
    remainVotes: {
      type: Number,
      default: 0
    },
    status: {
      type: Number
    },
    textSetting: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    statusMsg () {
      let statusMsg = {}
      let textSetting = this.textSetting
      if (textSetting) {
        let vote = textSetting.sign
        statusMsg = {
          0: vote + '开始',
          1: '报名结束',
          2: vote + '结束',
          4: '报名开始'
        }
      } else {
        statusMsg = {
          0: '投票开始',
          1: '报名结束',
          2: '投票结束',
          4: '报名开始'
        }
      }
      return statusMsg
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .count-down-wrap {
    position: absolute;
    bottom: px2rem(40px);
    left: px2rem(50px);
    right: px2rem(50px);
    height: px2rem(140px);
    @include bg-linear-color('compColor');
    box-shadow: 0 2px 5px 5px rgba(0,0,0,0.10);
    box-sizing: border-box;
    border-radius: px2rem(8px);
    pointer-events: auto;
    padding: px2rem(35px) 0;
    display: flex;
    align-items: center;
    .left-time-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      .title-tip {
        @include font-dpr(12px);
        color: #fff;
        line-height: 1;
        margin-bottom: px2rem(17px);
        .title-tip-2 {
          display: inline-block;
          margin: 0 px2rem(10px);
          color: #fff;
        }
      }
      .time-count-wrap {
        display: flex;
        align-items: center;
        .day-tip, .hour-tip, .minutes-tip, .second-tip {
          width: px2rem(50px);
          height: px2rem(50px);
          line-height: px2rem(50px);
          text-align: center;
          // background-color: #FC7465;
          @include bg-color('btnColor');
          border-radius: px2rem(4px);
          .time-num {
            @include font-dpr(16px);
            color: #fff;
            line-height: 1;
          }
        }
        .time-tip {
          color: #fff;
          margin: 0 px2rem(10px);
        }
      }
    }
    .right-vote-tip {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 0 0 px2rem(190px);
      width: px2rem(190px);
      border-left: 1px solid rgba(255,255,255,0.25);
      .vote-title-tip {
        @include font-dpr(12px);
        color: #fff;
        margin-bottom: px2rem(15px);
      }
      .vote-tip-num {
        @include font-dpr(18px);
        color: #fff;
      }
    }
  }
</style>
