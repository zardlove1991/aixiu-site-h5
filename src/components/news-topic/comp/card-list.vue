<template>
<div>
  <div v-for='(item, index) in columnList' :key='index'>
    <CardListItem :itemObj='item' :isMobileHeaderIconType='isMobileHeaderIconType'></CardListItem>
  </div>
</div>
</template>

<script>
import CardListItem from './card-list-item.vue'
import STORAGE from '@/utils/storage'
export default {
  data () {
    return {
      curDetailInfo: {},
      columnList: [],
      isMobileHeaderIconType: true
    }
  },
  components: {
    CardListItem
  },
  mounted () {
    this.curDetailInfo = STORAGE.get('detailInfo')
    let curId = this.$route.query.id

    // 判断是不是隐藏图标
    let isMobileHeaderIcon = this.curDetailInfo.limit.column_set.is_mobile_header_icon
    if (isMobileHeaderIcon === 1) {
      this.isMobileHeaderIconType = true
    } else if (isMobileHeaderIcon === 0) {
      this.isMobileHeaderIconType = false
    }

    this.columnList = []
    for (let i of this.curDetailInfo.limit.column_set.column_list) {
      if (i.id === curId) {
        this.columnList = [i]
      }
    }
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
