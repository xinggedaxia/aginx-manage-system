export default function(config) {
  let variable = ''
  let searchVariables = ''
  let optionLists = ''

  config.tableData.forEach((item, index) => {
    if (item.use) {
      // 拼接变量
      switch (item.variableType) {
        case 'string':
          variable += `
          ${item.stringName}: '',`
          break
        case 'number':
          variable += `
          ${item.stringName}: 0,`
          break
        case 'bool':
          variable += `
          ${item.stringName}: true,`
          break
        default: {
          variable += `
          ${item.stringName}: '',`
        }
      }

      // 创建搜索参数
      if (item.forSearch) {
        searchVariables += `
        ${item.stringName}: '',`

        if (item.formType === 'select') {
          optionLists += `
          ${item.stringName}List: [
        {
          label: '条件1',
          value: '1'
        },
        {
          label: '条件2',
          value: '0'
        }
      ],`
        }
      }
    }
  })

  return `data() {
    return {
      list: [{${variable.trim()}}], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
          pageNumber: 1,
          pageSize: 10,
          ${searchVariables.trim()}
      }, // 查询条件
      listQueryTemp: {
          pageNumber: 1,
          pageSize: 10,
          ${searchVariables.trim()}
      }, // 用于重置查询条件
      total: 0,//总数据条数
      advanced: false, // 是否展开高级搜索条件
      ${optionLists.trim()}
      createFormData: {
        ${variable.trim()}
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        ${variable.trim()}
      }, // 用于重置新增的数据
      rules:{}, //新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: '',
    }
  },`
}
