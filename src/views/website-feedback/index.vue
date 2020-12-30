<template>
  <div class="layout-content website-feedback">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="用户名:">
                <el-input v-model="listQuery.username" placeholder="请输入用户名" @keyup.enter.native="handleSearch" />
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
        <el-table-column label="用户名" prop="username" />
        <el-table-column label="反馈内容" prop="feedback" />
        <el-table-column label="反馈日期" prop="createTime" />
        <el-table-column label="状态" prop="status" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
          <template v-slot="{row,$index}">
            <el-popconfirm
              title="确认删除吗？"
              style="margin-right:10px;"
              @confirm="handleDelete(row,$index)"
            >
              <el-button slot="reference" size="mini" type="danger">
                删除
              </el-button>
            </el-popconfirm>
            <el-button type="primary" size="mini" @click="handleTableCustom(row)">
              已解决
            </el-button>
            <el-button type="primary" size="mini" @click="handleTableCustom(row)">
              关闭
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
    </el-card>
  </div>
</template>

<script>

// import { fetchList, createAccount, updateAccount } from '@/api/website-feedback.js' fixme:替换为你的接口地址
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'WebsiteFeedback',
  components: { Pagination },
  filters: {},
  data() {
    return {
      list: [{
        username: '李四',
        feedback: '我的会员冲不上',
        status: '待处理',
        createTime: '2020-12-31'
      }], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        username: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        username: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {}, // 存放选项的数据
      createFormData: {
        username: '',
        question: '',
        feedback: '',
        createTime: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        username: '',
        question: '',
        feedback: '',
        createTime: ''
      }, // 用于重置新增的数据
      rules: {}, // 新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    this.listLoading = false// fixme:对好接口后移除这行代码
    // this.getList()
  },

  methods: {
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
    // 自定义表格方法
    handleTableCustom() {

    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.website-feedback ::v-deep.website-feedback-dialog {
  max-width: 600px;

  .el-dialog__body {
    padding: 30px 40px;
  }
}
</style>
