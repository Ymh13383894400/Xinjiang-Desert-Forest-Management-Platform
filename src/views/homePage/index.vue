<template>
  <div class="mixin-components-container">
    <el-row :gutter="20">

      <el-col :span="16">
        <el-card class="box-card" :loading="imgLoading" style="height: 470px">
          <div slot="header" class="clearfix">
            <span>数据概览</span>
          </div>
          <el-row justify="center" type="flex" style="margin-bottom: 20px">
            <el-button icon="el-icon-back" circle @click="handleLeft"></el-button>
            <el-select v-model="ndviListIndex" placeholder="请选择" @change="changeNdvi" style="margin: 0 20px">
              <el-option
                  v-for="(item, index) in ndviList"
                  :key="index"
                  :label="item.shoot_time"
                  :value="index">
              </el-option>
            </el-select>
            <el-button icon="el-icon-right" circle @click="handleRight"></el-button>
          </el-row>
          <el-row justify="space-around" type="flex">
            <el-col :span="10" style="text-align: center;vertical-align: middle">
              <el-image :src="ndviItem.ndvi" style="height: 300px; min-width: 250px">
                <div slot="error" class="image-slot" style="margin: auto 0;background-color: grey;height: 100%;position: relative;">
                  <span style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);">加载中<span class="dot">...</span></span>
                </div>
              </el-image>
              <div class="imageLegend">ndvi</div>
            </el-col>
            <el-col :span="10" style="text-align: center">
              <el-image :src="ndviItem.rvi" style="height: 300px; min-width: 250px; ">
                <div slot="error" class="image-slot" style="margin: auto 0;background-color: grey;height: 100%;position: relative;">
                  <span style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);">加载中<span class="dot">...</span></span>
                </div>
              </el-image>
              <div class="imageLegend">rvi</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="box-card" style="height: 470px">
          <el-form class="weatherForm" label-position="right" label-width="80px">
            <el-form-item label="日期:">
              <el-input :value="weather.date" class="weatherFormInput" readonly></el-input>
            </el-form-item>
            <el-form-item label="日间气温:">
              <el-input :value="weather.daytemp+'℃'" class="weatherFormInput" readonly></el-input>
            </el-form-item>
            <el-form-item label="日间天气:">
              <el-input :value="weather.dayweather" class="weatherFormInput" readonly></el-input>
            </el-form-item>
            <el-form-item label="夜间气温:">
              <el-input :value="weather.nighttemp+'℃'" class="weatherFormInput" readonly></el-input>
            </el-form-item>
            <el-form-item label="夜间天气:">
              <el-input :value="weather.nightweather" class="weatherFormInput" readonly></el-input>
            </el-form-item>
<!--            <el-form-item label="最高气温:">-->
<!--              <el-input :value="weather.tem1" class="weatherFormInput" readonly></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="湿度:">-->
<!--              <el-input :value="weather.humidity" class="weatherFormInput" readonly></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="天气:">-->
<!--              <el-input :value="weather.dayweather" class="weatherFormInput" readonly></el-input>-->
<!--            </el-form-item>-->
          </el-form>
          <div slot="header" class="clearfix">
            <span>天气情况</span>
          </div>
<!--          <div style="height:100px;">-->
<!--            <div>日期:{{weather.date}}</div>-->
<!--            <div>最低气温:{{weather.tem2}}</div>-->
<!--            <div>最高气温:{{weather.tem1}}</div>-->
<!--            <div>湿度:{{weather.humidity}}</div>-->
<!--            <div>天气:{{weather.wea}}</div>-->
<!--          </div>-->
        </el-card>
      </el-col>


    </el-row>

    <el-row style="margin-top:50px;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>种植结构</span>
        </div>
        <div style="height: 400px">
          <plantBarChart height="100%" width="100%" />
        </div>
      </el-card>
    </el-row>

<!--    <el-row :gutter="20" style="margin-top:50px;">-->
<!--      <el-col :span="8">-->
<!--        <el-card class="box-card">-->
<!--          <div slot="header" class="clearfix">-->
<!--            <span>Share</span>-->
<!--          </div>-->
<!--          <div class="component-item" style="height:420px;">-->
<!--            <dropdown-menu :items="articleList" style="margin:0 auto;" title="系列文章" />-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import MdInput from '@/components/MDinput'
import Mallki from '@/components/TextHoverEffect/Mallki'
import DropdownMenu from '@/components/Share/DropdownMenu'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { getNDVIList, getPlantList } from '@/api/homePage'
import axios from 'axios'
import { removeResizeListener } from 'element-ui/src/utils/resize-event'
import echarts from 'echarts'
import plantBarChart from './plantBarChart'
import $ from 'jquery'

export default {
  name: 'ComponentMixinDemo',
  components: {
    PanThumb,
    MdInput,
    Mallki,
    DropdownMenu,
    plantBarChart
  },
  directives: {
    waves
  },
  data() {
    return {
      weather: {},
      ndviListIndex: 0,
      ndviItem: {
        shoot_time: '',
        ndvi: ''
      },
      ndviList: [],
      chart: null,
      plantList: [],
      plantChartId: 'plantChartId',
      imgLoading: true,
      readonly: true
    }
  },
  created() {
    this.getWeather()
    this.getNDVI()
  },
  methods: {
    getWeather() {
      axios.get('https://restapi.amap.com/v3/weather/weatherInfo?key=f09cd81ac95b4438e1e3ab2124ab53d6&city=659001&extensions=all').then(response => {
        console.log(11111)
        console.log(response)
        this.weather = response.data.forecasts[0].casts[0]
      })
    },
    getNDVI(){
      getNDVIList().then(response => {
        // console.log(response)
        this.ndviItem = response.ndvi_list[0]
        this.ndviListIndex = 0
        this.ndviList = response.ndvi_list
        this.imgLoading = false
      })
    },
    changeNdvi(){
      this.ndviItem = this.ndviList[this.ndviListIndex]
    },
    handleLeft(){
      this.ndviListIndex = (this.ndviListIndex - 1 + this.ndviList.length) % this.ndviList.length
      this.changeNdvi()
    },
    handleRight(){
      this.ndviListIndex = (this.ndviListIndex + 1) % this.ndviList.length
      this.changeNdvi()
    }
  }
}
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item{
  min-height: 100px;
}
.weatherFormInput{
  background-color: transparent;
  border: none;
  width: 150px;
}
.weatherFormInput:hover{
  cursor: default;
}
.weatherForm>>>.el-input__inner{
  border: 0;
}
.imageLegend{
  font-size: small;
  color: grey;
}
</style>
