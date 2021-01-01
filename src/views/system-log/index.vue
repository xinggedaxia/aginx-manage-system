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
                <el-input v-model="listQuery.name" placeholder="请输入用户名" @keyup.enter.native="handleSearch" />
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
            <el-col :md="8" :sm="24">
              <el-form-item label="操作模块:">
                <el-select v-model="listQuery.type" placeholder="请选择操作模块">
                  <el-option label="全部" value="" />
                  <el-option v-for="{label,value} in optionGroup.roleList" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="操作模块:">
                <el-select v-model="listQuery.operationType" placeholder="请选择操作类型">
                  <el-option label="全部" value="" />
                  <el-option v-for="{label,value} in optionGroup.roleList" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="日期区间:">
                <el-date-picker
                  v-model="operationTimeRange"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                />
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
        <el-table-column label="用户名" prop="name" />
        <el-table-column label="操作描述" prop="operation" />
        <el-table-column label="操作类型" prop="operationType" />
        <el-table-column label="操作模块" prop="type" />
        <el-table-column label="操作日期" prop="createAt" />
        <el-table-column v-slot="{row}" label="身份" prop="role">
          {{ row.role | roleFilter }}
        </el-table-column>
        <el-table-column label="ip" prop="ip" />
        <el-table-column label="位置" prop="location" />

      </el-table>
      <!--分页-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>

import { fetchList } from '@/api/system-log.js'
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

      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        type: '', // 搜索时传递  1：账号管理  2：登录登出 3：标识管理 。。。
        operationType: '',
        username: '',
        role: '', // 0：超级管理员 1：管理员 2：游客
        startAt: '',
        endAt: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        type: '', // 搜索时传递  1：账号管理  2：登录登出 3：标识管理 。。。
        username: '',
        role: '', // 0：超级管理员 1：管理员 2：游客
        startAt: '',
        endAt: ''
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
      }, // 存放选项的数据,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    operationTimeRange: {
      get: function() {
        return [this.listQuery.startAt, this.listQuery.endAt]
      },
      set: function(newValues) {
        this.listQuery.startAt = newValues[0]
        this.listQuery.endAt = newValues[1]
      }
    }
  },
  created() {
    this.listLoading = false
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
