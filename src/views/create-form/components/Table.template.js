export default function() {
  const tableColumnsCode = ''
  const tableButtonsCode = ''

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
      />`
}
