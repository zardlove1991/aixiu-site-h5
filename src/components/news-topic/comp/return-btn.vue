<template>
<div class='return-btn'>
  <div class='return-btn-wrap' @click='geHomePage'>
    返回
  </div>
</div>
</template>

<script>
export default{
  data () {
    return {

    }
  },
  methods: {
    geHomePage () {
      this.$router.push({name: 'newstopic'})
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
.return-btn{
  .return-btn-wrap{
    width: px2rem(100px);
    height: px2rem(64px);
    text-align: center;
    line-height: px2rem(64px);
    opacity: 0.7;
    color: #ffff;
    background: #000000;
    border-radius: 0 px2rem(32px) px2rem(32px) 0;
  }
}
</style>
