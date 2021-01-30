<template>
  <div class="layout-content question-type">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="题目类型:">
                <el-input v-model="listQuery.type" placeholder="请输入题目类型" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>

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
        <el-table-column label="题目类型" prop="type" />
        <el-table-column v-slot="{row}" label="查看权限" prop="permission">
          {{ row.permission|permissionsFilter }}
        </el-table-column>
        <el-table-column label="排序" prop="order" />
        <el-table-column v-slot="{row}" label="状态" prop="status">
          <el-badge is-dot :type="row.status==='1'?'danger':'success'">{{ row.status|statusFilter }}</el-badge>
        </el-table-column>

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button
              v-if="row.status=='2'"
              size="mini"
              type="warning"
              @click="handleModifyStatus(row,'1')"
            >
              停用
            </el-button>
            <el-button v-else size="mini" type="success" @click="handleModifyStatus(row,'2')">
              启用
            </el-button>
            <el-button slot="reference" size="mini" type="danger" @click="handleDeleteConfirm(row)">
              删除
            </el-button>
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

      <!--编辑新增共用弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        custom-class="base-dialog dialog-col-1"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          <el-form-item label="题目类型:" prop="type">
            <el-input v-model="createFormData.type" placeholder="请输入题目类型" />
          </el-form-item>
          <el-form-item label="查看权限:" prop="permission">
            <el-select v-model="createFormData.permission" placeholder="请选择查看权限">
              <el-option
                v-for="{label,value} in optionGroup.permissionsList"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排序:" prop="order">
            <el-input v-model.number="createFormData.order" placeholder="请输入排序" />
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select v-model="createFormData.status" placeholder="请选择状态">
              <el-option
                v-for="{label,value} in optionGroup.statusList"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" :loading="buttonLoading" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
const options = JSON.parse(sessionStorage.getItem('options'))
import { getQuestionType, addQuestionType, updateQuestionType, deleteQuestionType } from '@/api/question-manage'
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'QuestionType',
  components: { Pagination },
  filters: {
    permissionsFilter: function(permissions) {
      return options.questionTypePermissions.map[permissions]
    },
    statusFilter: function(status) {
      return options.questionTypeStatus.map[status]
    }
  },
  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        type: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        type: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        permissionsList: options.questionTypePermissions.list,
        statusList: options.questionTypeStatus.list
      }, // 存放选项的数据
      createFormData: {
        type: '',
        permission: '1',
        order: 1,
        status: '1'
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        type: '',
        permission: '1',
        order: 1,
        status: '1'
      }, // 用于重置新增的数据
      rules: {
        type: [{ required: true, message: '请输入题目类型', trigger: 'blur' }],
        permission: [{ required: true, message: '请选择查看权限', trigger: 'change' }],
        order: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        status: [{ required: true, message: '请输入状态', trigger: 'blur' }]
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
  },

  methods: {
    handleDeleteConfirm({ id, type }) {
      this.$confirm('删除题型可能导致系统运行异常,确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(id, type)
      }).catch(() => {

      })
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      getQuestionType(this.listQuery).then(response => {
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
      this.resetCreateFormData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置新增表单数据
    resetCreateFormData() {
      this.createFormData = { ...this.createFormDataTemp }
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          addQuestionType(this.createFormData).then(() => {
            // this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },

    // 点击编辑
    handleUpdate(row) {
      this.createFormData = { ...row } // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const tempData = { ...this.createFormData }
          updateQuestionType(tempData).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },
    // 更新状态
    handleModifyStatus(row, status) {
      console.log(row)
      this.listLoading = true
      updateQuestionType({ ...row, status }).then(() => {
        this.listLoading = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '状态更新成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        this.listLoading = false
        console.log(e)
      })
    },
    // 删除数据
    handleDelete(id, type) {
      this.listLoading = true
      deleteQuestionType({ id, type }).then(() => {
        this.dialogFormVisible = false
        this.listLoading = false
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
        this.listLoading = false
        console.log(e)
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.question-type .el-badge {
  padding-left: 15px;
}

.question-type ::v-deep.el-badge__content {
  left: -7px;
  right: initial;
  top: 11px;
}
</style>
