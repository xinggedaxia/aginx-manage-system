<template>
  <el-row :gutter="40" class="panel-group">
    <el-col v-for="(panelData,index) in panelGroupData" :key="index" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div :class="panelData.divClass" class="card-panel-icon-wrapper">
          <svg-icon :icon-class="panelData.iconClass" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ panelData.text }}
          </div>
          <count-to :start-val="panelData.countTo.startVal" :end-val="panelData.countTo.endVal" :duration="panelData.countTo.duration" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      panelGroupData: [
        {
          divClass: 'icon-visitors',
          iconClass: 'eye-open',
          text: '今日访问量',
          countTo: {
            startVal: 0,
            endVal: 345,
            duration: 2000
          }
        },
        {
          divClass: 'icon-money',
          iconClass: 'money',
          text: '今日收益',
          countTo: {
            startVal: 0,
            endVal: 200,
            duration: 2000
          }
        },
        {
          divClass: 'icon-peoples',
          iconClass: 'peoples',
          text: '用户总数',
          countTo: {
            startVal: 0,
            endVal: 9280,
            duration: 2000
          }
        },
        {
          divClass: 'icon-shopping',
          iconClass: 'shopping',
          text: '会员总数',
          countTo: {
            startVal: 0,
            endVal: 136,
            duration: 2000
          }
        }
      ]
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-visitors {
        background: #40c9c6;
      }
      .icon-money {
        background: #36a3f7;
      }
      .icon-peoples {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-visitors {
      color: #40c9c6;
    }
    .icon-money {
      color: #36a3f7;
    }
    .icon-peoples {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
