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
        <div class="form-title">{{videoTitle}}</div>
        <div class="form-tips-div" v-if="videoMode === '3'">视频格式为MP4，建议大小不超过50M，尺寸3:4.5</div>
        <div class="form-tips-div" v-else>视频格式为MP4，建议大小不超过50M，尺寸16:9</div>
        <div class="form-content">
          <video-upload
            :videoMode="videoMode"
            :loading.sync="loading"
            :fileList.sync="fileList"
            @changeFile="changeFile">
          </video-upload>
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
        <div class="form-title">{{imgTitle}}</div>
        <div class="form-tips-div" v-if="imageRatio">建议比例：4:5.6（1寸照片的比例尺寸），小于5M；图片至少上传{{minUploadImgNum}}张,最多上传{{maxUploadImgNum}}张；支持PNG、JPG、GIF格式</div>
        <div class="form-tips-div" v-else>建议比例：1:1，小于5M；图片至少上传{{minUploadImgNum}}张, 最多上传{{maxUploadImgNum}}张；支持PNG、JPG、GIF格式</div>
        <div class="form-content">
          <file-upload
            ref="picture-file-upload"
            :maxUploadImgNum='maxUploadImgNum'
            :imageRatio="imageRatio"
            :loading.sync="loading"
            :flag="showModel"
            :fileList="fileList"
            @changeFile="changeFile">
          </file-upload>
        </div>
      </div>
      <div v-if="showModel === 'audio'" class="form-item">
        <div class="form-title">{{audioTitle}}<span class="form-tips">(音频格式为MP3)</span></div>
        <div class="form-content">
          <file-upload :loading.sync="loading" :flag="showModel" :fileList="fileList" @changeFile="changeFile"></file-upload>
        </div>
      </div>
      <!-- <div v-if="showModel === 'text'" class="form-item">
        <div class="form-title">文字内容</div>
        <div class="form-content">
          <el-input type='textarea' v-model="examineData.introduce" @blur="blurAction()"></el-input>
        </div>
      </div> -->
      <div class="form-item" v-if="isOpenClassify">
        <div class="form-title" v-if="id === '0e6e35cd3c234e02bb1137d56b6d94f8'">选择市及县区</div>
        <div class="form-title" v-else>分类</div>
        <div class="form-content classify-wrap">
          <el-input v-model.trim="examineData.type_name"
            :readonly="true"
            placeholder="请选择"
            @focus="showClassifyAction()"
            @blur="areaBlurAction()">
          </el-input>
          <div class="drop-icon"></div>
        </div>
      </div>
      <!-- 字段列表 -->
      <template v-for='item in enrollForm.formFixList'>
        <!-- && item.unique_name !== "form_6" -->
        <div :key='item.unique_name'
          v-if='!["video", "image"].some(type => type == item.type) && item.visibleAuthValue == 1'
          class="form-item">
          <div class="form-title">
            {{item.formTitle}}
            <span class="form-tips">{{item.nesWriteValue == 1 ? '' : '(选填)'}}</span>
          </div>
          <div v-if='item.type == "singleText"' class="form-content">
            <el-input v-model.trim="item.inputValue" maxlength="40"></el-input>
          </div>
          <div class="form-content">
            <el-input type='textarea' v-if='item.type == "mulText"'
              v-model.trim="item.inputValue"
              rows="5" cols="20">
            </el-input >
          </div>
        </div>
      </template>
      <!-- 收集信息 -->
      <template>
        <div v-for='(item, index) in enrollForm.visibleFieldList'
          :key='index' class="form-item">
          <div class="form-title">
            {{item.fieldSuffix}}
            <span class="form-tips">{{item.nesWriteValue == 1 ? '' : '(选填)'}}</span>
          </div>
          <div v-if='item.type === "singleText"' class="form-content">
            <el-input v-model.trim="item.inputValue"
              @blur="blurAction()" maxlength="20">
            </el-input>
          </div>
          <div v-if='item.type === "mulText"' class="form-content">
            <el-input type='textarea'  v-model.trim="item.inputValue"
              @blur="blurAction()"
              class='font-ctx-wrap'
              rows="5" cols="20">
            </el-input>
          </div>
          <div v-if='item.type === "downSelect"' class="form-content">
            <el-select v-model="item.inputValue" placeholder="请选择" style='width: 100%;'>
              <el-option v-for="(item1, index1) in item.option"
                :key="index1"
                :label="item1.value"
                :value="item1.value">
              </el-option>
            </el-select>
          </div>
          <!-- area -->
          <div  class="check-item form-content" v-if='item.type === "area"'>
            <el-input v-model.trim="item.inputValue"
              placeholder="地址"
              readonly
              @focus="focusAction('address')"
              @blur="blurAction()"
              maxlength="200"
              type="text">
            </el-input>
          </div>
        </div>
      </template>
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

    <city-select-dialog
      style='width: 100vw;'
      :show="isShowCitySelect"
      @close="isShowCitySelect = false"
      @success="selectSuccessAction">
    </city-select-dialog>
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
import { Select, Option } from 'element-ui'
import CitySelectDialog from '@/components/dialog/city-select-dialog'

export default {
  components: {
    FileUpload,
    VideoUpload,
    ClassifyDialog,
    VoteFullsceneList,
    ElSelect: Select,
    ElOption: Option,
    CitySelectDialog
  },
  props: {
    id: String,
    flag: String
  },
  data () {
    return {
      isShowCitySelect: false,
      imgTitle: '上传图片',
      videoTitle: '上传视频',
      audioTitle: '上传音频',
      textTitle: '文字内容',
      curDetailInfo: {},
      maxUploadImgNum: 9,
      minUploadImgNum: 1,
      enrollForm: {},
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
      examineDataStr: '',
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
      full_scene_type: '',
      choiced_works_type: [] // 1 => video  2 => image 3 => text 4 => audio
    }
  },
  created () {
    this.examineDataStr = JSON.stringify(this.examineData)
    this.mixinList()
    this.initForm()
  },
  mounted () {
    this.curDetailInfo = STORAGE.get('detailInfo')
    this.judgeStatus()
    this.choiced_works_type = STORAGE.get('detailInfo').rule.works_type_set.choiced_works_type
  },
  methods: {
    focusAction (type) {
      if (type === 'address') {
        this.isShowCitySelect = true
      }
    },
    selectSuccessAction (data) {
      this.isShowCitySelect = false
    },
    areaBlurAction () {
      document.body.scrollTop = 0
    },
    mixinList () {
      this.enrollForm = {}
      try {
        this.enrollForm = STORAGE.get('detailInfo').rule.enroll_form
        for (let i of this.enrollForm.formFixList) {
          this.$set(i, 'inputValue', '')
        }
        for (let i of this.enrollForm.visibleFieldList) {
          this.$set(i, 'inputValue', '')
        }
        this.titleReSet()
      } catch (e) {
        console.log(e)
      }
    },
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

      // 图片上传数量的限制
      try {
        // 是否存在图片
        const worksTypeSet = detailInfo.rule.works_type_set
        const choicedWorksType = worksTypeSet.choiced_works_type
        let _isExistImg = false
        _isExistImg = choicedWorksType.some(item => item === '2')
        if (_isExistImg) {
          this.maxUploadImgNum = worksTypeSet.max_img_num
          this.minUploadImgNum = worksTypeSet.min_img_num
        }
      } catch (e) {
        console.log(e)
      }
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
          // let arr = limit.full_scene_type
          let arr = STORAGE.get('detailInfo').rule.works_type_set.choiced_works_type
          if (arr && arr.length) {
            let newArr = arr.filter(item => {
              if (item !== '4') {
                return true
              }
            })
            if (newArr.length) {
              let key = newArr[0]
              // this.fullSceneType = newArr
              this.fullSceneType = rule.works_type_set.choiced_works_type // 作品类型
              this.checkFullScene = key
            //  this.showModel = this.fullSceneMap[key][1]
            }
          }
        }
      }

      let { worksId } = this.$route.query
      // 获取详情 【编辑时获取详情】
      if (worksId) {
        this.getWorksDetail(worksId)
      }
      if (isOpenClassify) {
        this.initVoteType()
      }
    },
    titleReSet () {
      // 名称的重新赋值
      let _formFixList = this.enrollForm.formFixList
      this.videoTitle = _formFixList[0].formTitle
      this.imgTitle = _formFixList[1].formTitle
      this.textTitle = _formFixList[2].formTitle
    },
    getWorksDetail (worksId) {
      // 获取详情
      API.getReportDetail({
        query: {
          id: this.id
        }
      }).then(res => {
        if (!res) {
          return
        }

        this.titleReSet()
        // 输入值得回显
        let _extra = res.extra
        for (let [key, value] of Object.entries(_extra)) {
          for (let i of this.enrollForm.formFixList) {
            if (i.cid === key) {
              i.inputValue = value
            }
          }

          for (let i of this.enrollForm.visibleFieldList) {
            if (i.cid === key) {
              i.inputValue = value
            }
          }
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
          this.checkFullScene = String(res.full_scene_type)
          this.showModel = this.fullSceneMap[res.full_scene_type][1]
        }
        this.getVoteTypeFid(res.type_id, res.type_name)
      })
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
    checkValue (data) {
      if (this.checkFullScene === '1') {
        // 视频
        if (this.material.video.length === 0) {
          Toast('请上传视频')
          return true
        }
      } else if (this.checkFullScene === '2' || this.curDetailInfo.mark === 'commonvote-image') {
        // 图片
        if (this.material.image.length === 0) {
          Toast('请上传图片')
          return true
        }
        // 最少上传图片判断
        let minImgNum = this.curDetailInfo.rule.works_type_set.min_img_num
        if (this.material.image.length < minImgNum) {
          Toast(`至少上传${minImgNum}图片`)
          return true
        }
      }

      for (const i of this.enrollForm.formFixList) {
        // if (i.unique_name === 'form_6') {
        //   i.inputValue = this.examineData.introduce
        //   if (i.inputValue === '') {
        //     Toast(`请输入${i.formTitle}`)
        //     return true
        //   }
        // }

        // 标题
        if (i.unique_name === 'form_3') {
          if (i.inputValue === '') {
            Toast(`请输入${i.formTitle}`)
            return true
          }
        }

        // 显示且必填且不为空才可以弹窗
        if (i.unique_name === 'form_4' || i.unique_name === 'form_5') {
          if (i.visibleAuthValue === 1 && i.nesWriteValue === 1 && i.inputValue === '') {
            Toast(`请输入${i.formTitle}`)
            return true
          }
        }
      }

      for (const j of this.enrollForm.visibleFieldList) {
        if (j.nesWriteValue === 1 && j.inputValue === '') {
          Toast(`请输入${j.fieldSuffix}`)
          return true
        }
      }
      // 不论手机号码是否是选填必填，都需要校验
      for (const j of this.enrollForm.visibleFieldList) {
        // 手机号码的校验
        if (j.inputValue !== '' && j.value === 'phone') {
          let regex = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/ // 手机号码校验规则
          if (!regex.test(j.inputValue)) {
            Toast('手机格式有误，请输入正确的手机号')
            return true
          }
        }
      }

      return false
    },
    commitVote () {
      let id = this.id
      let examineData = this.examineData
      if (!id) {
        console.log('进入这里')
        return
      }
      if (this.loading) {
        Toast('文件正在上传中，请稍后再提交')
        return
      }

      // 校验值
      if (this.checkValue()) {
        return false
      }

      let _extra = {}
      for (let i of this.enrollForm.formFixList) {
        _extra[i.cid] = i.inputValue
      }
      for (let j of this.enrollForm.visibleFieldList) {
        _extra[j.cid] = j.inputValue
      }

      for (let i of this.enrollForm.formFixList) {
        // 标题
        if (i.unique_name === 'form_3') {
          this.examineData.name = i.inputValue
        }
        // 来源
        if (i.unique_name === 'form_5') {
          this.examineData.source = i.inputValue
        }
      }

      for (let i of this.enrollForm.visibleFieldList) {
        // 联系人姓名
        if (i.value === 'name') {
          this.examineData.contact_name = i.inputValue
        }
        // 联系人手机号
        if (i.value === 'phone') {
          this.examineData.contact_phone = i.inputValue
        }
      }

      let data = {
        voting_id: id,
        material: {
          ...this.material
        },
        ...examineData,
        extra: _extra
      }

      if (this.checkFullScene) {
        data.full_scene_type = this.checkFullScene
      } else {
        data.full_scene_type = this.full_scene_type
      }
      if (this.worksId) {
        data.id = this.worksId
      }

      // 判断是不是初次进入
      let _mywork = this.curDetailInfo.mywork
      if (STORAGE.get('isFirstUpload')) {
        STORAGE.remove('isFirstUpload')
      }
      if (_mywork.length === 0) {
        STORAGE.set('isFirstUpload', true)
      } else {
        STORAGE.set('isFirstUpload', false)
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
      }).catch(e => {
        this.disabled = false
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
  .font-ctx-wrap{
    background:#FFFFFF;
    width: 100%;
    border-radius: px2rem(10px);
    padding: 5px;
  }

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

  .check-item {
    width: 100%;
    margin-bottom: px2rem(30px);
    position: relative;
    .el-input__inner, .el-textarea__inner {
      -webkit-appearance: none;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: px2rem(4px);
      padding: px2rem(20px);
      @include font-dpr(14px);
      color: #333;
      border: 1px solid #dadada;
      &::placeholder {
        @include font-dpr(14px);
        color: #999;
      }
    }
    .el-input .el-input__inner {
      height: px2rem(90px);
      line-height: normal;
    }
    .el-textarea {
      .el-textarea__inner {
        resize: none;
        height: px2rem(140px);
      }
    }
    .get-img-code {
      position: absolute;
      right: px2rem(28px);
      top: px2rem(15px);
      width: px2rem(180px);
      height: px2rem(60px);
      background-size: px2rem(180px) px2rem(60px);
    }
    .get-code {
      position: absolute;
      right: px2rem(28px);
      top: px2rem(25px);
      @include font-dpr(14px);
      // color: #FF6A45;
      @include font-color('btnColor');
    }
    .get-code-time {
      position: absolute;
      right: px2rem(28px);
      top: px2rem(25px);
      @include font-dpr(14px);
      color: #666;
    }
  }
</style>
