<template>
  <div :class="['form-submit-wrap', darkMark === '2' ? 'light' : '']">
    <form>
      <div v-if="fullSceneType && fullSceneType.length" class="form-item">
        <div class="form-title">作品类型</div>
        <div class="form-content classify-wrap">
          <vote-fullscene-list
            :searchVal="checkFullScene"
            :darkMark="darkMark"
            :isLoading="(loading || videoCoverLoading)"
            :fullSceneType="fullSceneType"
            @fullSceneChange="fullSceneChange">
          </vote-fullscene-list>
        </div>
      </div>
      <div v-if="showModel === 'video'" class="form-item">
        <div class="form-title">上传视频</div>
        <div class="form-tips-div" v-if="videoMode === '3'">视频格式为MP4，建议大小不超过50M，尺寸3:4.5</div>
        <div class="form-tips-div" v-else>视频格式为MP4，建议大小不超过50M，尺寸16:9</div>
        <div class="form-content">
          <video-upload :videoMode="videoMode" :loading.sync="loading" :fileList="fileList" @changeFile="changeFile"></video-upload>
        </div>
      </div>
      <div v-if="showModel === 'video'" class="form-item">
        <div class="form-title">视频封面<span class="form-tips">(选填)</span></div>
        <div class="form-tips-div"></div>
        <div class="form-tips-div" v-if="videoMode === '3'">建议比例3:4.5，支持PNG、JPG、GIF格式，小于5M</div>
        <div class="form-tips-div" v-else>建议比例16:9，支持PNG、JPG、GIF格式，小于5M</div>
        <div class="form-content">
          <file-upload :loading.sync="videoCoverLoading"
            ref="video-file-upload"
            flag="videoCover"
            :imageRatio="videoMode === '3' ? 1 : 0"
            :fileList="videoCoverList"
            @changeFile="changeVideoCoverFile">
          </file-upload>
        </div>
      </div>
      <div v-if="showModel === 'picture'" class="form-item">
        <div class="form-title">上传图片</div>
        <div class="form-tips-div" v-if="imageRatio">建议比例：4:5.6（1寸照片的比例尺寸），小于5M；图片最多上传9张；支持PNG、JPG、GIF格式</div>
        <div class="form-tips-div" v-else>建议比例：1:1，小于5M；图片最多上传9张；支持PNG、JPG、GIF格式</div>
        <div class="form-content">
          <file-upload
            ref="picture-file-upload"
            :imageRatio="imageRatio"
            :loading.sync="loading"
            :flag="showModel"
            :fileList="fileList"
            @changeFile="changeFile">
          </file-upload>
        </div>
      </div>
      <div v-if="showModel === 'audio'" class="form-item">
        <div class="form-title">上传音频<span class="form-tips">(音频格式为MP3)</span></div>
        <div class="form-content">
          <file-upload :loading.sync="loading" :flag="showModel" :fileList="fileList" @changeFile="changeFile"></file-upload>
        </div>
      </div>
      <div v-if="showModel === 'text'" class="form-item">
        <div class="form-title">文字内容</div>
        <div class="form-content">
          <el-input type="textarea" v-model="examineData.introduce" @blur="blurAction()"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">{{nameStr}}</div>
        <div class="form-content">
          <el-input v-model="examineData.name" @blur="blurAction()" maxlength="40"></el-input>
        </div>
      </div>
      <div class="form-item" v-if="isOpenClassify">
        <div class="form-title" v-if="id === '0e6e35cd3c234e02bb1137d56b6d94f8'">选择市及县区</div>
        <div class="form-title" v-else>分类</div>
        <div class="form-content classify-wrap">
          <el-input v-model="examineData.type_name"
            :readonly="true"
            placeholder="请选择"
            @focus="showClassifyAction()"
            @blur="blurAction()">
          </el-input>
          <div class="drop-icon"></div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title" v-if="id === '0e6e35cd3c234e02bb1137d56b6d94f8'">乡镇及行政村</div>
        <div class="form-title" v-else>{{ZCIdType ? '所属村居' : '来源'}}<span class="form-tips">{{ZCIdType ? '' : '(选填)'}}</span></div>
        <div class="form-content">
          <el-input v-model="examineData.source" @blur="blurAction()" maxlength="20"></el-input>
        </div>
      </div>
      <div class="form-item" v-if="showModel !== 'text'">
        <div class="form-title">{{describeStr}}<span class="form-tips">{{describeSuffix}}</span></div>
        <div class="form-content">
          <el-input type="textarea" maxlength="500" @blur="blurAction()" show-word-limit v-model="examineData.introduce"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">联系人姓名</div>
        <div class="form-content">
          <el-input v-model="examineData.contact_name" @blur="blurAction()" maxlength="20"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">联系人电话</div>
        <div class="form-content">
          <el-input v-model="examineData.contact_phone" @blur="blurAction()" maxlength="11"></el-input>
        </div>
      </div>
      <div class="submit-btn-wrap" @click="!disabled && commitVote()">
        <span class="menu-text color-button_text">提交</span>
      </div>
    </form>
    <classify-dialog
      :show="isShowClassify"
      :classifyData="classifyData"
      :defaultSelect="defaultSelect"
      @success="getTypeSuccess">
    </classify-dialog>
  </div>
</template>

<script>
import FileUpload from '@/components/vote/global/file-upload'
import VideoUpload from '@/components/vote/global/video-upload'
import ClassifyDialog from '@/components/vote/global/vote-classify-dialog'
import VoteFullsceneList from '@/components/vote/global/vote-fullscene-list'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { fullSceneMap } from '@/utils/config'
import { Toast } from 'mint-ui'

export default {
  created () {
    this.initForm()
  },
  components: {
    FileUpload, VideoUpload, ClassifyDialog, VoteFullsceneList
  },
  props: {
    id: String,
    flag: String
  },
  data () {
    return {
      ZCId: '093cbe62f85b451fb44adbfafe606340', // 阅增城的一个活动配置
      ZCIdIndex1: '4b07592637c642d4afd931dc3b6d3753',
      ZCIdIndex2: 'ab3bf9c79f2b4870806d1665e4f8d33b',
      ZCIdType: false,
      showModel: this.flag,
      disabled: false,
      examineData: {
        name: '',
        source: '',
        introduce: '',
        contact_name: '',
        contact_phone: '',
        type_id: '',
        type_name: ''
      },
      material: {
        image: [],
        video: [],
        audio: []
      },
      fileList: [],
      worksId: '',
      loading: false,
      isOpenClassify: false,
      isShowClassify: false,
      classifyData: [],
      defaultSelect: {},
      videoCoverLoading: false,
      videoCoverList: [],
      videoCover: '',
      imageRatio: 0, // 图片模式
      videoMode: '1', // 视频展示模式 1: 横屏1行1个 2: 横屏1行2个 3: 竖屏1行2个
      darkMark: '1', // 1: 深色系 2: 浅色系
      checkFullScene: '', // 选中的全场景
      fullSceneType: [], // 全场景的搜索条件
      fullSceneMap,
      nameStr: '名称',
      describeStr: '描述',
      describeSuffix: '(选填)',
      full_scene_type: ''
    }
  },
  mounted () {
    if (this.id === this.ZCId) {
      this.ZCIdType = true
    } else {
      this.ZCIdType = false
    }

    if (this.id === this.ZCId) {
      this.nameStr = '作品名称及朗诵人'
      this.describeStr = '作品描述'
      this.describeSuffix = '(必填)'
    } else if (this.id === this.ZCIdIndex1) {
      this.nameStr = '照片主题'
      this.describeStr = '照片描述'
      this.describeSuffix = ''
    } else if (this.id === this.ZCIdIndex2) {
      this.nameStr = '留言标题'
    }

    this.judgeStatus()
  },
  methods: {
    judgeStatus () {
      if (this.showModel === 'picture') {
        // 图片
        this.full_scene_type = 2
      } else if (this.showModel === 'text') {
        // 文本
        this.full_scene_type = 3
      } else if (this.showModel === 'video') {
        // 视频
        this.full_scene_type = 1
      } else if (this.showModel === 'audio') {
        // 音频
        this.full_scene_type = 4
      }
    },
    async initForm () {
      let detailInfo = STORAGE.get('detailInfo')
      let isOpenClassify = false
      // 控制显隐分类
      if (detailInfo) {
        let rule = detailInfo.rule
        let limit = rule.limit
        if (limit.is_open_classify && limit.is_open_classify === 1) {
          isOpenClassify = true
          this.isOpenClassify = true
        }
        if (limit.show_mode) {
          this.videoMode = limit.show_mode
        }
        let pageSetup = rule.page_setup
        if (pageSetup) {
          // 判断图片模式
          if (pageSetup.image_ratio) {
            this.imageRatio = 1
          } else {
            this.imageRatio = 0
          }
          if (pageSetup.font_color) {
            this.darkMark = pageSetup.font_color
          }
        }
        if (detailInfo.mark === 'commonvote-fullscene') {
          let arr = limit.full_scene_type
          if (arr && arr.length) {
            let newArr = arr.filter(item => {
              if (item !== '4') {
                return true
              }
            })
            if (newArr.length) {
              let key = newArr[0]
              this.fullSceneType = newArr
              this.checkFullScene = key
              this.showModel = this.fullSceneMap[key][1]
            }
          }
        }
      }
      let { worksId } = this.$route.query
      if (worksId) {
        // 获取详情
        API.getReportDetail({
          query: {
            id: this.id
          }
        }).then(res => {
          if (!res) {
            return
          }
          this.worksId = worksId
          let flag = this.showModel
          if (res.material) {
            if (flag === 'picture') {
              this.fileList = res.material.image
              this.material.image = res.material.image
            } else if (flag === 'video') {
              let video = res.material.video
              this.fileList = video
              this.material.video = video
              if (video && video.length) {
                let url = video[0].cover_image
                if (url) {
                  this.videoCoverList = [{
                    url
                  }]
                  this.videoCover = url
                }
              }
            } else if (flag === 'audio') {
              this.fileList = res.material.audio
              this.material.audio = res.material.audio
            }
          }
          this.examineData = {
            name: res.name,
            source: res.source,
            introduce: res.introduce,
            contact_name: res.contact_name,
            contact_phone: res.contact_phone,
            type_id: res.type_id,
            type_name: res.type_name
          }
          if (res.full_scene_type) {
            this.checkFullScene = res.full_scene_type
            this.showModel = this.fullSceneMap[res.full_scene_type][1]
          }
          this.getVoteTypeFid(res.type_id, res.type_name)
        })
      }
      if (isOpenClassify) {
        this.initVoteType()
      }
    },
    initVoteType () {
      API.getVoteType({
        query: { id: this.id }
      }).then(res => {
        let data = res.data
        if (data && data.length) {
          this.classifyData = data
        }
      })
    },
    getVoteTypeFid (typeId, typeName) {
      API.getVoteTypeFid({
        query: {
          id: this.id,
          worksId: typeId
        }
      }).then(res => {
        let defaultSelect = {
          id: typeId,
          name: typeName
        }
        if (res && res.length) {
          defaultSelect.fid = res[0].fid
        }
        this.defaultSelect = defaultSelect
      })
    },
    showClassifyAction () {
      this.isShowClassify = true
      if (!this.defaultSelect || !this.defaultSelect.name) {
        if (this.classifyData && this.classifyData.length) {
          this.defaultSelect = this.classifyData[0]
        }
      }
    },
    getTypeSuccess (val) {
      this.examineData.type_id = val.id
      this.examineData.type_name = val.name
      this.defaultSelect = val
      this.isShowClassify = false
    },
    blurAction () {
      document.body.scrollTop = 0
    },
    commitVote () {
      let id = this.id
      let examineData = this.examineData
      if (!id) {
        return
      }
      if (this.loading) {
        Toast('文件正在上传中，请稍后再提交')
        return
      }
      if (!examineData.name || !examineData.name.trim()) {
        let _name = '请输入名称'
        if (this.id === this.ZCId) {
          _name = '请输入作品名称及朗诵人'
        } else if (this.id === this.ZCIdIndex1) {
          _name = '请输入照片主题'
        } else if (this.id === this.ZCIdIndex2) {
          _name = '请输入留言标题'
        }
        Toast(_name)
        return
      }
      // if (!examineData.source || !examineData.source.trim()) {
      //   let _origin = '请输入来源'
      //   if (this.ZCIdType) {
      //     _origin = '请输入所属村居'
      //   }
      //   Toast(_origin)
      //   return
      // }
      if (this.showModel === 'text') {
        if (!examineData.introduce || !examineData.introduce.trim()) {
          Toast('请输入文字内容')
          return
        }
      }
      if (!examineData.contact_name || !examineData.contact_name.trim()) {
        Toast('请输入联系人姓名')
        return
      }
      if (!examineData.contact_phone || !examineData.contact_phone.trim()) {
        Toast('请输入联系人电话')
        return
      }
      if (this.isOpenClassify) {
        if (!examineData.type_name) {
          Toast('请选择分类')
          return
        }
      }
      let data = {
        voting_id: id,
        material: {
          ...this.material
        },
        ...examineData
      }
      if (this.checkFullScene) {
        data.full_scene_type = this.checkFullScene
      } else {
        data.full_scene_type = this.full_scene_type
      }
      if (this.worksId) {
        data.id = this.worksId
      }
      this.disabled = true

      API.workReport({
        data
      }).then(res => {
        this.disabled = false
        if (res.error_code) {
          Toast(res.error_message)
          return
        }
        Toast('报名成功')
        this.$router.replace({
          name: 'votebegin',
          params: { id }
        })
      })
    },
    changeFile () {
      let fileList = this.fileList
      if (!fileList || fileList.length <= 0) {
        this.material = {...this.material}
      }
      if (this.showModel === 'video') {
        if (this.videoCover) {
          fileList.forEach(item => {
            item.cover_image = this.videoCover
          })
        }
        this.material = {...this.material, video: [...this.fileList]}
      } else if (this.showModel === 'picture') {
        this.material = {...this.material, image: [...this.fileList]}
      } else if (this.showModel === 'audio') {
        this.material = {...this.material, audio: [...this.fileList]}
      }
    },
    changeVideoCoverFile () {
      let videoCoverList = this.videoCoverList
      let material = this.material
      let coverImage = ''
      if (videoCoverList && videoCoverList.length) {
        let img = videoCoverList[0]
        if (img.url) {
          coverImage = img.url
        } else {
          coverImage = `${img.host}${img.filename}`
        }
      }
      if (material && material.video) {
        if (material.video.length) {
          material.video[0].cover_image = coverImage
        }
        this.videoCover = coverImage
      }
    },
    fullSceneChange (key) {
      if (key) {
        this.fileList = []
        this.material = {
          image: [],
          video: [],
          audio: []
        }
        this.videoCoverList = []
        this.checkFullScene = key
        this.showModel = this.fullSceneMap[key][1]
        this.$nextTick(() => {
          let obj1 = this.$refs['video-file-upload']
          let obj2 = this.$refs['picture-file-upload']
          console.log(obj1, obj2)
          obj1 && obj1.clearFile()
          obj2 && obj2.clearFile()
        })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .form-submit-wrap {
    // background-color: #221A6E;
    // @include bg-color('bgColor');
    padding: px2rem(30px);
    min-height: 100vh;
    .form-item {
      margin-bottom: px2rem(30px);
      .form-title {
        display: flex;
        align-items: center;
        // color: #fff;
        @include font-color('fontColor');
        @include font-dpr(16px);
      }
      .form-tips {
        display: inline-block;
        margin-left: px2rem(20px);
        @include font-dpr(12px);
        color: rgba(255, 255, 255, 0.5);
      }
      .form-tips-div {
        @include font-dpr(12px);
        color: rgba(255, 255, 255, 0.5);
      }
      .form-content {
        margin-top: px2rem(20px);
        &.classify-wrap {
          position: relative;
          .drop-icon {
            position: absolute;
            right: px2rem(28px);
            top: px2rem(32px);
            width: px2rem(30px);
            height: px2rem(16px);
            background-size: px2rem(30px) px2rem(16px);
            @include img-retina("~@/assets/common/dropdown-icon@2x.png","~@/assets/common/dropdown-icon@3x.png", 100%, 100%);
          }
        }
        .el-input__inner, .el-textarea__inner {
          -webkit-appearance: none;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: px2rem(16px);
          padding: 0 px2rem(30px);
          @include font-dpr(16px);
          // color: #fff;
          @include font-color('fontColor');
          border: 0;
        }
        .el-input .el-input__inner {
          height: px2rem(80px);
          line-height: normal;
        }
        .el-textarea {
          .el-textarea__inner {
            resize: none;
            height: px2rem(300px);
            padding: px2rem(10px) px2rem(30px);
            padding-bottom: px2rem(50px);
          }
          .el-input__count {
            @include font-dpr(14px);
            color: rgba(255,255,255,0.5);
            background-color: transparent;
            left: px2rem(30px);
            right: 0;
          }
        }
      }
    }
    .submit-btn-wrap {
      margin-top: px2rem(30px);
      height: px2rem(80px);
      line-height: px2rem(80px);
      text-align: center;
      border-radius: px2rem(8px);
      // background-color: #FC7465;
      @include bg-color('btnColor');
      .menu-text {
        @include font-dpr(14px);
        color: #fff;
      }
    }
    &.light {
      .form-item {
        .form-tips, .form-tips-div  {
          color: rgba(0, 0, 0, 0.4);
        }
        .form-content {
          .el-input__inner, .el-textarea__inner {
            background-color: #fff;
          }
        }
        .el-textarea .el-input__count {
          color: rgba(0, 0, 0, 0.4);
        }
      }
      .el-upload--picture-card i {
        color: rgba(0, 0, 0, 0.1);
      }
      .el-upload {
        background-color: #fff;
      }
    }
  }
</style>
