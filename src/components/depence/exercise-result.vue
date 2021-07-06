<template>
   <div class="exerciseResult">
      <div>
        <div class="model">
          <div class="content">
            <img src="@/assets/common/exam/exercise-success.png" alt="" class="title_image">
            <div class="title">答题结束</div>
            <div class="cards_list">
              <div class="item">
                <p>考试成绩</p>
                <span class="num">{{exerciseResult.score}}</span>
              </div>
              <div class="item">
                <p>答对题数</p>
                <span class="num">{{exerciseResult.correctNum}}</span>
              </div>
              <div class="item" v-if="exerciseResult.points === 0 || exerciseResult.points">
                <p>获得积分</p>
                <span class="num">{{exerciseResult.points}}</span>
              </div>
            </div>
            <p v-if="exerciseResult.tips">{{exerciseResult.tips}}</p>
            <div class="confirm-btn next-wrap" @click="confirmStatistics">
              返回
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  props: {
    exerciseResult: {
      type: Object
    },
    show: {
      type: Boolean
    }
  },
  methods: {
    confirmStatistics () {
      this.$emit('confirmResult')
      this.$emit('update:show', false)
    }
  },
  watch: {
    exerciseResult: {
      handler: function (v) {
        console.log('exerciseResult: ', v)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
  .exerciseResult{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    >div{
      position: relative;
      width: 100%;
      height: 100%;
      .model{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80vw;
        height: auto;
        .content{
          width: 100%;
          background: #fff;
          border-radius: 5px;
          padding: 20px;
          text-align: center;
          .title_image{
            width: 29vw;
            height: auto;
            margin-bottom: 20px;
          }
          .title{
            font-size: 20px;
            margin-bottom: 30px;
          }
          .cards_list{
            display: flex;
            justify-content: space-around;
            // align-items:  ;
            .item{
              flex-shrink: 0;
              padding: 20px;
              background: rgba(251, 251, 251, 1);
              border-radius: 5px;
            }
          }
        }
      }
    }
    .confirm-btn {
      width: px2rem(290px);
      height:px2rem(90px);
      line-height:px2rem(90px);
      text-align: center;
      color:#fff;
      @include bg-color('btnColor');
      font-size:px2rem(32px);
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
      margin: 40px auto;
    }
  }
</style>
