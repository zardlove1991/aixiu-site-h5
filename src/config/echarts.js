export default{
  VOICE_RANDAR: { // 语音题目的雷达图配置
    radar: [
      {
        indicator: [], // 数组的格式 { text: '', max: xx }
        splitArea: {
          areaStyle: {
            color: [ 'rgba(255,255,255,0.5)' ]
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: ['#ebebeb']
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#dbdbdb'
          }
        },
        name: {
          color: '#999',
          lineHeight: 14
        },
        splitNumber: 4,
        center: ['50%', '50%'],
        radius: 84,
        shape: 'circle'
      }
    ],
    series: [
      {
        type: 'radar',
        lineStyle: {
          color: '#51CD96',
          type: 'dashed',
          width: 0.5,
          opacity: 0.8
        },
        areaStyle: { color: '#CCE7D9' },
        itemStyle: {
          color: '#51CD96',
          borderWidth: 1
        },
        data: [{ value: [] }] // 这边依次对饮坐标的数据
      }
    ]
  }
}
