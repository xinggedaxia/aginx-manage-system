<template>
  <div class="layout-content system-log">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="用户名:">
                <el-input v-model="listQuery.username" placeholder="请输入用户名" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="身份:">
                <el-select v-model="listQuery.role" placeholder="请选择身份">
                  <el-option label="全部" value="" />
                  <el-option v-for="{label,value} in optionGroup.roleList" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="resetQuery">重置</el-button>

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
        <el-table-column label="用户名" prop="username" />
        <el-table-column v-slot="{row}" label="身份" prop="role">
          {{ row.role | roleFilter }}
        </el-table-column>
        <el-table-column label="ip" prop="ip" />
        <el-table-column label="位置" prop="location" />
        <el-table-column label="操作描述" prop="operation" />
        <el-table-column label="操作日期" prop="operationTime" />

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
        custom-class="base-dialog system-log-dialog"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="createFormData.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="身份:" prop="role">
            <el-select v-model="createFormData.role" placeholder="请选择身份">
              <el-option v-for="{label,value} in optionGroup.roleList" :key="value" :label="label" :value="value" />
            </el-select>
          </el-form-item>
          <el-form-item label="ip:" prop="ip">
            <el-input v-model="createFormData.ip" placeholder="请输入ip" />
          </el-form-item>
          <el-form-item label="位置:" prop="location">
            <el-input v-model="createFormData.location" placeholder="请输入位置" />
          </el-form-item>
          <el-form-item label="操作描述:" prop="operation">
            <el-input v-model="createFormData.operation" placeholder="请输入操作描述" />
          </el-form-item>
          <el-form-item label="操作日期:" prop="operationTime">
            <el-input v-model="createFormData.operationTime" placeholder="请输入操作日期" />
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

// import { fetchList, createAccount, updateAccount } from '@/api/system-log.js' fixme:替换为你的接口地址
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'SystemLog',
  components: { Pagination },
  filters: {
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
      // id  type  user  role  ip  location operaType operation createdAt updatedAt

      list: [
        {
          username: 'xingge',
          role: 0,
          ip: '192.168.1.1',
          location: '四川成都',
          operation: '新增题目:什么是html?',
          operationTime: '2020-12:30 08:00:00'
        },
        {
          username: 'xingge',
          role: 0,
          ip: '192.168.1.1',
          location: '四川成都',
          operation: '删除角色:visitor',
          operationTime: '2020-12:30 08:00:00'
        }
      ], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        username: '',
        role: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        username: '',
        role: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        roleList: [
          {
            label: '条件1',
            value: '1'
          },
          {
            label: '条件2',
            value: '0'
          }
        ]
      }, // 存放选项的数据
      createFormData: {
        username: '',
        role: '',
        ip: '',
        location: '',
        operation: '',
        operationTime: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        username: '',
        role: '',
        ip: '',
        location: '',
        operation: '',
        operationTime: ''
      }, // 用于重置新增的数据
      rules: {}, // 新增和编辑框的规则
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
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.system-log ::v-deep.system-log-dialog {
  max-width: 600px;

  .el-dialog__body {
    padding: 30px 40px;
  }
}
</style>
