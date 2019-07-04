<template lang="html">
  <div class="subject-essay-wrap">
    <!--题目的标题-->
    <div class="subject-type-wrap">
      <h3 class="subject-type">
        <span>{{data.typeTip}}</span>
        <span class="score" v-show="data.score">{{`(${data.score}分)`}}</span>
      </h3>
      <!--问答题批阅得分提醒-->
      <div
        v-show="mode === 'analysis' && data.type === 'essay' && data.remark.score"
        class="essay-audio-score">{{`得${data.remark.score}分`}}</div>
    </div>
    <p class="subject-title">
      <span>{{`${currentSubjectIndex+1}.`}}</span>
      <span v-html="_dealHtmlLine(data.title)"></span>
    </p>
    <!--题干的媒体数据-->
    <div class="media-wrap" v-for="(media,mediaKey) in data.annex" :key="mediaKey">
      <img v-if="mediaKey=='image' && media.length" :src="annexMedia(media)"  @click.stop="_setPreviewState" v-preview="annexMedia(media)" preview-nav-enable="false" class="my-img"/>
      <!--音频播放-->
      <my-audio
        v-if="mediaKey=='audio' && annexMedia(media)"
        class="my-audio"
        :limit-info="{ isLimit: false }"
        :src="annexMedia(media)">
      </my-audio>
      <!--视频播放-->
      <my-video v-if="mediaKey=='video' && annexMedia(media)" class="my-video" :poster="annexMedia(media).cover" :src="annexMedia(media).src"></my-video>
    </div>
    <!--题目的内容区域-->
    <template v-if="essayTempAnswerInfo">
      <h4 class="title-tip">问答</h4>
      <!--表单编辑区域-->
      <div class="from-wrap">
        <div class="content-wrap" v-show="renderType === 'exam'">
          <textarea class="content" placeholder="请输入答案" maxlength="300"
            :value = "essayTempAnswerInfo.text"
            @input="uploadText"
            v-show="renderType === 'exam'">
          </textarea>
        </div>
        <!--回答的内容信息-->
        <p class="answer-content" v-show="renderType === 'analysis'">
          <span v-show="_checkMedaiObjIsEmpty(essayTempAnswerInfo)">当前没有回答信息哦~</span>
          <span v-show="essayTempAnswerInfo.text">{{essayTempAnswerInfo.text}}</span>
        </p>
        <!--上传的媒体展示区域-->
        <div class="upload-media-wrap">
          <div class="images-wrap" v-if="essayTempAnswerInfo.image.length">
            <div class="single-image-wrap" v-for="(item,index) in essayTempAnswerInfo.image" :key="index">
              <img :src="item" @click.stop="_setPreviewState" preview-nav-enable="false" class="eassy-image" v-preview="item"/>
              <!--删除图标-->
              <div class="delete-icon"
                v-show="renderType === 'exam'"
                @click.stop="deleteUploadData(index,'image')">
              </div>
            </div>
            <!--空白填充的个数-->
            <div class="single-image-wrap" v-for="item in _getEmptyDivNum(4, essayTempAnswerInfo.image)" :key="`empty_${item}`"></div>
          </div>
          <!--音频播放-->
          <div class="eassy-audio-wrap" v-if="essayTempAnswerInfo.audio.length">
            <my-audio class="eassy-audio" :src="essayTempAnswerInfo.audio[0]"></my-audio>
            <!--删除图标-->
            <div class="delete-icon"
              v-show="renderType === 'exam'"
              @click.stop="deleteUploadData(0, 'audio')">
            </div>
          </div>
          <!--视频播放-->
          <div class="eassy-video-wrap" v-if="essayTempAnswerInfo.video.length">
            <my-video class="eassy-video"
              :poster="essayTempAnswerInfo.video[0].cover"
              :src="essayTempAnswerInfo.video[0].src">
            </my-video>
            <!--删除图标-->
            <div class="delete-icon"
              v-show="mode === 'exam'"
              @click.stop="deleteUploadData(0, 'video')">
            </div>
          </div>
        </div>
        <!--上传区域-->
        <div class="upload-option-wrap" v-show="mode === 'exam'">
          <div class="upload-img"
            v-show="['unlimit','image'].includes(data.mode)"
            :class="{'disabled': essayTempAnswerInfo && (essayTempAnswerInfo.image.length > 8)}"
            @click.stop='uploadImg'>
            <i class="examfont icon-image"></i>
          </div>
          <div class="upload-audio"
            v-show="['unlimit','audio'].includes(data.mode)"
            :class="{'disabled': essayTempAnswerInfo && essayTempAnswerInfo.audio.length}"
            @click.stop="uploadAudio">
            <i class="examfont icon-audio"></i>
          </div>
          <div class="upload-video"
            v-show="['unlimit','video'].includes(data.mode)"
            :class="{'disabled': essayTempAnswerInfo && essayTempAnswerInfo.video.length}"
            @click.stop="uploadVideo"
            >
            <i class="examfont icon-video"></i>
          </div>
          <!--原生上传操作-->
          <input type="file"
            ref="uploadFileInput" name="filte" class="file-input"
            @change="fileUpload"/>
        </div>
      </div>
      <!--答案解析-->
      <div class="answerinfo-wrap" v-if="mode === 'analysis'">
        <div class="answer-analysis">
          <h4 class="title">解析</h4>
          <p class="content" v-if="data.analysis" v-html="data.analysis"></p>
          <p class="content" v-else>暂无解析内容~</p>
          <!--目前还没有类别和正确率 暂时隐藏-->
          <div class="exam-types" v-show="data.point && data.point.length">
            <span class="tip">考点</span>
            <span class="type" v-for="item in data.point" :key="item.id">{{item.name}}</span>
          </div>
        </div>
        <!--问答题的老师点评-->
        <div class="essay-markinfo-wrap" v-if="data.remark.score">
          <h4 class="title">点评</h4>
          <!--点评的老师信息先不展示-->
          <!-- <div class="teacher-info" v-show="data.remark.teacher.name">
            <img v-show="data.remark.teacher.avatar" :src="data.remark.teacher.avatar" class="icon" />
            <span class="name">{{data.remark.teacher.name}}</span>
          </div> -->
          <p class="markinfo" :class="{ 'empty-info': !data.remark.content.text }">
            <span v-show="_checkMedaiObjIsEmpty(data.remark.content)">此处无声胜有声~</span>
            <span v-show="data.remark.content.text">{{data.remark.content.text}}</span>
          </p>
          <!--图片展示-->
          <div class="mark-img-wrap" v-if="data.remark.content.image.length">
            <img :src="src" class="mark-img"
              @click.stop="_setPreviewState"
              v-preview="src" preview-nav-enable="false"
              v-for="(src, index) in data.remark.content.image" :key="index"/>
          </div>
          <!--音频播放-->
          <div class="mark-audio-wrap" v-if="data.remark.content.audio.length">
            <my-audio  class="mark-audio" :src="data.remark.content.audio[0]"></my-audio>
          </div>
          <!--视频播放-->
          <div class="mark-video-wrap" v-if="data.remark.content.video.length">
            <my-video class="mark-video"
              :poster="data.remark.content.video[0].cover"
              :src="data.remark.content.video[0].src">
            </my-video>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import SubItemMixin from '@/mixins/subject-item'
import SubjectMixin from '@/mixins/subject'
export default {
  name: 'essay-subject',
  mixins: [ SubItemMixin, SubjectMixin ],
  created () {
    // 赋值当前问答题临时对象 -> 调用mixin的方法
    this._setTempEssayAnswerInfo()
  }
}
</script>

<style lang="scss">
@import "@/styles/components/subjects/essay.scss";
</style>
