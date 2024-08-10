<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

<!--    <panel-group @handleSetLineChartData="handleSetLineChartData" />-->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col :span="8">
        <el-card>
<!--          <div style="display: flex">-->
<!--            <el-image-->
<!--              style="height: 56px"-->
<!--              :src="'https://openweathermap.org/img/wn/03d.png'"-->
<!--              :fit="fit">-->
<!--            </el-image>-->
          <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/03d.png" alt="Weather Icon">
          </div>
      <!-- 天气详细信息 -->
          <div class="weather-info">
            <div class="temperature">温度：{{temp}} °C</div>
            <div class="humidity">湿度：50%</div>
            <div class="wind">风力等级：2级</div>
            <!-- 其他信息 -->
          </div>
<!--          </div>-->
<!--          <div style="padding: 14px; ">-->
<!--            <span>NDVI</span>-->
<!--            <div class="bottom clearfix">-->
<!--              <time class="time">{{ currentDate }}</time>-->
<!--            </div>-->
<!--          </div>-->
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <img src="../../../../public/ndvi_image.png" class="image">
          <div style="padding: 14px; ">
            <span>NDVI</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <img src="../../../../public/rvi_image.png" class="image">
          <div style="padding: 14px; ">
            <span>RVI</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
<!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
<!--      <line-chart :chart-data="lineChartData" />-->
<!--    </el-row>-->

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      temp: 30
    }
  },
  mounted() {
    this.getLinearData()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getLinearData() {
      let linear_data = 0
      return linear_data
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
/* 样式可以根据需要自行调整 */
.weather-icon {
  /* 设置图标与文字信息高度一致 */
  display: inline-block;
  vertical-align: middle;
}

.weather-icon img {
  /* 设置图标大小 */
  width: 200px;
  height: 200px;
}

.weather-info {
  /* 设置文字信息与图标垂直对齐 */
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px; /* 可调整图标和文字之间的间距 */
}

.temperature, .humidity, .wind {
  /* 样式细节，根据需要调整字体大小、颜色等 */
  font-size: 16px;
  color: #333;
  margin-bottom: 5px; /* 可调整每个信息之间的间距 */
}

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
