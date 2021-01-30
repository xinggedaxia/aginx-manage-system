export default function(config) {
  let tableColumnsCode = ''
  let tableButtonsCode = ''

  // 渲染表格列
  const renderTableColumns = ({ stringName, label, needFilter }) => {
    if (needFilter) {
      tableColumnsCode += `
        <el-table-column v-slot="{row}" label="${label}" prop="${stringName}">
          {{ row.${stringName} | ${stringName}Filter }}
        </el-table-column>`
    } else {
      tableColumnsCode += `
        <el-table-column label="${label}" prop="${stringName}" />`
    }
  }

  // 遍历需要创建的表格列
  config.tableData.forEach((item, index) => {
    if (item.use) {
      renderTableColumns(item)
    }
  })
  // 遍历需要创建的表格操作按钮
  config.tableButtons.forEach((item, index) => {
    switch (item) {
      case 'edit':
        tableButtonsCode += `
        <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
        </el-button>`
        break
      case 'toggle':
        tableButtonsCode += `
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
            </el-button>`
        break
      case 'custom_t':
        tableButtonsCode += `
        <el-button type="primary" size="mini" @click="handleTableCustom(row)">
            自定义
        </el-button>`
        break
      case 'custom':
        tableButtonsCode += `
        <el-button type="primary" size="mini" @click="handleCustom(row)">
            自定义
        </el-button>`
        break
      case 'delete':
        tableButtonsCode += `
            <el-popconfirm
              title="确认删除吗？"
              @confirm="handleDelete(row)"
              style="${config.tableButtons.indexOf('delete') === 0 ? '' : 'margin-left:10px;'}${config.tableButtons.lastIndexOf('delete') === config.tableButtons.length - 1 ? '' : 'margin-right:10px;'}"
            >
              <el-button slot="reference" size="mini" type="danger">
                删除
              </el-button>
            </el-popconfirm>`
        break
      default :
        tableButtonsCode += `
        <el-button type="primary" size="mini" @click="handleCustom(row)">
            未捕获
        </el-button>`
    }
  })

  return `
   <!--表格-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        ${tableColumnsCode.trim()}
        ${config.tableButtons.length > 0 ? `
        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="${20 + config.tableButtons.length * 70}" class-name="small-padding fixed-width">
          <template v-slot="{row}">
           ${tableButtonsCode.trim()}
          </template>
        </el-table-column>` : ''}

      </el-table>
      <!--分页-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />`
}
