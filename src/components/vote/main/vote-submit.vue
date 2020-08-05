<template>
  <div class="form-submit-wrap">
    <form>
      <div v-if="flag === 'video'" class="form-item">
        <div class="form-title">上传视频<span class="form-tips">(视频格式为MP4，时长不能超过60s)</span></div>
        <div class="form-content">
          <video-upload :loading.sync="loading" :fileList="fileList" @changeFile="changeFile"></video-upload>
        </div>
      </div>
      <div v-if="flag === 'picture'" class="form-item">
        <div class="form-title">上传图片</div>
        <div class="form-tips">(图片最多上传9张，支持PNG、JPG、GIF格式，小于5M)</div>
        <div class="form-content">
          <file-upload :loading.sync="loading" :flag="flag" :fileList="fileList" @changeFile="changeFile"></file-upload>
        </div>
      </div>
      <div v-if="flag === 'audio'" class="form-item">
        <div class="form-title">上传音频<span class="form-tips">(音频格式为MP3，时长不能超过60s)</span></div>
        <div class="form-content">
          <file-upload :flag="flag" :fileList="fileList"></file-upload>
        </div>
      </div>
      <div v-if="flag === 'text'" class="form-item">
        <div class="form-title">文字内容</div>
        <div class="form-content">
          <el-input type="textarea" v-model="examineData.introduce"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">名称</div>
        <div class="form-content">
          <el-input v-model="examineData.name"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">来源</div>
        <div class="form-content">
          <el-input v-model="examineData.source"></el-input>
        </div>
      </div>
      <div class="form-item" v-if="flag !== 'text'">
        <div class="form-title">描述</div>
        <div class="form-content">
          <el-input type="textarea" maxlength="500" show-word-limit v-model="examineData.introduce"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">联系人姓名</div>
        <div class="form-content">
          <el-input v-model="examineData.contact_name"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">联系人电话</div>
        <div class="form-content">
          <el-input v-model.number="examineData.contact_phone"></el-input>
        </div>
      </div>
      <div class="submit-btn-wrap color-button_color" @click="!disabled && commitVote()">
        <span class="menu-text color-button_text">提交</span>
      </div>
    </form>
  </div>
</template>

<script>
import FileUpload from '@/components/vote/global/file-upload'
import VideoUpload from '@/components/vote/global/video-upload'
import API from '@/api/module/examination'
import { Toast } from 'mint-ui'

export default {
  created () {
    this.initForm()
  },
  components: {
    FileUpload, VideoUpload
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
        contact_phone: ''
      },
      material: {
        image: [],
        video: [],
        audio: []
      },
      fileList: [],
      worksId: '',
      loading: false
    }
  },
  methods: {
    initForm () {
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
          this.examineData = {
            name: res.name,
            source: res.source,
            introduce: res.introduce,
            contact_name: res.contact_name,
            contact_phone: res.contact_phone
          }
        })
      }
    },
    commitVote () {
      let id = this.id
      if (!id) {
        return
      }
      if (this.loading) {
        Toast('文件正在上传中，请稍后再提交')
        return
      }
      let data = {
        voting_id: id,
        material: {
          ...this.material
        },
        ...this.examineData
      }
      if (this.worksId) {
        data.id = this.worksId
      }
      this.disabled = true
      API.workReport({
        data
      }).then(res => {
        if (res.error_code) {
          Toast(res.error_message)
          return
        }
        this.disabled = false
        Toast('报名成功')
        this.$router.replace({
          name: 'votebegin',
          params: { id }
        })
      })
    },
    changeFile () {
      let fileList = this.fileList
      // console.log('changeFile', fileList)
      if (!fileList || fileList.length <= 0) {
        this.material = {...this.material}
      }
      if (this.flag === 'video') {
        this.material = {...this.material, video: [...this.fileList]}
      } else if (this.flag === 'picture') {
        this.material = {...this.material, image: [...this.fileList]}
      } else if (this.flag === 'audio') {
        this.material = {...this.material, audio: [...this.fileList]}
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
        @include font-dpr(12px);
        color: rgba(255, 255, 255, 0.5);
      }
      .form-content {
        margin-top: px2rem(20px);
        .el-input__inner, .el-textarea__inner {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: px2rem(8px);
          padding: 0 px2rem(30px);
          @include font-dpr(14px);
          color: #fff;
          border: 0;
        }
        .el-input .el-input__inner {
          height: px2rem(80px);
          line-height: px2rem(80px);
        }
        .el-textarea {
          .el-textarea__inner {
            resize: none;
            height: px2rem(300px);
            padding: px2rem(10px) px2rem(30px);
          }
          .el-input__count {
            @include font-dpr(14px);
            color: rgba(255,255,255,0.5);
            background-color: transparent;
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
