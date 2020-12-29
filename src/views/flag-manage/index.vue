<template>
  <div class="layout-content flag-manage">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="标识类别:">
                <el-input v-model="listQuery.flagType" placeholder="请输入标识类别" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="标识值:">
                <el-input v-model.number="listQuery.value" placeholder="请输入标识值" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="标识含义:">
                  <el-input v-model="listQuery.label" placeholder="请输入标识含义" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
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
        <el-table-column label="标识类别" prop="flagType" />
        <el-table-column label="标识字段" prop="flagChar" />
        <el-table-column label="标识值" prop="value" />
        <el-table-column label="标识含义" prop="label" />
        <el-table-column label="备注" prop="note" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template v-slot="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
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

      <!--编辑新增共用弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        custom-class="base-dialog flag-manage-dialog"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          <el-form-item label="标识类别:" prop="flagType">
            <el-input v-model="createFormData.flagType" placeholder="请输入标识类别" />
          </el-form-item>
          <el-form-item label="标识字段:" prop="flagChar">
            <el-input v-model="createFormData.flagChar" placeholder="请输入标识字段" />
          </el-form-item>
          <el-form-item label="标识值:" prop="value">
            <el-input v-model.number="createFormData.value" placeholder="请输入标识值" />
          </el-form-item>
          <el-form-item label="标识含义:" prop="label">
            <el-input v-model="createFormData.label" placeholder="请输入标识含义" />
          </el-form-item>
          <el-form-item label="备注:" prop="note">
            <el-input v-model="createFormData.note" placeholder="请输入备注" />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

// import { fetchList, createAccount, updateAccount } from '@/api/flag-manage.js' fixme:替换为你的接口地址
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'FlagManage',
  components: { Pagination },
  filters: {},
  data() {
    return {
      list: [
        {
          flagType: '账号角色',
          flagChar: 'role',
          value: 0,
          label: '超级管理员',
          note: '系统的完全控制权'
        },
        {
          flagType: '账号角色',
          flagChar: 'role',
          value: 1,
          label: '管理员',
          note: '系统的部分管理和查看权限'
        },
        {
          flagType: '账号角色',
          flagChar: 'role',
          value: 2,
          label: '游客',
          note: '系统的查看权限'
        },
        {
          flagType: '账号状态',
          flagChar: 'accountStatus',
          value: 0,
          label: '启用',
          note: '账号可以正常使用'
        },
        {
          flagType: '账号状态',
          flagChar: 'accountStatus',
          value: 1,
          label: '停用',
          note: '账号无法登陆'
        }
      ], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        flagType: '',
        value: '',
        label: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        flagType: '',
        value: '',
        label: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {}, // 存放选项的数据
      createFormData: {
        flagType: '',
        flagChar: '',
        value: '',
        label: '',
        note: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        flagType: '',
        flagChar: '',
        value: '',
        label: '',
        note: ''
      }, // 用于重置新增的数据
      rules: {
        flagType: [{ required: true, message: '请输入标识类别', trigger: 'blur' }],
        flagChar: [{ required: true, message: '请输入标识字段', trigger: 'blur' }],
        value: [{ required: true, message: '请输入标识值', trigger: 'blur' }],
        label: [{ required: true, message: '请输入标识含义', trigger: 'blur' }]
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
    this.listLoading = false// fixme:对好接口后移除这行代码
    // this.getList()
  },

  methods: {
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total
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
      deleteApi(row.id).then(() => {
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
.flag-manage ::v-deep.flag-manage-dialog {
  max-width: 600px;

  .el-dialog__body {
    padding: 30px 40px;
  }
}
</style>
