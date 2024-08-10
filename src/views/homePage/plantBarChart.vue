<template>
  <div :style="{height:height,width:width}">
    <el-row :gutter="50" style="height: 100%; width: 100%">
      <el-col :span="8" style="height: 100%;">
        <div :id="pieId" :class="className" style="height: 100%; width: 100%"/>
      </el-col>
      <el-col :span="16" style="height: 100%;">
        <div :id="barId" :class="className" style="height: 100%; width: 100%"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getPlantList } from '@/api/homePage'

const mockFunc=()=>new Promise((resolve,reject)=>{
  resolve({
    plant_list: [{
      planting_structures: '玉米',
      plant_num: '10',
    },{
      planting_structures: '小麦',
      plant_num: '20',
    }]
  });
})

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    barId: {
      type: String,
      default: 'barChart'
    },
    pieId: {
      type: String,
      default: 'pieChart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      barChart: null,
      pieChart: null,
      plantList: [],
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    mockList(callback){
      var res = {
        plant_list: [{
          planting_structures: '玉米',
          plant_num: '10',
        },{
          planting_structures: '小麦',
          plant_num: '20',
        }]
      }
      // console.log('11111')
      callback(res)
    },
    initChart() {
      this.barChart = echarts.init(document.getElementById(this.barId))
      this.pieChart = echarts.init(document.getElementById(this.pieId))
      getPlantList().then(res => {
      // mockFunc().then(res => {
      //   console.log(res)
        this.plantList = res.plant_list
        const xAxisData = []
        const data = []
        const pieLegendData = []
        const pieData = []
        this.plantList.forEach((plant, index) => {
          xAxisData.push(plant.planting_structures)
          data.push(plant.plant_num)
          pieLegendData.push(plant.planting_structures)
          pieData.push({
            value: plant.plant_num,
            name: plant.planting_structures
          })
        })
        this.barChart.setOption({
          // backgroundColor: '#08263a',
          grid: {
            left: '5%',
            right: '5%'
          },
          xAxis: [{
            show: true,
            data: xAxisData
          }],
          visualMap: {
            show: false,
            min: 0,
            max: 50,
            dimension: 0,
            inRange: {
              color: ['blue']
            }
          },
          yAxis: {
            axisLine: {
              show: true
            },
            axisLabel: {
              textStyle: {
                color: '#4a657a'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#08263f'
              }
            },
            axisTick: {
              show: false
            }
          },
          series: [{
            name: 'back',
            type: 'bar',
            data: data,
            z: 1,
            itemStyle: {
              normal: {
                opacity: 0.4,
                barBorderRadius: 5,
                shadowBlur: 3,
                shadowColor: '#111'
              }
            }
          }],
          animationEasing: 'elasticOut',
          animationEasingUpdate: 'elasticOut',
          animationDelay(idx) {
            return idx * 20
          },
          animationDelayUpdate(idx) {
            return idx * 20
          }
        })
        this.pieChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: pieLegendData
          },
          series: [
            {
              name: '种植结构',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: pieData,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      })
    }
  }
}
</script>
