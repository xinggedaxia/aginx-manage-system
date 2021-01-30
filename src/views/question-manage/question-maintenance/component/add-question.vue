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
                  :max="3"
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                  :low-threshold="1"
                  :high-threshold="2"
                  style="display:inline-block"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="24">
              <markdown-editor :answer.sync="createForm.answer" height="600px" />
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
import { MessageBox } from 'element-ui'
import store from '@/store'

export default {
  name: 'AddQuestion',
  components: { Sticky, MarkdownEditor },
  data() {
    return {
      notSave: false, // 未保存标识
      createForm: {
        title: '',
        type: 'html',
        level: 1,
        answer: '## 答案\n\n在此输入答案\n\n``` javascript\nconst a = 1;\nlet b = 1 + 1;\n```\n\n## 解析\n\n在此输入解析'
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
  watch: {
    createForm: {
      deep: true,
      immediate: false,
      handler: function() {
        this.notSave = true
      }
    }
  },
  mounted() {
    this.notSave = false
  },
  methods: {
    handleSave() {
      alert(this.createForm.answer)
      this.notSave = false
    },
    handleQuit() {
      this.$router.push({ name: 'QuestionMaintenance' })
      // this.$router.go(-1)
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
