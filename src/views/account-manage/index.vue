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
                <el-input v-model="listQuery.name" placeholder="用户名" @keyup.enter.native="handleSearch" />
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

        <!--表格列-->
        <el-table-column v-slot="{row}" label="用户名" prop="adminName" width="250">
          <img
            :src="row.avatarUrl"
            style="position:absolute;right:20px;top:6px;width: 40px;height: 40px;border-radius: 50%"
          >
          <span>{{ row.adminName }}</span>
        </el-table-column>
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
        custom-class="count-manage-dialog base-dialog"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="70px"
        >
          <el-form-item label="用户名:" prop="adminName">
            <el-input v-model="temp.adminName" placeholder="输入用户名" :disabled="dialogStatus==='update'" />
          </el-form-item>
          <el-form-item label="权限:" prop="role">
            <el-select v-model="temp.role" placeholder="placeholder">
              <el-option
                v-for="item in [{label:'超级管理员',value:0},{label:'管理员',value:1},{label:'游客',value:2}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="adminStatus">
            <el-select v-model="temp.adminStatus" placeholder="placeholder" :disabled="dialogStatus==='update'">
              <el-option
                v-for="item in [{label:'启用',value:1},{label:'停用',value:2}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="qq:" prop="timestamp">
            <el-input
              v-model="temp.adminQq"
              placeholder="输入qq"
            />
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
import { fetchList, createApi, updateAccount, deleteApi } from '@/api/account'
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
        0: '超级管理员',
        1: '管理员',
        2: '游客'
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
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        status: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        status: ''
      }, // 用于重置查询条件
      advanced: false, // 是否展开高级搜索条件
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        'adminId': '',
        'adminName': '',
        'adminQq': '',
        'role': 2,
        'adminStatus': 1
      }, // 存储新增和编辑框的数据
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        adminName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      }// 表单校验规则
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleModifyStatus(params, type) {
      this.listLoading = true
      let status = 1
      if (type === 'published') {
        status = 2
      }
      updateAccount({
        adminId: params.adminId,
        status
      }).then((res) => {
        this.listLoading = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '用户状态更新成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        this.listLoading = false
        console.log(e)
      })
    },
    handleSearch() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        'adminName': '',
        'adminQq': '',
        'role': 2,
        'adminStatus': 1
      }
    },
    // 重置查询
    handleReset() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    // 点击新增
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createApi({
            name: this.temp.adminName,
            qq: this.temp.adminQq,
            role: this.temp.role,
            status: this.temp.adminStatus
          }).then(() => {
            this.buttonLoading = false
            this.dialogFormVisible = false
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
          this.buttonLoading = true
          const tempData = { ...this.temp }
          const updateData = {
            adminId: tempData.adminId,
            role: tempData.role,
            status: tempData.adminStatus,
            qq: tempData.adminQq
          }
          updateAccount(updateData).then((res) => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新数据成功',
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
    handleDelete(row) {
      this.listLoading = true
      deleteApi({ adminId: row.adminId }).then(() => {
        this.listLoading = false
        this.dialogFormVisible = false
        if (this.list.length === 1 && this.listQuery.pageNum !== 1) {
          this.listQuery.pageNum--
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

.account-manage-page ::v-deep.count-manage-dialog {
  max-width: 600px;

  .el-dialog__body {
    padding: 30px 40px;
  }
}
</style>
