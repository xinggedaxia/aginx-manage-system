<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :inline="true" :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button type="primary" size="small" @click="getList">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
                <el-button type="primary" size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small">导出</el-button>
                <el-button type="primary" size="small">自定义</el-button>

              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

    </el-card>
  </div>
</template>

<script>
// fixme:替换为你的接口地址
import { fetchList, createAccount, updateAccount } from '@/api/user.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DemoPage',
  components: { Pagination },

  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        page: 1,
        limit: 10

      }, // 查询条件
      listQueryTemp: {
        page: 1,
        limit: 10

      }, // 用于重置查询条件
      total: 0,
      advanced: false, // 是否展开高级搜索条件

      temp: {
        id: true,
        name: 0,
        age: true,
        sex: 0
      }, // 存储新增和编辑框的数据
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    // this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

</style>
