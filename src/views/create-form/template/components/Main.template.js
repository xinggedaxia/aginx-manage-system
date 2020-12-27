export default function(pageName, searchBar, table, dialog, filter, data, method, style) {
  const hyphenateRE = /\B([A-Z])/g
  const hyphenate = function(str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  }

  return `
<template>
  <div class="layout-content ${hyphenate(pageName)}">
    <el-card class="box-card">
        ${searchBar}
        ${table}
        ${dialog}
    </el-card>
  </div>
</template>

<script>

// import { fetchList, createAccount, updateAccount } from '@/api/${hyphenate(pageName)}.js' fixme:替换为你的接口地址
import Pagination from '@/components/Pagination' // 分页

export default {
  name: '${pageName}',
  components: { Pagination },
  ${filter}
  ${data}
  created() {
    this.listLoading = false// fixme:对好接口后移除这行代码
    //this.getList()
  },
  ${method}
  }
}
</script>
${style}`
}
