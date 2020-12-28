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
        <el-table-column label="原始密码" prop="password" />
        <el-table-column label="新密码" prop="newPassword" />
        <el-table-column label="确认密码" prop="newPasswordConfirm" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="90" class-name="small-padding fixed-width">
          <template v-slot="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
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
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="base-dialog demo-page-dialog">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="70px"
        >
          <el-form-item label="原始密码:" prop="password">
            <el-input v-model="createFormData.password" placeholder="请输入原始密码"  />
          </el-form-item>
          <el-form-item label="新密码:" prop="newPassword">
            <el-input v-model="createFormData.newPassword" placeholder="请输入新密码"  />
          </el-form-item>
          <el-form-item label="确认密码:" prop="newPasswordConfirm">
            <el-input v-model="createFormData.newPasswordConfirm" placeholder="请输入确认密码"  />
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
      list: [{password: '',
        newPassword: '',
        newPasswordConfirm: '',}], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,

      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,

      }, // 用于重置查询条件
      total: 0,//总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup:{

      }, // 存放选项的数据
      createFormData: {
        password: '',
        newPassword: '',
        newPasswordConfirm: '',
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        password: '',
        newPassword: '',
        newPasswordConfirm: '',
      }, // 用于重置新增的数据
      rules:{
        password: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        newPasswordConfirm: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
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
    //点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 //重置pageNum
      this.getList()
    },
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
          }).catch((e) => {
            console.log(e)
          })
        }
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
