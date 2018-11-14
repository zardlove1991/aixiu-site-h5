<template lang="html">
  <div class="subject-header-wrap">
    <!--试题概览数据-->
    <div class="subject-item-wrap">
      <div class="item" :class="[getItemClass(index)]" v-for="(item,index) in 20" :key="index">{{item}}</div>
    </div>
    <!--缩略按钮-->
    <div class="thumb-btn">
      <div class="line-wrap">
        <span class="line" v-for="(item,index) in 3"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'subject-header',
  methods: {
    getItemClass (index) {
      let i = index % 4
      let cls = 'success'
      if (i === 1) cls = 'error'
      else if (i === 2) cls = 'disabled'
      if (i === 3) cls = 'active'
      return cls
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.subject-header-wrap{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: px2rem(100px);
  box-shadow: 0 px2rem(5px) px2rem(20px) rgba(0,0,0,0.2);
  .subject-item-wrap{
    flex:1;
    white-space: nowrap;
    overflow: scroll;
    -webkit-overflow-scrolling:touch;
    font-size: 0;
    .item{
      display: inline-block;
      text-align: center;
      line-height: px2rem(58px);
      width: px2rem(58px);
      height: px2rem(58px);
      border-radius: 50%;
      margin-left: px2rem(30px);
      @include font-dpr(14px);
      &.success{
        @include bg-color('bgColor');
        @include font-color('themeColor');
        @include border('all',1px,solid,'themeColor');
      }
      &.error{
        @include bg-color('bgColor');
        @include font-color('errorColor');
        @include border('all',1px,solid,'errorColor');
      }
      &.disabled{
        @include bg-color('bgGrayColor');
        @include font-color('disabledColor');
        @include border('all',1px,solid,'borderGray');
      }
      &.active{
        @include bg-color('activeColor');
        @include font-color('bgColor');
        @include border('all',1px,solid,'activeColor');
      }
    }
  }
  .thumb-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 px2rem(100px);
    width: px2rem(100px);
    height: px2rem(100px);
    box-shadow: -0.5px 0 1px rgba(0,0,0,0.05);
    @include bg-color('bgColor');
    .line-wrap{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: px2rem(24px);
      height: px2rem(24px);
      .line{
        display: block;
        width: 100%;
        height: px2rem(4px);
        @include bg-color('tipColor');
      }
    }
  }
}
</style>
