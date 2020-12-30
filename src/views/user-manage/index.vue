<template>
  <div class="layout-content user-manage">
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
            <el-col :md="8" :sm="24">
              <el-form-item label="手机号:">
                <el-input v-model="listQuery.phone" placeholder="请输入手机号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="邮箱地址:">
                  <el-input v-model="listQuery.email" placeholder="请输入邮箱地址" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="身份:">
                  <el-input v-model="listQuery.role" placeholder="请输入身份" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="状态:">
                  <el-input v-model="listQuery.status" placeholder="请输入状态" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
            </template>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
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
        <el-table-column label="用户名" prop="username" />
        <el-table-column label="手机号" prop="phone" />
        <el-table-column label="邮箱地址" prop="email"  width="200px"/>
        <el-table-column v-slot="{row}" label="身份" prop="role">
          {{ row.role | roleFilter }}
        </el-table-column>
        <el-table-column label="会员到期时间" prop="vipExpireTime" />
        <el-table-column v-slot="{row}" label="状态" prop="status">
          {{ row.status | statusFilter }}
        </el-table-column>
        <el-table-column label="累计消费" prop="spendMoney" />
        <el-table-column label="创建日期" prop="createTime" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
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
              封禁
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
        custom-class="base-dialog user-manage-dialog"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          <el-row :gutter="25">
            <el-col :span="12">
              <el-form-item label="用户名:" prop="username">
                <el-input v-model="createFormData.username" placeholder="请输入用户名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号:" prop="phone">
                <el-input v-model="createFormData.phone" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱地址:" prop="email">
                <el-input v-model="createFormData.email" placeholder="请输入邮箱地址" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份:" prop="role">
                <el-input v-model="createFormData.role" placeholder="请输入身份" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="会员到期时间:" prop="vipExpireTime">
                <el-input v-model="createFormData.vipExpireTime" placeholder="请输入会员到期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态:" prop="status">
                <el-input v-model="createFormData.status" placeholder="请输入状态" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计消费:" prop="spendMoney">
                <el-input v-model="createFormData.spendMoney" placeholder="请输入累计消费" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建日期:" prop="createTime">
                <el-input v-model="createFormData.createTime" placeholder="请输入创建日期" />
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

// import { fetchList, createAccount, updateAccount } from '@/api/user-manage.js' fixme:替换为你的接口地址
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'UserManage',
  components: { Pagination },
  filters: {
    roleFilter: function(role) {
      const roleMap = {
        0: '普通用户',
        1: '会员'
      }
      return roleMap[role]
    },
    statusFilter: function(status) {
      const statusMap = {
        0: '正常',
        1: '封禁'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [{
        username: 'xingge',
        phone: '18308462246',
        email: 'xinggedaxia@foxmail.com',
        role: 1,
        vipExpireTime: '2999-01-01',
        status: 0,
        spendMoney: '9999',
        createTime: '2020-12-30'
      }], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        username: '',
        phone: '',
        email: '',
        role: '',
        status: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        username: '',
        phone: '',
        email: '',
        role: '',
        status: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {}, // 存放选项的数据
      createFormData: {
        username: '',
        phone: '',
        email: '',
        role: '',
        vipExpireTime: '',
        status: '',
        spendMoney: '',
        createTime: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        username: '',
        phone: '',
        email: '',
        role: '',
        vipExpireTime: '',
        status: '',
        spendMoney: '',
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
.user-manage ::v-deep.user-manage-dialog {

  width: 1100px;

  .el-dialog__body {
    padding: 30px 40px;
  }
}
</style>
