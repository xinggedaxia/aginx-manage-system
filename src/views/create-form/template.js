// 暂时关闭eslint,开发完毕开启

const pageName = 'createForm'
const searchFormItemsCode = ''
const searchButtonsCode = ''
let tableColumnsCode = ''
const tableButtonsCode = ''
const addFormItmesCode = ''
let filterCode = ''
const methedsCode = ''

const renderTableColumns = ({ stringName, label, needFilter }) => {
  if (needFilter) {
    filterCode += `
    ${stringName}Filter: function(${stringName}) {
      return ${stringName}
    },`
    tableColumnsCode += `
        <el-table-column v-slot="{row}" label="${label}" prop="${stringName}">
          {{ row.${stringName} | ${stringName}Filter }}
        </el-table-column>`
  } else {
    tableColumnsCode += `
        <el-table-column label="${label}" prop="${stringName}" />`
  }
}

// const config = {
//   'tableData': [
//     {
//       'stringName': 'id',
//       'use': true,
//       'label': 'id',
//       'needFilter': false,
//       'forSearch': true,
//       'formType': 'input'
//     },
//     { 'stringName': 'name', 'use': true, 'label': 'name', 'forSearch': true, 'formType': 'input' },
//     {
//       'stringName': 'age',
//       'use': true,
//       'label': 'age',
//       'needFilter': true,
//       'forSearch': false,
//       'formType': ''
//     },
//     { 'stringName': 'sex', 'use': true, 'label': 'sex', 'needFilter': false, 'forSearch': true, 'formType': 'select' }
//   ],
//   'formButtons': ['search', 'add', 'reset'],
//   'tableButtons': ['edit', 'delete']
// }

const templateCode = function() {
  return `
<template>
  <div class="layout-content ${pageName}-page">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :inline="true" :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

           ${searchFormItemsCode}

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                ${searchButtonsCode}
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
        ${tableColumnsCode}

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template v-slot="{row,$index}">
           ${tableButtonsCode}
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
          ${addFormItmesCode}
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
import { fetchList, createAccount, updateAccount } from '@/api/${pageName}'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: '${pageName}',
  components: { Pagination },
  filters: {
    ${filterCode}
  },
  data() {
    return {
      list: [], // 表格数据
      total: 0,
      listLoading: true, // 表格加载状态
      listQuery: {

      }, // 查询条件
      advanced: false, // 是否展开高级搜索条件
      temp: {

      }, // 存储新增和编辑框的数据
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: '',
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
        // fixme:后端没返回total，无法分页
        // this.total = response.data.total
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
${methedsCode}

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

.layout-content {
  .table-page-search-submitButtons {
    margin-top: -5px; /*与左侧输入框对齐*/
    margin-bottom: 20px;
  }
}
</style>

`
}
const startRender = (config) => {
  config.tableData.forEach((item, index) => {
    if (item.use) {
      renderTableColumns(item)
    }
  })
  const retult = templateCode()
  return retult
}

export default startRender

