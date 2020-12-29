<template>
  <div class="layout-content question-manage">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form  :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="标题:">
                <el-input v-model="listQuery.title" placeholder="请输入标题" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="类型:">
                <el-select v-model="listQuery.type" placeholder="请选择类型">
                  <el-option label="全部" value="" />
                  <el-option v-for="{label,value} in optionGroup.typeList" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="难度:">
                  <el-select v-model="listQuery.level" placeholder="请选择难度">
                    <el-option label="全部" value="" />
                    <el-option v-for="{label,value} in optionGroup.levelList" :key="value" :label="label" :value="value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="创建人:">
                  <el-input v-model="listQuery.createBy" placeholder="请输入创建人" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="更新人:">
                  <el-input v-model="listQuery.updateBy" placeholder="请输入更新人" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
            </template>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button  size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
                <el-button type="text" @click="advanced=!advanced">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
                </el-button>
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
        <el-table-column label="标题" prop="title" />
        <el-table-column v-slot="{row}" label="类型" prop="type">
          {{ row.type | typeFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="难度" prop="level">
          {{ row.level | levelFilter }}
        </el-table-column>
        <el-table-column label="答案" prop="answer" />
        <el-table-column label="创建人" prop="createBy" />
        <el-table-column label="创建日期" prop="createTime" />
        <el-table-column label="更新人" prop="updateBy" />
        <el-table-column label="更新日期" prop="updateTime" />

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
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <!--编辑新增共用弹窗-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="base-dialog question-manage-dialog">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          <el-row :gutter="25">
            <el-col :span="12">
              <el-form-item label="标题:" prop="title">
                <el-input v-model="createFormData.title" placeholder="请输入标题"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型:" prop="type">
                <el-select v-model="createFormData.type" placeholder="请选择类型"  >
                  <el-option v-for="{label,value} in optionGroup.typeList" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="难度:" prop="level">
                <el-select v-model="createFormData.level" placeholder="请选择难度"  >
                  <el-option v-for="{label,value} in optionGroup.levelList" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="答案:" prop="answer">
                <el-input v-model="createFormData.answer" placeholder="请输入答案"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人:" prop="createBy">
                <el-input v-model="createFormData.createBy" placeholder="请输入创建人"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建日期:" prop="createTime">
                <el-input v-model="createFormData.createTime" placeholder="请输入创建日期"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="更新人:" prop="updateBy">
                <el-input v-model="createFormData.updateBy" placeholder="请输入更新人"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="更新日期:" prop="updateTime">
                <el-input v-model="createFormData.updateTime" placeholder="请输入更新日期"  />
              </el-form-item>
            </el-col>
          </el-row>

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

// import { fetchList, createAccount, updateAccount } from '@/api/question-manage.js' fixme:替换为你的接口地址
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'QuestionManage',
  components: { Pagination },
  filters: {
    typeFilter: function(type) {
      return type
    },
    levelFilter: function(level) {
      return level
    },
  },
  data() {
    return {
      list: [{title: '',
        type: 0,
        level: 0,
        answer: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',}], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        type: '',
        level: '',
        createBy: '',
        updateBy: '',
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        type: '',
        level: '',
        createBy: '',
        updateBy: '',
      }, // 用于重置查询条件
      total: 0,//总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup:{
        typeList: [
          {
            label: '条件1',
            value: '1'
          },
          {
            label: '条件2',
            value: '0'
          }
        ],
        levelList: [
          {
            label: '条件1',
            value: '1'
          },
          {
            label: '条件2',
            value: '0'
          }
        ],
      }, // 存放选项的数据
      createFormData: {
        title: '',
        type: 0,
        level: 0,
        answer: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        title: '',
        type: 0,
        level: 0,
        answer: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',
      }, // 用于重置新增的数据
      rules:{
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        level: [{ required: true, message: '请选择难度', trigger: 'change' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
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
          }).catch((e) => {
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
      }).catch((e) => {
        console.log(e)
      })
    },
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.question-manage ::v-deep.question-manage-dialog{

  width: 1100px;
  .el-dialog__body{
    padding: 30px 40px;
  }
}
</style>
