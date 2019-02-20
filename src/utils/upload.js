import * as CosCloud from 'cos-js-sdk-v4'
import { getQcloud } from '@/utils/utils'
import { Toast } from 'mint-ui'

const getSignature = function (actionName, params = {}) {
  return function (callback) {
    // 请求签名
    let $store = window.$vue.$store
    let dispatchName = `depence/${actionName}`
    $store.dispatch(dispatchName, params).then(res => {
      callback(res.sign)
    }).catch(err => {
      let tip = err.message || err.error_message || '请求签名失败'
      Toast(tip)
    })
  }
}

const getSingleServerId = (wx, id) => {
  // 调用上传
  return new Promise((resolve, reject) => {
    wx.execute('uploadImage', {
      localId: id, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success (res) {
        let serverId = res.serverId // 返回图片的服务器端ID
        resolve(serverId)
      },
      fail (err) {
        reject(err)
      }
    })
  })
}

let UPLOAD = {
  /**
  * @wx 代表当前的wx的jssdk对象
  * @limitCount 代表限制的个数
  * @prevData 代表原先上传的数据对象
  */
  getWeixinLocalId (wx, limitCount, prevData) {
    console.log('限制的个数', limitCount)
    console.log('已经上传的数据:', prevData)
    return new Promise((resolve, reject) => {
      let prevDataCount = prevData.length // 原先数据的长度
      let lastCount = limitCount - prevDataCount // 当前还可以上传的图片的长度
      wx.execute('chooseImage', {
        count: (lastCount <= 0 ? 0 : lastCount),
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          console.log('上传图片返回的信息', res)
          // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          let localIds = res.localIds
          // 返回数据
          resolve(localIds)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  /**
  * 获得上传图片的serverIDs
  * @wx 代表当前的wx的jssdk对象
  */
  getWeixinServerIdS (wx, localIds) {
    return new Promise((resolve, reject) => {
      let resultServerIds = []
      let count = 0

      let getServerIdCb = () => {
        console.log(`执行图片获得serverId的第${count + 1}次回调 ！！！`)
        if (!localIds[count]) {
          resolve(resultServerIds)
          return
        }
        // 递归请求解决IOS不能批量上传的问题
        getSingleServerId(wx, localIds[count]).then(serverId => {
          // 存放数据
          resultServerIds.push(serverId)
          count++
          // 继续回调
          getServerIdCb()
        })
      }
      // 初始执行
      getServerIdCb()
    })
  },
  /**
  * @files 代表原生上传的文件列表
  * @limitCount 代表限制的个数
  * @prevData 代表原先上传的数据对象
  */
  getFileReaderData (files, limitCount, prevData) {
    console.log('原生上传文件的信息:', files)
    console.log('限制的个数', limitCount)
    console.log('已经上传的数据:', prevData)
    return new Promise((resolve, reject) => {
      let count = 0
      let fileLength = files.length
      let currentCount = prevData.length
      if (fileLength > limitCount || (limitCount - currentCount) <= 0) {
        let tip = '当前超出限制个数'
        Toast(tip)
        reject(new Error(tip))
      } else {
        let tempArr = []
        let filesArr = [...files]
        console.log('新的文件对象数组', filesArr, filesArr.length)
        filesArr.forEach((file, index) => {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = (e) => {
            let dataUrl = e.target.result
            tempArr.push(dataUrl)
            count++
            console.log('当前转换上传信息', e.target, 'count', count)
            // 判断是否结束
            if (count === filesArr.length) {
              let result = tempArr.concat(prevData)
              console.log('最终返回的上传返回信息', result)
              resolve(result)
            }
          }
        })
      }
    })
  },
  /* 初始化文件上传到uploader */
  initFileUploader () {
    return new Promise((resolve, reject) => {
      let params = {
        appid: getQcloud('appid'),
        bucket: getQcloud('bucket_name'),
        region: getQcloud('district')
      }
      let cos = new CosCloud({
        ...params,
        getAppSign: getSignature('GET_TENCENT_TOKEN')
      })
      // 返回cos对象
      resolve(cos)
    })
  },
  /* 上传图片 */
  fileUploaderImg (uploader, files, limitCount, currentCount) {
    return new Promise((resolve, reject) => {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = (month < 10 ? '0' + month : month)
      let day = date.getDate()
      day = (day < 10 ? '0' + day : day)
      let hour = date.getHours()
      hour = (hour < 10 ? '0' + hour : hour)

      let count = 0
      let resultArr = []
      let fileList = [...files]

      if (fileList.length > limitCount || (limitCount - currentCount) <= 0) {
        let tip = '当前超出限制个数'
        Toast(tip)
        reject(new Error(tip))
      } else {
        fileList.forEach(file => {
          let format = file.name.split('.').pop() ? ('.' + file.name.split('.').pop()) : ''
          let name = [+new Date(), parseInt(Math.random() * 6)].join('_') + format
          let url = [ getQcloud('channel'), year, month, day, hour, 'project', name ].join('/')

          uploader.uploadFile((data) => {
            console.log('uploader 上传的数据', data)
            let imgInfo = data.data
            imgInfo && resultArr.push(imgInfo)
            // 判断是否结束上传
            count++
            if (count === fileList.length) {
              resolve(resultArr)
            }
          }, (data) => {
            let tip = data || '上传图片出错'
            Toast(tip)
            reject(new Error(tip))
          }, (process) => {
            // console.log('uploader 上传进度信息', process)
          },
          getQcloud('bucket_name'), url, file, 1)
        })
      }
    })
  },
  /* 上传视频 */
  fileUploaderMedia (files, type) {
    let uploadObj = {}
    console.log('uploader 当前media去请求签名的回调', type)
    return new Promise((resolve, reject) => {
      let currentFile = files[0] // 当前上传的文件
      let showErrorTip = (err) => {
        let tip = err.message || err || '上传出错'
        Toast(tip)
        reject(new Error(tip))
      }
      // 调用腾讯云
      window.qcVideo.ugcUploader.start({
        getSignature: getSignature('GET_TENCENT_VIDEO_TOKEN', { type }),
        videoFile: currentFile,
        allowAudio: 1,
        success (result) {
          console.log('uploader success上传文件成功', result)
        },
        progress (result) {
          uploadObj.taskId = result.taskId
          uploadObj.taskCos = result.cos
          // console.log('uploader progress上传过程中国', result)
        },
        error (result) {
          showErrorTip(result)
          console.log('uploader error上传文件失败', result)
        },
        finish (result) {
          console.log('uploader finish上传文件结束', result)
          if (result.fileId) {
            resolve(result) // 返回数据
          } else {
            showErrorTip(result)
          }
        }
      })
    })
  }
}

export default UPLOAD
