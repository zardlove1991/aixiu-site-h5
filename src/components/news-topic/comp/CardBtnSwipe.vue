<template>
  <div class='card-btn-swipe'>
    <!-- 单行 -->
    <!-- <div v-for='(item, index) in cardList' :key='index'
    :class='{"choiced-btn" : true}'
    class='single-btn-wrap'>
      政治议程
    </div> -->

    <!-- 多行 -->
    <div class='mul-card-wrap'>
      <div class='mul-card-line'>
        <div class='single-card'>媒体关注</div>
        <div class='single-card'>媒体媒体关注媒体关注媒体关注关注</div>
        <div class='single-card'>媒体关注</div>
      </div>
      <div class='mul-card-line'>
        <div class='single-card' :class='{"choiced-btn" : true}'>媒体关注</div>
        <div class='single-card'>媒体媒体关注媒体关注媒体关注关注</div>
        <div class='single-card'>媒体关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cardList: new Array(10)
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
  .card-btn-swipe {
    margin-top: px2rem(10px);
    padding: 0 px2rem(30px);
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display:-webkit-box;
    .single-btn-wrap{
      float: none;
      width: px2rem(172px);
      height: px2rem(64px);
      border-radius: px2rem(32px);
      line-height: px2rem(64px);
      text-align: center;
      background: #f2f2f2;
      color: #333333;
      font-size: px2rem(28px);
    }

    .choiced-btn{
      color: #ffffff;
      background: #D90000;
    }

    .single-btn-wrap + .single-btn-wrap{
      margin-left: px2rem(20px);
    }
  }

  .mul-card-wrap{
    .mul-card-line + .mul-card-line{
      margin-top: px2rem(20px);
    }
    .mul-card-line{
      display: flex;
      flex-direction: row;
      .single-card{
        flex: 1;
        width: px2rem(210px);
        height: px2rem(64px);
        line-height: px2rem(64px);
        text-align: center;
        background: #f2f2f2;
        border-radius: px2rem(32px);
        overflow: hidden;
        white-space:nowrap;
        -o-text-overflow:ellipsis;
        text-overflow:ellipsis;
      }

      .single-card + .single-card{
        margin-left: px2rem(30px);
      }

      .choiced-btn{
        background: rgba(217,0,0,0.08);
        color: #D90000;
        font-weight: 500;
      }
    }
  }
</style>
