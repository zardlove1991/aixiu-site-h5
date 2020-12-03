<template>
  <div class="news-first-wrap">
    <news-img :url="url" />
    <div class="content">
      <div v-if="infoData.is_open" :style="{ color: infoData.color_matching }">
        <div class="date" v-if="infoData.show_date">{{infoData.show_date}}</div>
        <div class="date-week" v-if="infoData.week_format">{{infoData.week_format}}</div>
        <div class="date2" v-if="infoData.lunar_date_format">{{infoData.lunar_date_format}}</div>
      </div>
      <div class="weather" v-if="weatherData.is_open" :style="{ color: weatherData.color_matching }">
        <span class="city">{{weatherData.city}}</span>
        <span class="temp">{{weatherData.temperature}}°C</span>
        <span :class="['weather-icon', weatherData.type ? weatherData.type: 'qing']"></span>
      </div>
    </div>
  </div>
</template>

<script>
import NewsImg from '@/components/news/global/base-bg-picture'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'

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
      if (infoData && infoData.activity_date) {
        let date = infoData.activity_date
        let arr = date.split('-')
        if (arr.length === 3) {
          infoData.show_date = arr[1] + '月' + arr[2] + '日'
        } else {
          let newdate = new Date()
          infoData.show_date = newdate.getMonth() + 1 + '月' + newdate.getDay()
        }
        this.infoData = infoData
      }
      this.getCityWeather(weatherData)
    },
    getCityWeather (data) {
      if (data && data.is_open && data.select_data) {
        let id = data.select_data
        let weather = STORAGE.get('news_weather')
        if (weather) {
          this.weatherData = weather
        } else {
          API.getCityWeather({
            query: { id }
          }).then(res => {
            let weather = {
              ...res,
              is_open: data.is_open,
              color_matching: data.color_matching
            }
            this.weatherData = weather
            STORAGE.set('news_weather', weather)
          })
        }
      }
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
          &.xue {
            @include img-retina('~@/assets/news/weather/xue.png', '~@/assets/news/weather/xue@2x.png', px2rem(40px), px2rem(40px));
          }
          &.lei {
            @include img-retina('~@/assets/news/weather/lei.png', '~@/assets/news/weather/lei@2x.png', px2rem(40px), px2rem(40px));
          }
          &.shachen {
            @include img-retina('~@/assets/news/weather/shachen.png', '~@/assets/news/weather/shachen@2x.png', px2rem(40px), px2rem(40px));
          }
          &.wu {
            @include img-retina('~@/assets/news/weather/wu.png', '~@/assets/news/weather/wu@2x.png', px2rem(40px), px2rem(40px));
          }
          &.bingbao {
            @include img-retina('~@/assets/news/weather/bingbao.png', '~@/assets/news/weather/bingbao@2x.png', px2rem(40px), px2rem(40px));
          }
          &.yun {
            @include img-retina('~@/assets/news/weather/yun.png', '~@/assets/news/weather/yun@2x.png', px2rem(40px), px2rem(40px));
          }
          &.yu {
            @include img-retina('~@/assets/news/weather/yu.png', '~@/assets/news/weather/yu@2x.png', px2rem(40px), px2rem(40px));
          }
          &.yin {
            @include img-retina('~@/assets/news/weather/yin.png', '~@/assets/news/weather/yin@2x.png', px2rem(40px), px2rem(40px));
          }
          &.qing {
            @include img-retina('~@/assets/news/weather/qing.png', '~@/assets/news/weather/qing@2x.png', px2rem(40px), px2rem(40px));
          }
        }
      }
    }
  }
</style>
