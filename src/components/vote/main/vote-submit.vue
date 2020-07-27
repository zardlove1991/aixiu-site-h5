<template>
  <div class="form-submit-wrap">
    <form>
      <div class="form-item">
        <div class="form-title">上传视频<span class="form-tips">（视频格式为MP4，时长不能超过60s）</span></div>
        <div class="form-content">
          <file-upload :flag="flag" :fileList="fileList"></file-upload>
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
      <div class="form-item">
        <div class="form-title">描述</div>
        <div class="form-content">
          <el-input type="textarea" maxlength="500" show-word-limit v-model="examineData.desc"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">联系人姓名</div>
        <div class="form-content">
          <el-input v-model="examineData.username"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="form-title">联系人电话</div>
        <div class="form-content">
          <el-input v-model="examineData.phone"></el-input>
        </div>
      </div>
      <div class="submit-btn-wrap color-button_color">
        <span class="menu-text color-button_text">提交</span>
      </div>
    </form>
  </div>
</template>

<script>
import FileUpload from '@/components/vote/global/fileupload'

export default {
  created () {
    this.initForm()
  },
  components: {
    FileUpload
  },
  data () {
    return {
      examineData: {
        name: '',
        source: '',
        desc: '',
        username: '',
        phone: ''
      },
      fileList: [],
      flag: 'picture'
    }
  },
  methods: {
    initForm () {
      console.log('initForm')
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .form-submit-wrap {
    background-color: #221A6E;
    padding: px2rem(30px);
    min-height: 100vh;
    .form-item {
      margin-bottom: px2rem(30px);
      .form-title {
        display: flex;
        align-items: center;
        margin-bottom: px2rem(20px);
        color: #fff;
        @include font-dpr(16px);
        .form-tips {
          @include font-dpr(12px);
          color: rgba(255, 255, 255, 0.5);
        }
      }
      .form-content {
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
      background-color: #FC7465;
      .menu-text {
        @include font-dpr(14px);
        color: #fff;
      }
    }
  }
</style>
