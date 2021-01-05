<template>
  <div v-if="$store.state.user.role === 0 " class="dashboard-editor-container">
    <!--    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>-->
    <iframe v-if="url" :src="url" frameborder="0" style="width: 100%;height: 800px" />
  </div>
  <NoPermission v-else />
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import NoPermission from '@/views/401'
const options = JSON.parse(sessionStorage.getItem('options'))
const lineChartData = {
  userNumbers: [100, 120, 161, 184, 195, 260, 365],
  vipNumbers: [5, 8, 21, 30, 40, 45, 50]
}

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    NoPermission
  },
  data() {
    return {
      lineChartData: lineChartData,
      url: options.homeUrl.list[0].value
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
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
