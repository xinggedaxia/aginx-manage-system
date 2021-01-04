<template>
  <div class="layout-content question-manage">
    <el-card class="box-card">

      <!--工具栏-->
      <sticky :z-index="10" :sticky-top="20" style="height: 70px">
        <div class="tool-button">
          <div
            class="table-page-search-submitButtons"
            :style="{ float: 'right', overflow: 'hidden' }"
          >
            <el-button type="primary" size="small" @click="handleSave">保存修改</el-button>
            <el-button size="small" @click="handleQuit">退出</el-button>
          </div>
        </div>
      </sticky>

      <!--表单-->
      <div class="createPost-main-container">
        <el-form ref="form" label-width="90px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="题目标题:" prop="title">
                <el-input
                  v-model="createForm.title"
                  placeholder="请输入题目标题"
                  required
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :sm="12">
              <el-form-item label="类型:" class="postInfo-container-item">
                <el-select
                  v-model="createForm.type"
                  placeholder="选择题目类型"
                >
                  <el-option
                    v-for="{labal,value} in questionTypeList"
                    :key="value"
                    :label="labal"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :lg="8" :sm="12">
              <el-form-item label="题目难度:" class="postInfo-container-item">
                <el-rate
                  v-model="createForm.level"
                  :max="5"
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                  :low-threshold="2"
                  :high-threshold="4"
                  style="display:inline-block"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="24">
              <markdown-editor ref="markdown" :answer.sync="createForm.answer" :html.sync="createForm.html" height="600px" />
            </el-col>
          </el-row>
        </el-form>

      </div>

    </el-card>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  name: 'EditQuestion',
  components: { Sticky, MarkdownEditor },
  data() {
    return {
      createForm: {
        title: '',
        type: 'html',
        level: 1,
        html: '',
        answer: '# 欢迎使用 Markdown在线编辑器 MdEditor\n' +
          '\n' +
          '**Markdown是一种轻量级的「标记语言」**\n' +
          '\n' +
          '![markdown](https://images.goodsmile.info/cgm/images/product/20190426/8307/60135/large/77deb943a7f8036245ea80d4d074e2f5.jpg)'
      },
      questionTypeList: [
        {
          label: 'html',
          value: 'html'
        },
        {
          label: 'js',
          value: 'js'
        }
      ]
    }
  },
  created() {
    this.createForm = this.$route.params.createFormData
  },
  methods: {
    handleSave() {
      alert(this.createForm.html)
    },
    handleQuit() {
      // this.$router.push({ name: 'QuestionsManage' })
      this.$router.go(-1)
    }
  }

}
</script>

<style lang="scss" scoped>
.tool-button {
  height: 50px;
  margin-top: -20px;
  padding: 20px 0;
}
.md-input {
  margin-left: -75px;
}

</style>
