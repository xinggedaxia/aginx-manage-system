export default function(config) {
  let formItemsCode = ``

  // 大写转驼峰
  const hyphenateRE = /\B([A-Z])/g
  const hyphenate = function(str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  }

  // 渲染col
  const renderCol = function({ stringName, label, formType, disabled }) {
    if (config.cols === 1) {
      return `
              <el-form-item label="${label}:" prop="${stringName}">
                ${renderFormItem(stringName, label, formType, disabled)}
              </el-form-item>`
    }
    return `
            <el-col :span="${24 / config.cols}">
              <el-form-item label="${label}:" prop="${stringName}">
                ${renderFormItem(stringName, label, formType, disabled)}
              </el-form-item>
            </el-col>`
  }

  // 渲染表单元素
  const renderFormItem = function(stringName, label, type, disabled) {
    switch (type) {
      case 'input':
        return `<el-input v-model="createFormData.${stringName}" placeholder="请输入${label}" ${disabled ? `:disabled="dialogStatus==='update'"` : ''} />`
      case 'number':
        return `<el-input-number v-model="createFormData.${stringName}" placeholder="请输入${label}" ${disabled ? `:disabled="dialogStatus==='update'"` : ''} />`
      case 'textarea':
        return `<el-input type="textarea" v-model="createFormData.${stringName}" placeholder="请输入${label}" rows="2" ${disabled ? `:disabled="dialogStatus==='update'"` : ''}/>`
      case 'datePicker':
        return `<el-date-picker
                   v-model="createFormData.${stringName}"
                    type="date"
                    placeholder="选择日期"
                    ${disabled ? `:disabled="dialogStatus==='update'"` : ''}
                    />`
      case 'select':
        return `<el-select v-model="createFormData.${stringName}" placeholder="请选择${label}" ${disabled ? `:disabled="dialogStatus==='update'"` : ''} >
                  <el-option v-for="{label,value} in optionGroup.${stringName}List" :key="value" :label="label" :value="value" />
                </el-select>`
      default:
        return `未被匹配，请到SearchBar.template.js配置`
    }
  }

  config.tableData.forEach((item, index) => {
    if (item.use) {
      formItemsCode += renderCol(item)
    }
  })

  return `
        <!--编辑新增共用弹窗-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="base-dialog ${hyphenate(config.pageName)}-dialog">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          ${config.cols > 1
    ? `<el-row :gutter="25">
                ${formItemsCode.trim()}
            </el-row>`
    : formItemsCode.trim()
}

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>
      </el-dialog>`
}
