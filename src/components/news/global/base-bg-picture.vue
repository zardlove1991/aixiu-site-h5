<template>
  <div class="news-img-wrap"
    :style="{ background: 'url(' + url + ') center center/cover no-repeat' }"></div>
</template>

<script>
export default {
  props: {
    url: String
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .news-img-wrap {
    width: 100vw;
    height: 100%;
    background-size: 100%;
    background-repeat: no-repeat;
  }
</style>
