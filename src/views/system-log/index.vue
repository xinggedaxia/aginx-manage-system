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
            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="身份:">
                  <el-select v-model="listQuery.role" placeholder="请选择身份">
                    <el-option label="全部" value="" />
                    <el-option
                      v-for="{label,value} in optionGroup.roleList"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="操作模块:">
                  <el-select v-model="listQuery.type" placeholder="请选择操作模块">
                    <el-option label="全部" value="" />
                    <el-option
                      v-for="{label,value} in optionGroup.operaTypeList"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
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
        :row-style="{height:'53px'}"
      >
        <el-table-column v-slot="{row}" label="用户名" prop="user" width="250">
          <img
            :src="row.avatarUrl"
            style="position:absolute;right:20px;top:50%;margin-top:-18px;width: 36px;height: 36px;border-radius: 50%"
          >
          <span>{{ row.user }}</span>
        </el-table-column>
        <el-table-column label="操作描述" prop="operation" width="400" />
        <el-table-column v-slot="{row}" label="操作类型" prop="operaType">
          {{ row.operaType | operaTypeFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="操作模块" prop="type">
          {{ row.type | typeFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="操作日期" prop="createdAt" width="180">
          {{ row.createdAt | createdAtFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="身份" prop="role">
          {{ row.role | roleFilter }}
        </el-table-column>
        <el-table-column label="ip" prop="ip" />
        <el-table-column label="位置" prop="location" width="200" />

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
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // 分页

const options = JSON.parse(sessionStorage.getItem('options'))

export default {
  name: 'SystemLog',
  components: { Pagination },
  filters: {
    typeFilter: function(role) {
      return options.type.map[role]
    },
    roleFilter: function(role) {
      return options.role.map[role]
    },
    operaTypeFilter: function(operaType) {
      return options.operaType.map[operaType]
    },
    createdAtFilter: function(createdAt) {
      return parseTime(new Date(createdAt))
    }
  },
  data() {
    return {
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
        operaTypeList: options.type.list,
        roleList: options.role.list
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
        if (newValues) {
          this.listQuery.startAt = newValues[0]
          this.listQuery.endAt = newValues[1]
        } else {
          this.listQuery.startAt = ''
          this.listQuery.endAt = ''
        }
      }
    }
  },
  created() {
    this.getList()
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
.el-table{
  ::v-deep.cell{
    white-space: nowrap;
  }
}
</style>
