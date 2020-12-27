<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form  :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->



            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button type="primary" size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="getList">查询</el-button>
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
        <el-table-column label="id" prop="id" />
        <el-table-column label="name" prop="name" />
        <el-table-column label="age" prop="age" />
        <el-table-column label="sex" prop="sex" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template v-slot="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确认删除吗？"
              @confirm="handleDelete(row,$index)"
              style="margin-left:10px;"
            >
              <el-button slot="reference" size="mini" type="danger">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <pagination
        v-show="list.length>0"
        :total="list.length"
        :page.sync="listQuery.pageNumber"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <!--编辑新增共用弹窗-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="base-dialog demo-page-dialog">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="70px"
        >
          <el-form-item label="id:" prop="id">
            <el-input v-model="createFormData.id" placeholder="请输入id"  />
          </el-form-item>
          <el-form-item label="name:" prop="name">
            <el-input v-model="createFormData.name" placeholder="请输入name"  />
          </el-form-item>
          <el-form-item label="age:" prop="age">
            <el-input v-model="createFormData.age" placeholder="请输入age"  />
          </el-form-item>
          <el-form-item label="sex:" prop="sex">
            <el-input v-model="createFormData.sex" placeholder="请输入sex"  />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

// import { fetchList, createAccount, updateAccount } from '@/api/demo-page.js' fixme:替换为你的接口地址
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'DemoPage',
  components: { Pagination },
  filters: {

  },
  data() {
    return {
      list: [{id: '',
        name: '',
        age: '',
        sex: '',}], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNumber: 1,
        pageSize: 10,

      }, // 查询条件
      listQueryTemp: {
        pageNumber: 1,
        pageSize: 10,

      }, // 用于重置查询条件
      total: 0,//总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup:{

      }, // 存放选项的数据
      createFormData: {
        id: '',
        name: '',
        age: '',
        sex: '',
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        id: '',
        name: '',
        age: '',
        sex: '',
      }, // 用于重置新增的数据
      rules:{
        id: [{ required: true, message: '请输入id', trigger: 'blur' }],
        name: [{ required: true, message: '请输入name', trigger: 'blur' }],
        age: [{ required: true, message: '请输入age', trigger: 'blur' }],
        sex: [{ required: true, message: '请输入sex', trigger: 'blur' }],
      }, //新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: '',
    }
  },
  created() {
    this.listLoading = false// fixme:对好接口后移除这行代码
    //this.getList()
  },

  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total
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
      this.createFormData = { ...this.createFormDataTemp }
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createApi(this.createFormData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
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
          const tempData = { ...this.createFormData }
          updateApi(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除数据
    handleDelete(row, index) {
      deleteApi(row.id).then(() => {
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
      })
    },
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.demo-page ::v-deep.demo-page-dialog{
  max-width: 600px;

  .el-dialog__body{
    padding: 30px 40px;
  }
}
</style>
