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
            <el-button type="primary" size="small" @click="handleSave">保存题目</el-button>
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
              <markdown-editor ref="markdown" v-model="createForm.answer" height="600px" />
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
  name: 'AddQuestion',
  components: { Sticky, MarkdownEditor },
  data() {
    return {
      createForm: {
        title: '',
        type: 'html',
        level: 1,
        html: '',
        answer: '## 答案\n' +
          '在此输入答案\n' +
          '\n' +
          '## 解析\n' +
          '在此输入解析\n' +
          '\n' +
          '## 参考资料\n' +
          '在此声明参考资料，避免侵权\n' +
          '[基于webpack打包多页应用,对前端工程化的思考](https://juejin.cn/post/6907040632045305863)'
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
  methods: {
    handleSave() {
      this.createForm.html = this.$refs.markdown.getHtml()
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

.el-col ::v-deep.te-md-splitter {
  width: 100%;
}
</style>
