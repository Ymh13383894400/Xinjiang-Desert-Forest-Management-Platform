<template>
  <div class="dashboard-editor-container">
<!--    <github-corner class="github-corner" />-->

<!--    <panel-group @handleSetLineChartData="handleSetLineChartData" />-->
    <el-row style="background:#fff;padding:16px 16px;margin-bottom:32px;">
      <el-col style="width: 100%; height: 80%">
        <el-card>
          <div class="weather-icon">
            <img src="@/../public/weather.png" alt="Weather Icon">
          </div>
          <div class="weather-info">
            <div style="margin-bottom: 20px">
              <div style="font-weight: bolder; font-size: 18px">当日气候</div>
            </div>
            <div style="vertical-align: middle">
              <div class="temperature" style="margin:10px 0">日期：{{data.weather.data_id}}</div>
              <div class="temperature" style="margin:10px 0">当日平均温度：{{ data.weather.temp_top }} °C</div>
              <div class="temperature" style="margin:10px 0">当日最高温度：{{ data.weather.temp_bottom }} °C</div>
              <div class="temperature" style="margin:10px 0">当日最低温度：{{ data.weather.temp_of_time }} °C</div>
              <div class="temperature" style="margin:10px 0">当日体感温度：{{ data.weather.temp_feel }} °C</div>
              <div class="humidity" style="margin:10px 0">湿度：{{data.weather.humidity}}%</div>
              <div class="wind" style="margin:10px 0">风力等级：{{data.weather.wind_speed}}级</div>
              <div class="wind" style="margin:10px 0">风向：{{data.weather.wind_dir}}级</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'

import { getDataById, getCurrentData } from '@/api/dataView'



export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
  },
  data() {
    return {
      temp: 30,
      data: {},
      id: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.id = this.$route.query.id
      let getMethod
      if (this.id === '' || this.id == null){
        getMethod = getCurrentData
      }
      else {
        getMethod = getDataById
      }
      getMethod(this.id).then(response => {
        console.log(response)
        this.data = response.res
        // console.log(this.data)
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
/* 样式可以根据需要自行调整 */
.weather-icon {
  /* 设置图标与文字信息高度一致 */
  display: inline-block;
  //vertical-align: middle;
}

.weather-icon img {
  /* 设置图标大小 */
  width: 200px;
  height: 200px;
}

.weather-info {
  /* 设置文字信息与图标垂直对齐 */
  display: inline-block;
  //vertical-align: middle;
  margin-left: 10px; /* 可调整图标和文字之间的间距 */
}

.temperature, .humidity, .wind {
  /* 样式细节，根据需要调整字体大小、颜色等 */
  font-size: 16px;
  color: #333;
  margin-bottom: 5px; /* 可调整每个信息之间的间距 */
}

}


</style>
