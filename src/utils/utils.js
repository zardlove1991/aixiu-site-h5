/**
 * [格式化时间戳]
 * @param  {[number]} utcstr [时间戳]
 * @param  {[string]} format [时间格式，支持的格式自定义，需在该方法中配置]
 * @return {[string]}        [转化后的时间格式]
 */
export const formatDate = (utcstr, format = 'YYYY-MM-DD hh:mm:ss', flag = false) => {
  let _format = function (num) {
    if (num < 10) {
      num = '0' + num
    } else {
      num = num + ''
    }
    return num
  }
  if (typeof utcstr === 'number') {
    utcstr = utcstr * 1000
  }
  let equipmentVersion = navigator.userAgent.toLowerCase()
  let isTimestr = /^[0-9]*$/.test(utcstr)
  if (/iphone|ipad|ipod/.test(equipmentVersion) && !isTimestr && flag) {
    utcstr = utcstr.replace(/-/g, '/')
  }
  let newDate = new Date(utcstr)
  let year = newDate.getFullYear()
  let month = newDate.getMonth() + 1
  let dd = newDate.getDate()
  let hour = newDate.getHours()
  let min = newDate.getMinutes()
  let sec = newDate.getSeconds()

  return format
    .replace('YYYY', _format(year))
    .replace('MM', _format(month))
    .replace('DD', _format(dd))
    .replace('hh', _format(hour))
    .replace('mm', _format(min))
    .replace('ss', _format(sec))
}

/*
 * 判断嵌入平台
 * */
export const getPlat = () => {
  let userAgent = navigator.userAgent.toLowerCase()
  if (/micromessenger/.test(userAgent)) {
    return 'wechat'
  } else if (/m2oapp/.test(userAgent) || /m2osmartcity/.test(userAgent)) {
    return 'smartcity'
  } else if (/dingdone/.test(userAgent)) {
    return 'dingdone'
  } else if (/kdtunion/.test(userAgent)) {
    return 'dingdone'
  } else if (/dingtalk/.test(userAgent) || /aliapp/.test(userAgent)) {
    return 'dingding'
  }
  return 'browser'
}
/*
* 动态set head title
* */
export const setBrowserTitle = (title) => {
  let plat = getPlat()
  document.title = title
  if (plat === 'dingding' || plat === 'dingdone') {
    let i = document.createElement('iframe')
    i.src = '/static/browser.js'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 2)
    }
    document.body.appendChild(i)
  } else {
    document.title = title
  }
}
