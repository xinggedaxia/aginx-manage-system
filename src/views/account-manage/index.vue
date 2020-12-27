<template>
  <div class="layout-content account-manage-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :inline="false" :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件/最多放两个-->
            <el-col :md="8" :sm="24">
              <el-form-item label="用户名:">
                <el-input v-model="listQuery.name" placeholder="用户名" @keyup.enter.native="getList" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="账号状态:">
                <el-select v-model="listQuery.status" placeholder="账号状态">
                  <el-option label="全部" value="" />
                  <el-option v-for="{label,value} in statusList" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="handleReset">重置</el-button>
                <el-button type="primary" size="small" @click="getList">查询</el-button>
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

        <!--表格列-->
        <el-table-column label="用户名" prop="adminName" />
        <el-table-column v-slot="{row}" label="权限" prop="role">
          {{ row.role|roleFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="状态" prop="adminStatus">
          <el-badge is-dot :type="row.adminStatus===2?'danger':'success'">{{ row.adminStatus|statusFilter }}</el-badge>
        </el-table-column>
        <el-table-column label="用户qq" prop="adminQq" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template v-slot="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button
              v-if="row.adminStatus==1"
              size="mini"
              type="warning"
              @click="handleModifyStatus(row,'published')"
            >
              停用
            </el-button>
            <el-button v-if="row.adminStatus!=1" size="mini" type="success" @click="handleModifyStatus(row,'draft')">
              启用
            </el-button>
            <el-popconfirm
              title="确认删除吗？"
              style="margin-left: 10px"
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
        v-show="list.length>0"
        :total="list.length"
        :page.sync="listQuery.pageNumber"
        :limit.sync="listQuery.pageNumber"
        @pagination="getList"
      />

      <!--编辑新增共用弹窗-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="70px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="用户名" prop="name">
            <el-input v-model="temp.name" placeholder="placeholder" />
          </el-form-item>
          <el-form-item label="权限" prop="role">
            <el-select v-model="temp.role" placeholder="placeholder">
              <el-option
                v-for="item in [{label:'管理员',value:'admin'},{label:'游客',value:'visitor'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="temp.status" placeholder="placeholder">
              <el-option
                v-for="item in [{label:'启用',value:1},{label:'停用',value:2}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="timestamp">
            <el-input
              v-model="temp.desc"
              type="textarea"
              placeholder="placeholder"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            Confirm
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { fetchList, createAccount, updateAccount } from '@/api/account'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'AccountManage',
  components: { Pagination },
  filters: {
    statusFilter: function(status) {
      const statusMap = {
        1: '启用',
        2: '停用'
      }
      return statusMap[status]
    },
    roleFilter: function(role) {
      const roleMap = {
        0: '管理员',
        1: '游客'
      }
      return roleMap[role]
    }
  },
  data() {
    return {
      statusList: [
        {
          label: '启用',
          value: '1'
        },
        {
          label: '停用',
          value: '2'
        }
      ],
      list: [], // 表格数据
      total: 0,
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        status: ''
      }, // 查询条件
      listQueryTemp: {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        status: ''
      }, // 用于重置查询条件
      advanced: false, // 是否展开高级搜索条件
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        'adminName': '',
        'adminQq': '',
        'role': 0,
        'adminStatus': 0
      }, // 存储新增和编辑框的数据
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }// 表单校验规则
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    resetTemp() {
      this.temp = {
        'adminName': 'wuq1',
        'adminQq': '2543279278',
        'role': 0,
        'adminStatus': 1
      }
    },
    handleReset() {
      this.listQuery = { ...this.listQueryTemp }
      this.$nextTick(() => {
        this.getList()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createAccount(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 点击编辑
    handleUpdate(row) {
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
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
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateAccount(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    }

  }
}
</script>

<!--全局样式-->
<style>

</style>

<!--局部样式-->
<style lang="scss" scoped>

.account-manage-page .el-badge {
  padding-left: 15px;
}

.account-manage-page ::v-deep.el-badge__content {
  left: -7px;
  right: initial;
  top: 11px;
}
</style>
