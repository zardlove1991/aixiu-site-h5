<template>
  <div class="empty-data">
    <img v-if="img" :src="icon || defaultIcon" />
    <div>{{text || '暂无数据'}}</div>
  </div>
</template>

<script>
export default {
  name: 'empty-data',
  props: {
    text: String,
    icon: String,
    img: {
      type: [Boolean, String, Number],
      default: true
    }
  },
  data () {
    return {
      defaultIcon: require('@/assets/party/empty@3x.png')
    }
  }
}
</script>

<style lang="scss">
  @import '@/styles/index.scss';

  .empty-data{
    width:100%;
    text-align:center;
    font-size: px2rem(28px);
    color:$textContent;
    padding-top: calc(50%);
    img{
      width:px2rem(200px);
      height: auto;
      margin:0 auto;
    }
    div {
      margin-top: px2rem(10px);
    }
  }
</style>
