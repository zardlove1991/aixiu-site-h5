<template lang="html">
  <div class="denpncelist-wrap">
    <!--头部组件-->
    <exam-header></exam-header>
    <!--主体试题渲染-->
    <div class="list-wrap">
      <div class="list-item-wrap">
        <h3 class="subject-type">单选题<span class="score">(5分)</span></h3>
        <p class="subject-title">1. 中国古老建筑紫金城午门之前的太庙和社稷坛显示了（）</p>
        <!--每个选择项-->
        <div class="subject-select-wrap" v-for="(item,index) in selects" :key='index'>
          <!--每个选择项描述-->
          <div class="select-tip-wrap" @click.stop="selectOption(index)">
            <div class="select-tip" :class="{active: currentIndex === index}">{{item.key}}</div>
            <div class="select-desc">{{item.desc}}</div>
          </div>
        </div>
      </div>
    </div>
    <!--底部跳转按钮-->
    <div class="btn-wrap">
      <div class="prev">上一题</div>
      <div class="next">下一题</div>
    </div>
  </div>
</template>

<script>
import ExamHeader from "./base/exam-header"

export default {
  name: 'depence-list',
  data () {
    return {
      selects: [
        { key: 'A', desc: '族权对皇权和神权的依赖'},
        { key: 'B', desc: '神权对皇权和神权的依赖'},
        { key: 'C', desc: '族权对黄泉和神权的依赖'},
        { key: 'D', desc: '族权对黄泉和神权的依赖'}
      ],
      currentIndex: -1
    }
  },
  components: {
    ExamHeader
  },
  methods: {
    selectOption (index) {
      this.currentIndex = index
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.denpncelist-wrap{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: px2rem(90px);
  .list-wrap{
    width: 100%;
    .list-item-wrap{
      width: 100%;
      @include font-dpr(16px);
      @include font-color('titleColor');
      .subject-type{
        display: flex;
        align-items: center;
        padding: px2rem(54px) 0 px2rem(16px) px2rem(32px);
        box-sizing: border-box;
        line-height: 1;
        .score{
          font-weight: normal;
          margin-left: px2rem(10px);
          @include font-dpr(14px);
        }
      }
      .subject-title{
        @include font-dpr(16px);
        padding:px2rem(39px) px2rem(43px) 0 px2rem(30px);
        box-sizing: border-box;
      }
      .subject-select-wrap{
        padding:px2rem(40px) px2rem(43px) 0 px2rem(30px);
        box-sizing: border-box;
        .select-tip-wrap{
          display: flex;
          align-items: center;
          .select-tip{
            display: flex;
            justify-content: center;
            align-items: center;
            width: px2rem(54px);
            height: px2rem(54px);
            border-radius: 50%;
            margin-right: px2rem(40px);
            @include font-dpr(14px);
            @include bg-color('bgColor');
            @extend .box-shadow;
            &.active{
              @include font-color('bgColor');
              @include bg-color('themeColor');
            }
          }
        }
      }
    }
  }
  .btn-wrap{
    position: absolute;
    left: 0;
    right: 0;
    bottom: px2rem(10px);
    display: flex;
    justify-content: space-around;
    .prev,.next{
      display: flex;
      justify-content: center;
      align-items: center;
      width: px2rem(330px);
      height: px2rem(80px);
      border-radius: px2rem(40px);
      @include font-dpr(16px);
    }
    .prev{
      @include font-color('themeColor');
      @include border('all',1px,solid,'themeColor');
    }
    .next{
      @include font-color('bgColor');
      @include bg-color('themeColor');
      @include border('all',1px,solid,'themeColor');
    }
  }
}
</style>
