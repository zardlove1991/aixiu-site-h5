<template>
<div class='select-wrap'>
  <select>
    <option :value="item.value" v-for='(item, index) in selectList' :key='index'>{{item.label}}</option>
  </select>
</div>
</template>

<script>
export default {
  data () {
    return {
      selectList: []
    }
  },
  props: {
    selectData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    selectData: {
      handler (newVal, oldVal) {
        this.selectList = []
        this.selectList = newVal
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang='scss' scoped>
  select {
    width: 110px;
    height: 32px;
    border-radius: 13px;
    border: 1px solid #DBDBDB;
  }

  option{
    background: red;;
  }
</style>
