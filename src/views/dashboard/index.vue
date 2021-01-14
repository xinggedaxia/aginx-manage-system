<template>
  <div v-if="$store.state.user.role === 0 " class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col :span="24">
        <line-chart :chart-data="lineChartData" />
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 8}"
        :xl="{span: 8}"
        style="margin-bottom:30px;"
      >
        <todo-list :todos="todoList" @updateTodo="updateTodo" />
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 10}"
        :xl="{span: 10}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <transaction-table />
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;"
      >
        <box-card />
      </el-col>
    </el-row>
  </div>
  <NoPermission v-else />
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import NoPermission from '@/views/401'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { updateFlag } from '@/api/flag-manage'

const lineChartData = {
  userNumbers: [100, 120, 161, 184, 195, 260, 365],
  vipNumbers: [5, 8, 21, 30, 40, 45, 50]
}

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    NoPermission,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    const options = JSON.parse(sessionStorage.getItem('options'))
    return {
      options,
      lineChartData: lineChartData,
      todoList: JSON.parse(options.todoList.list[0].value),
      dada: []
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    updateTodo(todos) {
      this.todoList = todos
      const requestData = {
        id: 34,
        key: 'todoList',
        map: '首页代办事项的数据',
        note: '别删，自己人',
        type: '代办事项',
        value: JSON.stringify(todos)
      }

      updateFlag(requestData).then(() => {
        // 更新sessionStorage
        const tempOptions = JSON.parse(JSON.stringify(this.options))

        tempOptions.todoList.list[0].value = JSON.stringify(todos)
        sessionStorage.setItem('options', JSON.stringify(tempOptions))
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
