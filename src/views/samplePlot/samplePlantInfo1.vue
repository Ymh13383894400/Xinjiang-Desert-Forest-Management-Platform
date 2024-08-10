<template>
  <div class="mixin-components-container">
    <el-row :gutter="20">
      <el-col>
        <el-card class="box-card" :loading="imgLoading" style="height: 470px">
          <div slot="header" class="clearfix">
            <span>数据概览</span>
            <!--            <el-input v-model="sampleBranchName" placeholder="请选择样地" label-width="100px" style="width: 220px"></el-input>-->
            <el-select v-model="sampleBranchName" placeholder="请选择样地" style="width: 220px">
              <el-option v-for="item in sampleBranchNameList" :key="item.plantType" :label="item.allId"
                         :value="item.plantType">
                <!--                <el-option v-for="item in sampleBranchNameList" :key="item.value" :label="item.label" :value="item.value">-->
              </el-option>
            </el-select>
            <el-button type="primary" @click="getSampleBranch('this.sampleBranchName')">
              确认
            </el-button>
            <el-button type="primary" @click="createSamplePlant" style="float: right">
              上传植物
            </el-button>
          </div>

          <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
                    style="width: 100%;" @sort-change="sortChange">
            <!--            <el-table-column label="植物ID" prop="id" align="center" min-width="3%" :class-name="getSortClass('id')">-->
            <!--              <template slot-scope="{row}">-->
            <!--                <span>{{ row.id }}</span>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column label="植物种类" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
              <template slot-scope="{row}">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="经度" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
              <template slot-scope="{row}">
                <span>{{ row.longitude }}</span>
              </template>
            </el-table-column>
            <el-table-column label="纬度" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
              <template slot-scope="{row}">
                <span>{{ row.latitude }}</span>
              </template>
            </el-table-column>
            <el-table-column label="高度" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
              <template slot-scope="{row}">
                <span>{{ row.height }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最大冠幅" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
              <template slot-scope="{row}">
                <span>{{ row.maxCrownWidth }}</span>
              </template>
            </el-table-column>

            <el-table-column label="最小冠幅" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
              <template slot-scope="{row}">
                <span>{{ row.minCrownWidth }}</span>
              </template>
            </el-table-column>
          </el-table>

        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top:50px;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>种植结构</span>
        </div>
        <div style="height: 400px">
          <!--          <plantBarChart height="100%" width="100%" />-->
        </div>
      </el-card>
    </el-row>

    <el-dialog :title="'新建植物（请填写植物信息）'"
               :visible.sync="dialogTableVisibleCreatePlant" width="20%" :append-to-body="true">
      <el-form :model="plantFormCreate" :rules="plantRulesCreate" ref="ruleFormCreate" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="植物名称" prop="samplePlantName">
          <el-input v-model="plantFormCreate.samplePlantName"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="plantFormCreate.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="plantFormCreate.latitude"></el-input>
        </el-form-item>
        <el-form-item label="高度" prop="heigth">
          <el-input v-model="plantFormCreate.heigth"></el-input>
        </el-form-item>
        <el-form-item label="最大冠幅" prop="max">
          <el-input v-model="plantFormCreate.max"></el-input>
        </el-form-item>
        <el-form-item label="最小冠幅" prop="min">
          <el-input v-model="plantFormCreate.min"></el-input>
        </el-form-item>
        <el-form-item label="地径" prop="min">
          <el-input v-model="plantFormCreate.dimeter"></el-input>
        </el-form-item>
        <el-form-item label="冠部面积" prop="min">
          <el-input v-model="plantFormCreate.crownArea"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="拍摄时间:">
          <el-date-picker v-model="plantFormCreate.time" type="date" format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitPlantFormCreate('plantFormCreate')">保存</el-button>
          <el-button @click="resetPlantFormCreate('plantFormCreate')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import MdInput from '@/components/MDinput'
import Mallki from '@/components/TextHoverEffect/Mallki'
import DropdownMenu from '@/components/Share/DropdownMenu'
import waves from '@/directive/waves/index.js' // 水波纹指令
import {getNDVIList} from '@/api/homePage'
import axios from 'axios'
import plantBarChart from '@/views/homePage/plantBarChart'
import {fetchPv} from '@/api/article'
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {getSamplePlantList, getSamplePlotBranchList, uploadPlantInfo} from "@/api/samplePlot";
import samplePlot from "@/router/modules/samplePlot";

const calendarTypeOptions = [
  {key: 'CN', display_name: 'China'},
  {key: 'US', display_name: 'USA'},
  {key: 'JP', display_name: 'Japan'},
  {key: 'EU', display_name: 'Eurozone'}
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComponentMixinDemo',
  computed: {
    samplePlot() {
      return samplePlot
    }
  },
  components: {
    PanThumb,
    MdInput,
    Mallki,
    DropdownMenu,
    plantBarChart,
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      dataList: [],
      id: 0,
      // id: this.$router.q,
      sampleNameFilter: '', // 新的样地名称过滤器
      pageLimit: 20,
      page: 1,
      currentList: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      //样地分支选择，以及查看
      sampleBranchName: '',
      sampleBranchNameList: [],


      //新建植物上传
      dialogTableVisibleCreatePlant: false,
      plantFormCreate: {
        samplePlantName: '',
        longitude: 0,
        latitude: 0,
        heigth: 0,
        max: 0,
        min: 0,
        dimeter: 0,
        crownArea: 0,
        time: '',
      },
      plantRulesCreate: {
        samplePlantName: [
          {required: true, message: '请输入植物名称', trigger: 'blur'},
        ],
        longitude: [
          {required: true, message: '请输入经度', trigger: 'blur'},
        ],
        latitude: [
          {required: true, message: '请输入纬度', trigger: 'blur'}
        ],
        heigth: [
          {required: true, message: '请输入高度', trigger: 'blur'}
        ],
        max: [
          {required: true, message: '请输入最大冠幅', trigger: 'blur'}
        ],
        min: [
          {required: true, message: '请输入最小冠幅', trigger: 'blur'}
        ],
      },


      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{required: true, message: 'type is required', trigger: 'change'}],
        timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
        title: [{required: true, message: 'title is required', trigger: 'blur'}]
      },
      downloadLoading: false,


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
    // console.log("进入")
    this.getList();
  },
  methods: {
    /*************新建植物信息***************/
    createSamplePlant() {
      this.dialogTableVisibleCreatePlant = true;
    },
    submitPlantFormCreate(formName) {
      console.log("*******")
      if (formName !== null) {
        let request = {
          plantClassification: this.plantFormCreate.samplePlantName,
          longitude: this.plantFormCreate.longitude,
          latitude: this.plantFormCreate.latitude,
          plantHeight: this.plantFormCreate.heigth,
          maxCrownWidth: this.plantFormCreate.max,
          minCrownWidth: this.plantFormCreate.min,
          groundDiameter: this.plantFormCreate.dimeter,
          crownArea: this.plantFormCreate.crownArea,
          time: this.plantFormCreate.time,
          samplePlotId: this.id,
        }
        uploadPlantInfo(request).then(res => {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.getList();
          this.dialogTableVisibleCreatePlant = false;
        })
      } else {
        // alert("error submit");
        return false;
      }

    },
    resetPlantFormCreate(formName) {
      this.$refs[formName].resetFields();
      this.dialogTableVisibleCreate = false;      // 关闭页面
    },

    //样地分支页面
    getSampleBranch(branchId) {
      this.dataList = [];
      this.listLoading = true
      getSamplePlantList(branchId).then(response => {
        response['list'].forEach(samplePlantInfo => {
          let data = {
            // id: samplePlantInfo.plantId,
            name: samplePlantInfo.plantClassification,
            longitude: samplePlantInfo.longitude,
            latitude: samplePlantInfo.longitude,
            height: samplePlantInfo.plantHeight,
            maxCrownWidth: samplePlantInfo.maxCrownWidth,
            minCrownWidth: samplePlantInfo.minCrownWidth,
          }
          this.dataList.push(data)
          this.list = this.dataList.slice(0, this.pageLimit + 1)
          //list为row方法的内置变量，通过分页将datalist的内容传给list，再传给临时变量row，用于表格中的数据展示
          this.total = this.dataList.length
        })
      })
      this.listLoading = false;
    },
    getList() {
      this.listLoading = true
      //可能是router没准备好，用this.$router.onReady解决
      this.$router.onReady(() => {
        this.id = this.$route.query.samplePlotId
        // console.log(this.id)
        //这里的info就是你的key
      })
      getSamplePlotBranchList(this.id).then(response => {
        response['list'].forEach(sampleBranchInfo => {
          let data = {
            // id: samplePlantInfo.plantId,
            id: sampleBranchInfo.samplePlotId,
            branchId: sampleBranchInfo.sampleBranchId,
            plantType: sampleBranchInfo.plantType,
            allId: sampleBranchInfo.allId,
            // latitude: sampleBranchInfo.longitude,
          }
          this.sampleBranchNameList.push(data)
        })
      })
      getSamplePlantList(this.id).then(response => {
        response['list'].forEach(samplePlantInfo => {
          let data = {
            // id: samplePlantInfo.plantId,
            name: samplePlantInfo.plantClassification,
            longitude: samplePlantInfo.longitude,
            latitude: samplePlantInfo.longitude,
            height: samplePlantInfo.plantHeight,
            maxCrownWidth: samplePlantInfo.maxCrownWidth,
            minCrownWidth: samplePlantInfo.minCrownWidth,
          }
          this.dataList.push(data)
          this.list = this.dataList.slice(0, this.pageLimit + 1)
          //list为row方法的内置变量，通过分页将datalist的内容传给list，再传给临时变量row，用于表格中的数据展示
          this.total = this.dataList.length
        })
      })
      // let dataList1 = [      // 临时数据，后续请求后端
      //   { id: 1, name: "玉米1", longitude: 90.0628519564804, latitude: 96.92425142367,height:50, maxCrownWidth:3, minCrownWidth:1},
      //   { id: 2, name: "玉米2", longitude: 80.31646329546038, latitude: 89.14526369275156,height:20, maxCrownWidth:3, minCrownWidth:1},
      //   { id: 3, name: "哈密瓜5", longitude: 81.34507442321777, latitude: 98.1549790149, height:10,maxCrownWidth:3, minCrownWidth:1},
      //   { id: 4, name: "地瓜6", longitude: 92.20121436723711, latitude: 88.28413159615113, height:30,maxCrownWidth:3, minCrownWidth:1},
      //   { id: 5, name: "葡萄6", longitude: 86.76411631471, latitude: 85.5404178623362, height:5,maxCrownWidth:3,minCrownWidth:1 },
      //   { id: 6, name: "西红柿4", longitude: 81.23860914882468, latitude: 85.5449456634837, height:600,maxCrownWidth:3,minCrownWidth:1},
      // ];
      //
      // let list1 = dataList1.slice(0, this.pageLimit + 1)
      // let total1 = dataList1.length
      // console.log(dataList1)


      // Just to simulate the time of the request
      this.listLoading = false
      // print("结束")？？？？？？？？真的搞笑
    },
    getWeather() {
      axios.get('https://restapi.amap.com/v3/weather/weatherInfo?key=f09cd81ac95b4438e1e3ab2124ab53d6&city=659001&extensions=all').then(response => {
        console.log(11111)
        console.log(response)
        this.weather = response.data.forecasts[0].casts[0]
      })
    },
    getNDVI() {
      getNDVIList().then(response => {
        // console.log(response)
        this.ndviItem = response.ndvi_list[0]
        this.ndviListIndex = 0
        this.ndviList = response.ndvi_list
        this.imgLoading = false
      })
    },
    changeNdvi() {
      this.ndviItem = this.ndviList[this.ndviListIndex]
    },
    handleLeft() {
      this.ndviListIndex = (this.ndviListIndex - 1 + this.ndviList.length) % this.ndviList.length
      this.changeNdvi()
    },
    handleRight() {
      this.ndviListIndex = (this.ndviListIndex + 1) % this.ndviList.length
      this.changeNdvi()
    },
    pageChange() {
      this.listLoading = true
      this.list = this.currentList.slice((this.page - 1) * this.pageLimit, this.page * this.pageLimit + 1)
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    timeCompare(time, timeFilter) {
      var beginYear = parseInt(timeFilter[0].getFullYear())
      var beginMonth = parseInt(timeFilter[0].getMonth()) + 1
      var beginDate = parseInt(timeFilter[0].getDate())
      var endYear = parseInt(timeFilter[1].getFullYear())
      var endMonth = parseInt(timeFilter[1].getMonth()) + 1
      var endDate = parseInt(timeFilter[1].getDate())
      let timeList = []
      time.split('-').forEach(t => {
        timeList.push(parseInt(t))
      })
      console.log(timeList[0] === beginYear || timeList[0] === endYear)
      console.log(timeFilter[0].getMonth())
      if (timeList[0] > beginYear && timeList[0] < endYear) {
        console.log(11111)
        return true
      } else if (timeList[0] === beginYear || timeList[0] === endYear) {
        if (timeList[1] > beginMonth && timeList[1] < endMonth) {
          console.log(22222)
          return true
        } else if (timeList[1] === beginMonth || timeList[1] === endMonth) {
          if (timeList[2] >= beginDate && timeList[2] <= endDate) {
            console.log(33333)
            return true
          }
        }
      } else {
        console.log(44444)
        return false
      }
    },
    // handleFilter () {
    //   console.log(this.timeFilter)
    //   // console.log(typeof(this.dataList[0].time))
    //
    //   let tempList = []
    //   this.dataList.forEach(data => {
    //     if (this.timeCompare(data.time, this.timeFilter)) {
    //       tempList.push(data)
    //     }
    //   })
    //   this.currentList = tempList
    //   this.list = this.currentList.slice(0, this.pageLimit + 1)
    //   this.total = this.currentList.length
    //   this.page = 1
    //   // this.listQuery.page = 1
    //   // this.getList()
    // },
    checkDetail(row) {
      this.$router.push({path: '/dataView/dataDetail', query: {id: row.time}})
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const {prop, order} = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    // handleCreate () {
    //   this.resetTemp()
    //   this.dialogStatus = 'create'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // createData () {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
    //       this.temp.author = 'vue-element-admin'
    //       createArticle(this.temp).then(() => {
    //         this.list.unshift(this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Created Successfully',
    //           type: 'success',
    //           duration: 1000
    //         })
    //       })
    //     }
    //   })
    // },
    // handleUpdate (row) {
    //   this.temp = Object.assign({}, row) // copy obj
    //   this.temp.timestamp = new Date(this.temp.timestamp)
    //   this.dialogStatus = 'update'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // updateData () {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       const tempData = Object.assign({}, this.temp)
    //       tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
    //       updateArticle(tempData).then(() => {
    //         const index = this.list.findIndex(v => v.id === this.temp.id)
    //         this.list.splice(index, 1, this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Update Successfully',
    //           type: 'success',
    //           duration: 1000
    //         })
    //       })
    //     }
    //   })
    // },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 1000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
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

.component-item {
  min-height: 100px;
}

.weatherFormInput {
  background-color: transparent;
  border: none;
  width: 150px;
}

.weatherFormInput:hover {
  cursor: default;
}

.weatherForm >>> .el-input__inner {
  border: 0;
}

.imageLegend {
  font-size: small;
  color: grey;
}
</style>
