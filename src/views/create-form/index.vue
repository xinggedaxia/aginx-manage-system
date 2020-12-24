<template>
  <div class="layout-content account-manage-page">
    <el-card class="box-card">
      <!--表单-->
      <el-form :inline="false" label-width="80px" size="small" label-position="top">
        <el-form-item label="初始数据:">
          <el-input v-model="initData" type="textarea" placeholder="placeholder" rows="5" @input="createTableData" />
        </el-form-item>
        <el-form-item label="字段配置:">
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column label="字段名称" prop="stringName" />
            <el-table-column v-slot="{row}" label="表格字段" prop="use">
              <el-checkbox v-model="row.use" @change="handleUseChange(row,$event)" />
            </el-table-column>
            <el-table-column v-slot="{row}" label="显示名称" prop="label">
              <el-input v-model="row.label" placeholder="请输入" />
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
            <el-checkbox label="custom">自定义</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="copyBtn" :data-clipboard-text="renderCode">生成代码</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import tools from './template'
console.log(tools)
export default {
  name: 'CreateForm',
  data() {
    return {
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
          label: '日期',
          value: 'date'
        }
      ],
      formButtons: ['search', 'add', 'reset'],
      tableButtons: ['edit', 'delete'],
      renderCode: tools.mainTemp
    }
  },
  created() {
    this.createTableData()
  },
  mounted() {
    const btnCopy = new Clipboard('.copyBtn')
    // 复制成功后执行的回调函数
    btnCopy.on('success', (e) => {
      this.$message('生成成功，已复制到剪切板')
    })
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
          label: stringName,
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
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

