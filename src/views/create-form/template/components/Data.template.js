export default function(config) {
  let variable = ''
  let searchVariables = ''
  let optionGroupLists = ''
  let rules = ''

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
      }

      // 创建数据项
      if (item.formType === 'select') {
        optionGroupLists += `
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

      // 创建表单校验规则
      if (item.required) {
        const triggerMap = {
          'input': 'blur',
          'textarea': 'blur',
          'select': 'change',
          'datePicker': 'change',
          'number': 'change'
        }
        const textMap = {
          'input': '输入',
          'textarea': '输入',
          'select': '选择',
          'datePicker': '选择',
          'number': '输入'
        }
        rules += `
        ${item.stringName}: [{ required: true, message: '请${textMap[item.formType] + item.label}', trigger: '${triggerMap[item.formType]}' }],`
      }
    }
  })

  return `data() {
    return {
      list: [{${variable.trim()}}], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
          pageNum: 1,
          pageSize: 10,
          ${searchVariables.trim()}
      }, // 查询条件
      listQueryTemp: {
          pageNum: 1,
          pageSize: 10,
          ${searchVariables.trim()}
      }, // 用于重置查询条件
      total: 0,//总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup:{
        ${optionGroupLists.trim()}
      }, // 存放选项的数据
      createFormData: {
        ${variable.trim()}
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        ${variable.trim()}
      }, // 用于重置新增的数据
      rules:{
        ${rules.trim()}
      }, //新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: '',
    }
  },`
}
