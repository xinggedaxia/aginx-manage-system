<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :inline="true" :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="都发给对方:">
                <el-input v-model="listQuery.id" placeholder="请输入都发给对方" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="返回飞过后:">
                <el-select v-model="listQuery.name" placeholder="请选择返回飞过后">
                  <el-option label="全部" value="" />
                  <el-option v-for="{label,value} in nameList" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="都发给对方:">
                  <el-date-picker
                    v-model="listQuery.age"
                    type="date"
                    placeholder="选择日期"
                  />
                </el-form-item>
              </el-col>
            </template>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button type="primary" size="small" @click="getList">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
                <el-button type="primary" size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleDownload">导出</el-button>
                <el-button type="primary" size="small" @click="handleCustom">自定义</el-button>
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
        <el-table-column v-slot="{row}" label="都发给对方" prop="id">
          {{ row.id | idFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="返回飞过后" prop="name">
          {{ row.name | nameFilter }}
        </el-table-column>
        <el-table-column label="都发给对方" prop="age" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
          <template v-slot="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确认删除吗？"
              style="margin-left:10px;margin-right:10px;"
              @confirm="handleDelete(row,$index)"
            >
              <el-button slot="reference" size="mini" type="danger">
                删除
              </el-button>
            </el-popconfirm>
            <el-button
              v-if="true"
              size="mini"
              type="warning"
              @click="handleToggle(row, false)"
            >
              开启
            </el-button>
            <el-button v-if="false" size="mini" type="success" @click="handleToggle(row, true)">
              关闭
            </el-button>
            <el-button type="primary" size="mini" @click="handleTableCustom(row)">
              自定义
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <pagination
        v-show="list.length>0"
        :total="list.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>

// import { fetchList, createAccount, updateAccount } from '@/api/demo-page.js' fixme:替换为你的接口地址
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'DemoPage',
  components: { Pagination },
  filters: {
    idFilter: function(id) {
      return id
    },
    nameFilter: function(name) {
      return name
    }
  },
  data() {
    return {
      list: [{ id: '',
        name: 0,
        age: true }], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        page: 1,
        limit: 10,
        id: '',
        name: '',
        age: ''
      }, // 查询条件
      listQueryTemp: {
        page: 1,
        limit: 10,
        id: '',
        name: '',
        age: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      nameList: [
        {
          label: '条件1',
          value: '1'
        },
        {
          label: '条件2',
          value: '0'
        }
      ],
      createFormData: {
        id: '',
        name: 0,
        age: true
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        id: '',
        name: 0,
        age: true
      }, // 用于重置新增的数据
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
    handleCreate() {
      this.resetCreateFormData()
      this.dialogStatus = '新增'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetCreateFormData() {
      this.createFormData = { ...this.createFormDataTemp }
    },
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
          })
        }
      })
    },

    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.$nextTick(() => {
        this.getList()
      })
    },
    handleDownload() {
      /* this.downloadLoading = true
    import('@/vendor/Export2Excel').then(excel => {
      const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      const data = this.formatJson(filterVal)
      excel.export_json_to_excel({
        header: tHeader,
        data,
        filename: 'table-list'
      })
      this.downloadLoading = false
    })*/
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleCustom() {

    },
    // 点击编辑
    handleUpdate(row) {
      this.createFormData = { ...row } // copy obj
      this.dialogStatus = '编辑'
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
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteApi(row.id).then(() => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleToggle(row, index) {
      toggleApi(row.id).then(() => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleTableCustom() {

    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

</style>
