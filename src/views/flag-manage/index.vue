<template>
  <div class="layout-content flag-manage">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="标识类别:">
                <el-input v-model="listQuery.type" placeholder="请输入标识类别" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="标识字段:">
                <el-input v-model.number="listQuery.key" placeholder="请输入字段" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
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
        <el-table-column label="标识类别" prop="type" />
        <el-table-column label="标识字段" prop="key" />
        <el-table-column label="标识值" prop="value" />
        <el-table-column label="标识含义" prop="map" />
        <el-table-column label="备注" prop="note" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button slot="reference" size="mini" type="danger" @click="handleDeleteConfirm(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <!--编辑新增共用弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        custom-class="base-dialog flag-manage-dialog"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          <el-form-item label="标识类别:" prop="type">
            <el-input v-model="createFormData.type" placeholder="请输入标识类别" />
          </el-form-item>
          <el-form-item label="标识字段:" prop="key">
            <el-input v-model="createFormData.key" placeholder="请输入标识字段" />
          </el-form-item>
          <el-form-item label="标识值:" prop="value">
            <el-input v-model="createFormData.value" placeholder="请输入标识值" />
          </el-form-item>
          <el-form-item label="标识含义:" prop="map">
            <el-input v-model="createFormData.map" placeholder="请输入标识含义" />
          </el-form-item>
          <el-form-item label="备注:" prop="note">
            <el-input v-model="createFormData.note" placeholder="请输入备注" />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button :loading="buttonLoading" type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

import { fetchList, createFlag, deleteFlag, updateFlag } from '@/api/flag-manage.js'
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'FlagManage',
  components: { Pagination },
  filters: {},
  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        type: '',
        key: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        type: '',
        key: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {}, // 存放选项的数据
      createFormData: {
        type: '',
        key: '',
        value: '',
        map: '',
        note: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        type: '',
        key: '',
        value: '',
        map: '',
        note: ''
      }, // 用于重置新增的数据
      rules: {
        type: [{ required: true, message: '请输入标识类别', trigger: 'blur' }],
        key: [{ required: true, message: '请输入标识字段', trigger: 'blur' }],
        value: [{ required: true, message: '请输入标识值', trigger: 'blur' }],
        map: [{ required: true, message: '请输入标识含义', trigger: 'blur' }]
      }, // 新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    this.getList()
  },

  methods: {
    refresh() {
      setTimeout((item, index) => {
        window.location.reload()
      }, 500)
    },
    handleDeleteConfirm(id) {
      this.$confirm('删除标识可能导致系统运行异常,确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(id)
      }).catch(() => {

      })
    },

    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    // 点击新增按钮
    handleCreate() {
      this.resetCreateFormData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置新增表单数据
    resetCreateFormData() {
      this.createFormData = {
        ...this.createFormData,
        value: '',
        map: '',
        note: ''
      }
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createFlag(this.createFormData).then(() => {
            // this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },

    // 点击编辑
    handleUpdate(row) {
      this.createFormData = { ...row } // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const tempData = { ...this.createFormData }
          updateFlag(tempData).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            // this.refresh()
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },
    // 删除数据
    handleDelete(id) {
      this.listLoading = true
      deleteFlag(id).then(() => {
        this.listLoading = false
        this.dialogFormVisible = false
        if (this.list.length === 1 && this.listQuery.pageNumber !== 1) {
          this.listQuery.pageNumber--
        }
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        this.listLoading = false
        console.log(e)
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.flag-manage ::v-deep.flag-manage-dialog {
  max-width: 600px;

  .el-dialog__body {
    padding: 30px 40px;
  }
}
.el-table{
  ::v-deep.cell{
    white-space: nowrap;
  }
}
</style>
