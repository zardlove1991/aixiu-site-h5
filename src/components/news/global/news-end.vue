<template>
  <div class="news-end-wrap">
    <news-img :url="url" />
  </div>
</template>

<script>
import NewsImg from '@/components/news/global/base-bg-picture'

export default {
  props: {
    newsInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    NewsImg
  },
  data () {
    return {
      url: ''
    }
  },
  created () {
    this.initNewsEnd()
  },
  methods: {
    initNewsEnd () {
      let newsInfo = this.newsInfo
      let { index_pic: indexPic } = newsInfo
      if (indexPic && indexPic.back_cover_img) {
        this.url = indexPic.back_cover_img
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .news-end-wrap {
    width: 100%;
    height: 100vh;
  }
</style>
