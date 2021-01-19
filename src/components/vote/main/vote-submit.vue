<template>
  <div class="form-submit-wrap">
    <form>
      <div v-if="flag === 'video'" class="form-item">
        <div class="form-title">上传视频</div>
        <div class="form-tips-div" v-if="videoMode === '3'">视频格式为MP4，时长不能超过60s；建议尺寸3:4.5</div>
        <div class="form-tips-div" v-else>视频格式为MP4，时长不能超过60s；建议尺寸16:9</div>
        <div class="form-content">
          <video-upload :videoMode="videoMode" :loading.sync="loading" :fileList="fileList" @changeFile="changeFile"></video-upload>
        </div>
      </div>
      <div v-if="flag === 'video'" class="form-item">
        <div class="form-title">视频封面<span class="form-tips">(选填)</span></div>
        <div class="form-tips-div"></div>
        <div class="form-tips-div" v-if="videoMode === '3'">建议比例3:4.5，支持PNG、JPG、GIF格式，小于5M</div>
        <div class="form-tips-div" v-else>建议比例16:9，支持PNG、JPG、GIF格式，小于5M</div>
        <div class="form-content">
          <file-upload :loading.sync="videoCoverLoading"
            flag="videoCover"
            :imageRatio="videoMode === '3' ? 1 : 0"
            :fileList="videoCoverList"
            @changeFile="changeVideoCoverFile">
          </file-upload>
        </div>
      </div>
      <div v-if="flag === 'picture'" class="form-item">
        <div class="form-title">上传图片</div>
        <div class="form-tips-div" v-if="imageRatio">建议比例：4:5.6（1寸照片的比例尺寸）；图片最多上传9张；支持PNG、JPG、GIF格式；小于5M</div>
        <div class="form-tips-div" v-else>建议比例：1:1；图片最多上传9张；支持PNG、JPG、GIF格式；小于5M</div>
        <div class="form-content">
          <file-upload
            :imageRatio="imageRatio"
            :loading.sync="loading"
            :flag="flag"
            :fileList="fileList"
            @changeFile="changeFile">
          </file-upload>
        </div>
      </div>
      <div v-if="flag === 'audio'" class="form-item">
        <div class="form-title">上传音频<span class="form-tips">(音频格式为MP3)</span></div>
        <div class="form-content">
          <file-upload :loading.sync="loading" :flag="flag" :fileList="fileList" @changeFile="changeFile"></file-upload>
        </div>
      </div>
      <div v-if="flag === 'text'" class="form-item">
        <div class="form-title">文字内容</div>
        <div class="form-content">
          <el-input type="textarea" v-model="examineData.introduce" @blur="blurAction()"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">名称</div>
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
        <div class="form-title" v-else>来源</div>
        <div class="form-content">
          <el-input v-model="examineData.source" @blur="blurAction()" maxlength="20"></el-input>
        </div>
      </div>
      <div class="form-item" v-if="flag !== 'text'">
        <div class="form-title">描述</div>
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
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { Toast } from 'mint-ui'

export default {
  created () {
    this.initForm()
  },
  components: {
    FileUpload, VideoUpload, ClassifyDialog
  },
  props: {
    id: String,
    flag: String
  },
  data () {
    return {
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
      videoMode: '1'
    }
  },
  methods: {
    async initForm () {
      let detailInfo = STORAGE.get('detailInfo')
      let isOpenClassify = false
      // 控制显隐分类
      if (detailInfo) {
        let limit = detailInfo.rule.limit
        if (limit.is_open_classify && limit.is_open_classify === 1) {
          isOpenClassify = true
          this.isOpenClassify = true
        }
        if (limit.show_mode) {
          this.videoMode = limit.show_mode
        }
        // 判断图片模式
        let pageSetup = detailInfo.rule.page_setup
        if (pageSetup.image_ratio) {
          this.imageRatio = 1
        } else {
          this.imageRatio = 0
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
          let flag = this.flag
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
        Toast('请输入名称')
        return
      }
      if (!examineData.source || !examineData.source.trim()) {
        Toast('请输入来源')
        return
      }
      if (!examineData.introduce || !examineData.introduce.trim()) {
        if (this.disabledflag === 'text') {
          Toast('请输入文字内容')
        } else {
          Toast('请输入描述')
        }
        return
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
      if (this.flag === 'video') {
        if (this.videoCover) {
          fileList.forEach(item => {
            item.cover_image = this.videoCover
          })
        }
        this.material = {...this.material, video: [...this.fileList]}
      } else if (this.flag === 'picture') {
        this.material = {...this.material, image: [...this.fileList]}
      } else if (this.flag === 'audio') {
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
        color: #fff;
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
          border-radius: px2rem(8px);
          padding: 0 px2rem(30px);
          @include font-dpr(16px);
          color: #fff;
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
  }
</style>
