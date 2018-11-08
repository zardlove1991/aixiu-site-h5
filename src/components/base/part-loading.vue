<template lang="html">
  <div class="part-loading-wrap"></div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
@import '@/styles/index.scss';

.part-loading-wrap{
  margin: 0 auto;
  width: px2rem(30px);
  height: px2rem(30px);
  @include img-retina('~@/assets/party/loading@2x.png', '~@/assets/party/loading@3x.png', 100%,100%);
  background-repeat: no-repeat;
  background-position: center;
  animation: move 0.5s linear infinite;
}

@keyframes move {
  0% { transform: rotate(0);}
  100% { transform: rotate(360deg);}
}
</style>
