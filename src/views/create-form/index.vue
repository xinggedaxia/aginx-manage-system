<template>
  <div class="layout-content create-form-page">
    <el-card class="box-card">
      <!--表单-->
      <el-form :inline="false" label-width="80px" size="small" label-position="top">
        <el-form-item label="初始数据:">
          <el-input v-model="initData" type="textarea" placeholder="placeholder" rows="5" @input="createTableData" />
        </el-form-item>
        <el-form-item label="页面名称:">
          <el-input v-model="pageName" placeholder="placeholder" />
        </el-form-item>
        <el-form-item label="字段配置:">
          <el-table
            :data="tableData"
            style="width: 100%"
            :border="true"
            class="config-table"
          >
            <el-table-column label="字段名称" prop="stringName" />
            <el-table-column v-slot="{row}" label="表格字段" prop="use">
              <el-checkbox v-model="row.use" @change="handleUseChange(row,$event)" />
            </el-table-column>
            <el-table-column v-slot="{row}" label="字段类型" prop="variableType">
              <el-select v-model="row.variableType" placeholder="字段类型">
                <el-option
                  v-for="item in variableTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-table-column>
            <el-table-column v-slot="{row}" label="显示名称" prop="label">
              <el-input v-model="row.label" placeholder="请输入" />
            </el-table-column>
            <el-table-column v-slot="{row}" label="启用过滤" prop="needFilter">
              <el-checkbox v-model="row.needFilter" />
            </el-table-column>

            <el-table-column v-slot="{row}" label="搜索条件" prop="forSearch">
              <el-checkbox v-model="row.forSearch" @change="handleForSearchChange(row,$event)" />
            </el-table-column>
            <el-table-column v-slot="{row}" label="表单类型" prop="formType">
              <el-select v-model="row.formType" placeholder="表单类型" @change="handleFormTypeChange(row,$event)">
                <el-option
                  v-for="item in formTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-table-column>
            <el-table-column v-slot="{row}" label="必填项" prop="required">
              <el-checkbox v-model="row.required" />
            </el-table-column>
            <el-table-column v-slot="{row}" label="禁止编辑" prop="disabled">
              <el-checkbox v-model="row.disabled" />
            </el-table-column>

          </el-table>
        </el-form-item>
        <el-form-item label="表单按钮:">
          <el-checkbox-group v-model="formButtons">
            <el-checkbox v-for="{label,value} in buttonTypeList" :key="value" :label="value">{{ label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="表格操作列:">
          <el-checkbox-group v-model="tableButtons">
            <el-checkbox v-for="{label,value} in tableButtonTypeList" :key="value" :label="value">{{
              label
            }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="表单按几列展示:">
          <el-input-number v-model="cols" style="width: 300px;" :min="1" :max="4" />
        </el-form-item>
        <br>
        <br>
        <br>
        <el-form-item>
          <el-button type="primary" @click="createCode">生成代码</el-button>
        </el-form-item>
        <br>
        <!--用于存放代码，让剪切功能生效-->
        <textarea
          id="inputDom"
          type="text"
          :value="renderCode"
          style="height: 1px;overflow:hidden;position:absolute;top:9999px"
        />
      </el-form>
      <h2>
        生成代码-然后把代码手动整到previewCode-这下面会呈现效果
      </h2>
      <Test />
    </el-card>
  </div>
</template>

<script>
import startRender from './template'
import Test from './template/previewCode'

export default {
  name: 'CreateForm',
  components: { Test },
  data() {
    return {
      showReview: false,
      initData: '{"id": "","name": "","age": "","sex": "" }',
      tableData: [],
      // 字段类型
      variableTypeList: [
        {
          label: '字符串',
          value: 'string'
        },
        {
          label: '数字',
          value: 'number'
        },
        {
          label: '布尔',
          value: 'bool'
        }
      ],
      // 表单类型
      formTypeList: [
        {
          label: '输入框',
          value: 'input'
        },
        {
          label: '下拉框',
          value: 'select'
        },
        {
          label: '普通日期',
          value: 'datePicker'
        },
        {
          label: '文本域',
          value: 'textarea'
        },
        {
          label: '数字',
          value: 'number'
        }
      ],
      // 表单按钮类型
      buttonTypeList: [
        {
          label: '重置',
          value: 'reset'
        },
        {
          label: '查询',
          value: 'search'
        },
        {
          label: '新增',
          value: 'add'
        },

        {
          label: '导出',
          value: 'export'
        },
        {
          label: '自定义',
          value: 'custom'
        }
      ],
      // 表格按钮类型
      tableButtonTypeList: [
        {
          label: '编辑',
          value: 'edit'
        },
        {
          label: '删除',
          value: 'delete'
        },
        {
          label: '切换',
          value: 'toggle'
        },
        {
          label: '自定义',
          value: 'custom_t'
        }
      ],
      pageName: 'DemoPage',
      formButtons: ['reset', 'search', 'add'],
      tableButtons: ['edit', 'delete'],
      cols: 1, // 表单几列显示
      renderCode: ''
    }
  },
  created() {
    this.createTableData()
  },
  methods: {
    createTableData() {
      let initData = null
      this.tableData = []

      // 检查格式
      try {
        initData = JSON.parse(this.initData)
      } catch (e) {
        this.$message({ type: 'error', message: '数据必须为标准JSON格式' })
      }

      const keys = Object.keys(initData)

      // 创建表格数据
      for (const stringName of keys) {
        this.tableData.push({
          stringName,
          use: true,
          variableType: 'string',
          label: stringName,
          needFilter: false,
          forSearch: false,
          formType: 'input',
          required: false,
          disabled: false
        })
      }
    },
    handleUseChange(row, flag) {
      if (!flag) {
        row.forSearch = false
      }
    },
    handleForSearchChange(row, flag) {
      if (flag) {
        row.use = true
        row.forSearch = true
        row.formType = 'input'
      }
    },
    handleFormTypeChange(row) {
      row.use = true
    },
    previewCode() {
      this.showReview = true
      this.createCode(false)
    },
    // 生成代码
    createCode(copyCode) {
      try {
        this.renderCode = startRender({
          pageName: this.pageName,
          tableData: this.tableData,
          formButtons: this.formButtons,
          tableButtons: this.tableButtons,
          cols: this.cols
        })
        if (copyCode !== false) {
          this.$nextTick(() => {
            this.copyToClip()
          })
        }
        // this.$refs.copyBtn.$el.onclick()
      } catch (e) {
        this.$message({ type: 'error', message: '代码生成失败' })
      }
    },
    // 复制到剪切板
    copyToClip() {
      const aux = document.querySelector('#inputDom')
      aux.select()
      document.execCommand('copy')
      this.$message({ type: 'success', message: '代码已复制' })
    }

  }
}
</script>

<style lang="scss" scoped>
.line {
  text-align: center;
}

.config-table ::v-deep.el-table__row {

  td {
    padding: 0 !important;
  }

}

.config-table {
  .el-checkbox {
    display: flex;
    align-items: center;
    padding-left: 10px;
    height: 50px;
  }
}
</style>

