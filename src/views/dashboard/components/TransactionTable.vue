<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Order_No" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price}}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: [
        {
          order_no: '7665645564564534345345',
          timestamp: new Date(),
          username: 'a',
          price: '1',
          'status': 'success'
        },
        {
          order_no: '7665645564564534345345',
          timestamp: new Date(),
          username: 'a',
          price: '2',
          'status': 'success'
        },
        {
          order_no: '7665645564564534345345',
          timestamp: new Date(),
          username: 'a',
          price: '3',
          'status': 'pending'
        },
        {
          order_no: '7665645564564534345345',
          timestamp: new Date(),
          username: 'a',
          price: '4',
          'status': 'pending'
        },
        {
          order_no: '7665645564564534345345',
          timestamp: new Date(),
          username: 'a',
          price: '5',
          'status': 'pending'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {

    }
  }
}
</script>
