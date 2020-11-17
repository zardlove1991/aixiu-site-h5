<template>
  <div class="news-first-wrap">
    <news-img :url="url" />
    <div class="content">
      <div v-if="infoData.is_open" :style="{ color: infoData.color_matching }">
        <div class="date" v-if="infoData.activity_date">{{infoData.activity_date}}</div>
        <div class="date-week" v-if="infoData.week_format">{{infoData.week_format}}</div>
        <div class="date2" v-if="infoData.lunar_date_format">{{infoData.lunar_date_format}}</div>
      </div>
      <div class="weather" v-if="weatherData.is_open" :style="{ color: weatherData.color_matching }">
        <span class="city">{{weatherData.city}}</span>
        <span class="temp">32°C</span>
        <span :class="['weather-icon', 'qing']"></span>
      </div>
    </div>
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
      url: '',
      infoData: {},
      weatherData: {}
    }
  },
  created () {
    this.initNewsFirst()
  },
  methods: {
    initNewsFirst () {
      let newsInfo = this.newsInfo
      let { index_pic: indexPic, information_date: infoData, information_weather: weatherData } = newsInfo
      if (indexPic && indexPic.cover_img) {
        this.url = indexPic.cover_img
      }
      this.infoData = infoData
      this.weatherData = weatherData
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .news-first-wrap {
    width: 100%;
    height: 100vh;
    position: relative;
    .content {
      position: absolute;
      left: px2rem(60px);
      top: px2rem(600px);
      .date {
        @include font-dpr(28px);
      }
      .date-week {
        @include font-dpr(18px);
      }
      .date2 {
        margin-top: px2rem(10px);
        @include font-dpr(14px);
      }
      .weather {
        margin-top: px2rem(20px);
        display: flex;
        align-items: center;
        font-size: 0;
        color: #666;
        .city {
          @include font-dpr(13px);
        }
        .temp {
          display: inline-block;
          margin: 0 px2rem(20px);
          @include font-dpr(14px);
        }
        .weather-icon {
          display: inline-block;
          margin-right: px2rem(20px);
          width: px2rem(40px);
          height: px2rem(40px);
          background-repeat: no-repeat;
          &.qing {
            @include img-retina('~@/assets/news/weather/qing.png', '~@/assets/news/weather/qing@2x.png', px2rem(40px), px2rem(40px));
          }
          // &.cloudy
        }
      }
    }
  }
</style>
