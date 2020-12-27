export default function(config) {
  let needAdvance = false

  let searchFormItemsCode = ``

  let searchFormItemsCodeAdvance = ``

  let searchButtonsCode = ''

  // 渲染col
  const renderCol = function(stringName, label, type) {
    return `
            <el-col :md="8" :sm="24">
              <el-form-item label="${label}:">
                ${renderFormItem(stringName, label, type)}
              </el-form-item>
            </el-col>`
  }

  // 渲染表单元素
  const renderFormItem = function(stringName, label, type) {
    switch (type) {
      case 'input':
        return `<el-input v-model="listQuery.${stringName}" placeholder="请输入${label}" @keyup.enter.native="getList" />`
      case 'textarea':
        return `<el-input v-model="listQuery.${stringName}" placeholder="请输入${label}" @keyup.enter.native="getList" />`
      case 'datePicker':
        return `<el-date-picker
                   v-model="listQuery.${stringName}"
                    type="date"
                    placeholder="选择日期"/>`
      case 'select':
        return `<el-select v-model="listQuery.${stringName}" placeholder="请选择${label}">
                  <el-option label="全部" value="" />
                  <el-option v-for="{label,value} in ${stringName}List" :key="value" :label="label" :value="value" />
                </el-select>`
      default:
        return `未被匹配，请到SearchBar.template.js配置`
    }
  }

  // 过滤需要显示的数据
  const searchArray = config.tableData.filter((item, index) => {
    return item.use && item.forSearch
  })

  needAdvance = searchArray.length > 2

  // 查询表单项代码拼接
  searchArray.forEach(({ stringName, label, formType }, index) => {
    if (index < 2) {
      searchFormItemsCode += renderCol(stringName, label, formType)
    } else {
      searchFormItemsCodeAdvance += renderCol(stringName, label, formType)
    }
  })

  // 遍历并生成按钮
  for (const formButton of config.formButtons) {
    switch (formButton) {
      case 'search':
        searchButtonsCode += `
        <el-button type="primary" size="small" @click="getList">查询</el-button>`
        break
      case 'add':
        searchButtonsCode += `
        <el-button type="primary" size="small" @click="handleCreate">新增</el-button>`
        break
      case 'reset':
        searchButtonsCode += `
        <el-button type="primary" size="small" @click="resetQuery">重置</el-button>`
        break
      case 'export':
        searchButtonsCode += `
        <el-button type="primary" size="small" @click="handleDownload">导出</el-button>`
        break
      case 'custom':
        searchButtonsCode += `
        <el-button type="primary" size="small" @click="handleCustom">自定义</el-button>`
        break
      default:
        searchButtonsCode += `
        <el-button type="primary" size="small">未捕获</el-button>`
    }
  }

  return `
    <!--搜索栏-->
        <div class="table-page-search-wrapper">
        <el-form :inline="true" :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

          <!--基本搜索条件-->
           ${searchFormItemsCode.trim()}
           ${needAdvance
    ? `
    <!--高级搜索条件-->
    <template v-if="advanced">
      ${searchFormItemsCodeAdvance.trim()}
    </template>` : ''

}

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                ${searchButtonsCode.trim()}
                ${needAdvance
    ? `<el-button type="text" @click="advanced=!advanced">
  {{ advanced ? '收起' : '展开' }}
  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
  </el-button>` : ''
}
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
`
}
