import echarts from 'echarts'
import { getFontsize } from './utils'

export default (el, classify, ...arg) => {
  const instance = echarts.init(el, null, { renderer: 'svg' }) // 文字模糊: svg渲染出的图表的清晰度高于canvas
  instance.setOption(allOptions[`${classify}Options`](...arg))
  return instance
}
const allOptions = {
  pieOptions: (data, colorData) => {
    if (!(data instanceof Array)) return
    const labels = data.map(item => item.name, 5)
    const values = data
    const fontSize = getFontsize().bodyStyle
    const lineHeight = fontSize + 5
    return {
      color: colorData,
      legend: {
        show: false
      },
      series: [{
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['50%', '50%'],
        minAngle: 6,
        itemStyle: {
          normal: {
            color: (c) => {
              return colorData[c.dataIndex]
            }
          }
        },
        label: {
        //   formatter: (val) => {
        //     return val.name.length > 5 ? `${val.name.substr(0, 5)}...(${val.percent}%)` : `${val.name}(${val.percent}%)`
        //   },
          formatter: (text) => {
            const percent = text.percent.toFixed(0) + '%'
            return text.name.length > 5 ? `${text.name.substr(0, 5)}...(${percent})` : `${text.name}(${percent})`
          },
          fontFamily: 'serif',
          fontSize,
          width: '106px',
          lineHeight,
          rich: {}
        },
        data: labels.map((name, i) => ({ value: values[i].percent, name }))
      }]
    }
  }
}
