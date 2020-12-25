export default function(pageName, searchBar, table, dialog, filter, data, method, style) {
  const hyphenateRE = /\B([A-Z])/g
  const hyphenate = function(str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  }

  return `<template>
  <div class="layout-content ${hyphenate(pageName)}">
    <el-card class="box-card">
        ${searchBar}
    </el-card>
  </div>
</template>

<script>
// fixme:替换为你的接口地址
import { fetchList, createAccount, updateAccount } from '@/api/user.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: '${pageName}',
  components: { Pagination },
  ${filter}
  ${data}
  created() {
    //this.getList()
  },
  ${method}
  }
}
</script>
${style}
`
}
