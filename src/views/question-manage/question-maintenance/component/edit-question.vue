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
        <el-form ref="dataForm" label-width="90px" :rules="rules" :model="createForm">
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
                  :max="3"
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                  :low-threshold="1"
                  :high-threshold="2"
                  style="display:inline-block"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="24">
              <markdown-editor
                ref="markdown"
                :answer.sync="createForm.answer"
                :html.sync="createForm.html"
                height="600px"
                @editorChange="editorChange"
              />
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
import { addQuestion, getAllQuestion, updateQuestion } from '@/api/question-manage'
import { MessageBox } from 'element-ui'

export default {
  name: 'EditQuestion',
  components: { Sticky, MarkdownEditor },
  data() {
    return {
      notSave: false, // 未保存标识
      createForm: {
        title: '',
        type: '',
        level: 1,
        answer: ''
      },
      firstChange: true,
      firstWatchChange: true,
      questionTypeList: [],
      rules: {
        title: [{ required: true, message: '请输入题目标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择题目类型', trigger: 'change' }],
        level: [{ required: true, message: '请选择题目难度', trigger: 'change' }]
      },
    }
  },
  watch: {
    createForm: {
      deep: true,
      immediate: false,
      handler: function() {
        // 忽略传参触发的事件
        if (this.firstWatchChange) {
          this.firstWatchChange = false
        } else {
          this.notSave = true
        }
      }
    }
  },
  created() {
    this.createForm = JSON.parse(this.$route.params.createFormData) || {}
    getAllQuestion().then(res => {
      this.questionTypeList = res.data
    })
  },
  methods: {
    handleSave() {
      this.createForm.answer = this.$refs.markdown.editorValue
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateQuestion(this.createForm).then((res) => {
            this.$notify({
              title: '成功',
              message: '题目更新成功',
              type: 'success',
              duration: 2000
            })
            this.notSave = false
          }).catch((e) => {
            console.log(e)
            this.notSave = false
          })
        }
      })
    },
    editorChange() {
      if (this.createForm.answer !== this.$refs.markdown.editorValue) {
        // 忽略编辑器格式化数据触发的事件
        if (this.firstChange) {
          this.firstChange = false
        } else {
          this.notSave = true
        }
      }
    },
    handleQuit() {
      this.$router.push({ name: 'QuestionMaintenance' })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.notSave) {
      MessageBox.confirm('你还没保存！', '确认离开?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      })
    } else {
      next()
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
