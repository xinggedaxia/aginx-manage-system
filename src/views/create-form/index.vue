<template>
  <div class="layout-content account-manage-page">
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
          </el-table>
        </el-form-item>
        <el-form-item label="表单按钮:">
          <el-checkbox-group v-model="formButtons">
            <el-checkbox label="search">查询</el-checkbox>
            <el-checkbox label="add">新增</el-checkbox>
            <el-checkbox label="reset">重置</el-checkbox>
            <el-checkbox label="export">导出</el-checkbox>
            <el-checkbox label="custom">自定义</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="表格操作列:">
          <el-checkbox-group v-model="tableButtons">
            <el-checkbox label="edit">编辑</el-checkbox>
            <el-checkbox label="delete">删除</el-checkbox>
            <el-checkbox label="toggle">切换</el-checkbox>
            <el-checkbox label="custom_t">自定义</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createCode">复制</el-button>
          <el-button type="primary" @click="previewCode">先复制-然后把代码手动整到previewCode-预览</el-button>
        </el-form-item>

        <el-dialog title="效果预览" :visible.sync="showReview" :fullscreen="true">
          <Test v-if="showReview" />
        </el-dialog>
        <!--用于存放代码，让剪切功能生效-->
        <textarea
          id="inputDom"
          type="text"
          :value="renderCode"
          style="height: 1px;overflow:hidden;position:absolute;top:9999px"
        />
      </el-form>
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
        }
      ],
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
      pageName: 'DemoPage',
      formButtons: ['search', 'add', 'reset'],
      tableButtons: ['edit', 'delete'],
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
          formType: ''
        })
      }
    },
    handleUseChange(row, flag) {
      if (!flag) {
        row.forSearch = false
        row.formType = ''
      }
    },
    handleForSearchChange(row, flag) {
      if (flag) {
        row.use = true
        row.forSearch = true
        row.formType = 'input'
      } else {
        row.formType = ''
      }
    },
    handleFormTypeChange(row) {
      row.forSearch = true
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
          tableButtons: this.tableButtons
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

<style scoped>
.line {
  text-align: center;
}
</style>

