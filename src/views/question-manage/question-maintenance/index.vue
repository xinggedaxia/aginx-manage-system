<template>
  <div class="layout-content question-manage">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="标题:">
                <el-input v-model="listQuery.title" placeholder="请输入标题" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="类型:">
                <el-select v-model="listQuery.type" placeholder="请选择类型">
                  <el-option label="全部" value="" />
                  <el-option v-for="{label,value} in optionGroup.typeList" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="难度:">
                  <el-select v-model="listQuery.level" placeholder="请选择难度">
                    <el-option label="全部" value="" />
                    <el-option
                      v-for="{label,value} in optionGroup.levelList"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="创建人:">
                  <el-input v-model="listQuery.createBy" placeholder="请输入创建人" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
              <!--              <el-col :md="8" :sm="24">-->
              <!--                <el-form-item label="更新人:">-->
              <!--                  <el-input v-model="listQuery.updateBy" placeholder="请输入更新人" @keyup.enter.native="handleSearch" />-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
            </template>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
                <el-button type="text" @click="advanced=!advanced">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!--表格-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column v-slot="{row}" label="标题" prop="title" width="500">
          <template>
            <el-tooltip class="item" effect="dark" :content="row.title" placement="top-start">
              <span>{{ row.title }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-slot="{row}" label="类型" prop="type">
          {{ row.type | typeFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="难度" prop="level">
          {{ row.level | levelFilter }}
        </el-table-column>
        <el-table-column label="创建人" prop="createBy" />
        <el-table-column v-slot="{row}" label="创建日期" prop="createdAt" width="160">
          {{ row.createdAt | createdAtFilter }}
        </el-table-column>
        <el-table-column label="更新人" prop="updateBy" />
        <el-table-column v-slot="{row}" label="更新日期" prop="updatedAt" width="160">
          {{ row.updatedAt | updatedAtFilter }}

        </el-table-column>

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
          <template v-slot="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button type="primary" size="mini" @click="handlePreview(row)">
              预览
            </el-button>
            <el-popconfirm
              title="确认删除吗？"
              style="margin-left:10px;"
              @confirm="handleDelete(row,$index)"
            >
              <el-button slot="reference" size="mini" type="danger">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <!--预览弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        custom-class="base-dialog question-manage-dialog"
      >
        <h2 class="title">{{ title }}</h2>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="dialogFormVisible = false">
            关闭
          </el-button>
        </div>
        <markdown-editor view-modal :answer="answer" height="600px" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

import { getQuestion, deleteQuestion, getAllQuestion } from '@/api/question-manage'
import Pagination from '@/components/Pagination' // 分页
import MarkdownEditor from '@/components/MarkdownEditor'
import { parseTime } from '@/utils'

const options = JSON.parse(sessionStorage.getItem('options'))

export default {
  name: 'QuestionManage',
  components: { Pagination, MarkdownEditor },
  filters: {
    typeFilter: function(type) {
      return type
    },
    levelFilter: function(level) {
      return options.questionLevel.map[level]
    },
    createdAtFilter: function(createdAt) {
      return parseTime(new Date(createdAt))
    },
    updatedAtFilter: function(updatedAt) {
      return parseTime(new Date(updatedAt))
    }
  },
  data() {
    return {
      title: '', // 弹窗标题
      answer: '', // 弹窗显示内容
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        type: '',
        level: '',
        createBy: '',
        updateBy: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        type: '',
        level: '',
        createBy: '',
        updateBy: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        typeList: [],
        levelList: options.questionLevel.list
      }, // 存放选项的数据
      createFormData: {
        title: '',
        type: 0,
        level: 0,
        answer: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        title: '',
        type: 0,
        level: 0,
        answer: ''
      }, // 用于重置新增的数据
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        level: [{ required: true, message: '请选择难度', trigger: 'change' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
      }, // 新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    this.getList()
    this.initQuestionType()
  },

  methods: {
    // 初始化题型
    initQuestionType() {
      getAllQuestion().then(res => {
        this.optionGroup.typeList = res.data
      })
    },
    // 题目预览
    handlePreview(row) {
      this.dialogFormVisible = true
      this.title = row.title
      this.answer = row.answer
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      getQuestion(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    // 点击新增按钮
    handleCreate() {
      this.$router.push({
        name: 'AddQuestion'
      })
      // this.resetCreateFormData()
      // this.dialogStatus = 'create'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    // 重置新增表单数据
    resetCreateFormData() {
      this.createFormData = { ...this.createFormDataTemp }
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createApi(this.createFormData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            console.log(e)
          })
        }
      })
    },

    // 点击编辑
    handleUpdate(row) {
      const createFormData = { ...row }
      this.$router.push({
        name: 'EditQuestion',
        params: {
          createFormData: JSON.stringify(createFormData)
        }
      })
    },
    // 保存编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = { ...this.createFormData }
          updateApi(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            console.log(e)
          })
        }
      })
    },
    // 删除数据
    handleDelete(row, index) {
      deleteQuestion({ id: row.id }).then(() => {
        this.dialogFormVisible = false
        if (this.list.length === 1 && this.listQuery.pageNumber !== 1) {
          this.listQuery.pageNumber--
        }
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

.el-table{
  ::v-deep.cell{
    white-space: nowrap;
  }
}

.question-manage ::v-deep.question-manage-dialog {

  width: 1100px;

  .el-dialog__body {
    padding: 30px 40px;

    .title {
      margin-top: -40px;
      margin-bottom: 40px;
    }
  }
  .tui-editor-contents {
    span,li{
      font-size: 15px;
    }
  }
}
</style>
