<template lang="html">
  <div class="permission-wrap">
    <div class="tip-bg"></div>
    <div class="tip-content">
      <span class="tip">暂无权限打开页面</span>
      <span class="tip">{{errorMsg}}</span>
    </div>
    <div class="tip-btn" v-show="redirect" @click.stop="jumpPage">返回</div>
  </div>
</template>

<script>
export default {
  props: {
    errorMsg: {
      type: String,
      default: '暂时没有权限的提醒信息,请重新进入'
    },
    redirect: {
      type: String,
      default: ''
    }
  },
  methods: {
    jumpPage () {
      window.location.href = this.redirect
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.permission-wrap{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .tip-bg{
    width: px2rem(136px);
    height: px2rem(124px);
    margin: px2rem(180px) 0 0;
    background-repeat: no-repeat;
    background-position: center;
    @include img-retina('~@/assets/common/lamp@2x.png','~@/assets/common/lamp@3x.png', 100%, 100%);
  }
  .tip-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: px2rem(100px) 0;
    @include font-dpr(14px);
    @include font-color('descColor');
    .tip{
      line-height: 1;
      &:first-child{
        margin-bottom: px2rem(20px);
      }
    }
  }
  .tip-btn{
    width: px2rem(300px);
    height: px2rem(80px);
    line-height: px2rem(80px);
    text-align: center;
    border-radius: px2rem(4px);
    @include font-dpr(14px);
    @include font-color('titleColor');
    @include border('all',1px,solid, 'descColor');
  }
}
</style>
