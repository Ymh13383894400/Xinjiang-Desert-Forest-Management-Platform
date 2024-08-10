<template>
  <div class="app-container">
    <div class="filter-container">
<!--      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
      <el-date-picker v-model="timeFilter" type="daterange" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="margin-right: 20px;"/>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-right: 20px;">
        搜索
      </el-button>

    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" min-width="20%" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" min-width="60%" align="center" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="20%" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="checkDetail(row)">
            查看
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="pageLimit" @pagination="pageChange" />
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getAllDataList } from '@/api/dataView'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
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
      timeFilter: '',
      endTime: '',
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
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAllDataList().then(response => {
        console.info(response)
        // this.dataList = response.data.dataList
        this.dataList = response.list
        this.dataList = []
        let count = 0
        response.list.forEach(time => {
          count += 1
          let temp = {
            id: count,
            time: time
          }
          this.dataList.push(temp)
        })
        this.currentList = this.dataList
        this.list = this.dataList.slice(0, this.pageLimit + 1)
        this.total = this.dataList.length

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    pageChange() {
      this.listLoading = true
      this.list = this.currentList.slice((this.page - 1) * this.pageLimit, this.page * this.pageLimit + 1)
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    timeCompare(time, timeFilter){
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
      if (timeList[0] > beginYear && timeList[0] < endYear){
        console.log(11111)
        return true
      }
      else if (timeList[0] === beginYear || timeList[0] === endYear){
        if (timeList[1] > beginMonth && timeList[1] < endMonth){
          console.log(22222)
          return true
        }
        else if (timeList[1] === beginMonth || timeList[1] === endMonth){
          if (timeList[2] >= beginDate && timeList[2] <= endDate){
            console.log(33333)
            return true
          }
        }
      }
      else {
        console.log(44444)
        return false
      }
    },
    handleFilter() {
      console.log(this.timeFilter)
      // console.log(typeof(this.dataList[0].time))

      let tempList = []
      this.dataList.forEach(data => {
        if (this.timeCompare(data.time, this.timeFilter)){
          tempList.push(data)
        }
      })
      this.currentList = tempList
      this.list = this.currentList.slice(0, this.pageLimit + 1)
      this.total = this.currentList.length
      this.page = 1
      // this.listQuery.page = 1
      // this.getList()
    },
    checkDetail(row) {
      this.$router.push({ path: '/dataView/dataDetail', query: { id: row.time }})
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 1000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 1000
            })
          })
        }
      })
    },
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
