<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchText" placeholder="请输入搜索关键字" style="width: 200px;" class="filter-item"></el-input>
      <!--      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-input v-model="sampleNameFilter" placeholder="样地名称" style="width: 200px;" class="filter-item"-->
<!--                @keyup.enter.native="handleFilterName"/>-->

<!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterName"-->
<!--                 style="margin-right: 20px;">-->
<!--        搜索-->
<!--      </el-button>-->

      <el-button v-waves class="filter-item" type="success" @click="createSample" style="margin-left: 20px;">
        新建样地
      </el-button>

    </div>

<!--    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"-->
<!--              @sort-change="sortChange">-->
    <el-table :key="tableKey" v-loading="listLoading" :data="filteredData" border fit highlight-current-row style="width: 100%;"
              @sort-change="sortChange">
      <el-table-column label="样地名称" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经度" prop="id" align="center" min-width="10%" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.longitude }}</span>
        </template>
      </el-table-column>
      <el-table-column label="纬度" prop="id" align="center" min-width="10%" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.latitude }}</span>
        </template>
      </el-table-column>

      <el-table-column label="植物种类" prop="id" align="center" min-width="10%" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-if="row.samplePlant && row.samplePlant.length > 0">
            <template v-for="(plant,index) in row.samplePlant">
<!--            <template v-for="(plant,index) in row.samplePlant">-->
              <span>{{ plant+' ' }}</span>
<!--              <span v-if="index !== row.samplePlant.length - 1">,</span>-->
            </template>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="20%" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="checkDetail(row)">
            详细信息
          </el-button>
          <el-button size="mini" @click="updateSample(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" :disabled="btnDeleteDisable" @click="handleDelete(row,$index)">
            删除
          </el-button>

<!--          <el-dialog title="确认删除" :visible.sync="dialogVisible_delete" width="30%" @close="handleClose">-->
<!--            <p>你确定要删除这个项吗？</p>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--              <el-button @click="handleClose">取消</el-button>-->
<!--              <el-button type="danger" @click="handleConfirmDelete">确定</el-button>-->
<!--            </span>-->
<!--          </el-dialog>-->

        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: center;">
      <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="pageLimit"
                  @pagination="pageChange"/>
    </div>

    <!--    <el-dialog :title="'修改第'+dataModify.samplePlotId+'个样地 : '+dataModify.samplePlotName+' 的信息'"-->
    <el-dialog :title="'修改样地 '+dataModify.samplePlotName+' 的信息'" :visible.sync="dialogTableVisibleModify" width="20%" :append-to-body="true">
      <el-form :model="ruleFormModify" :rules="rulesModify" ref="ruleFormModify" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="样地名称" prop="samplePlotName">
          <el-col :span="16">
              <el-input v-model="ruleFormModify.samplePlotName"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitFormModify('ruleFormModify')">保存</el-button>
          <el-button @click="resetFormModify('ruleFormModify')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--    <el-dialog :title="'新建第'+nextTotal+'个样地'"-->
    <el-dialog :title="'新建样地（请填写样地信息）'"
               :visible.sync="dialogTableVisibleCreate" width="20%" :append-to-body="true">
      <el-form :model="ruleFormCreate"  :rules="rulesCreate" ref="ruleFormCreate" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="样地名称" prop="samplePlotName">
           <el-col :span="16">
              <el-input v-model="ruleFormCreate.samplePlotName"></el-input>
           </el-col>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-col :span="16">
          <el-input v-model="ruleFormCreate.longitude"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-col :span="16">
          <el-input v-model="ruleFormCreate.latitude"></el-input>
            </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitFormCreate('ruleFormCreate')">保存</el-button>
          <el-button @click="resetFormCreate('ruleFormCreate')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {createArticle, fetchPv, updateArticle} from '@/api/article'
import waves from '@/directive/waves' // waves directive
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Vue from 'vue';
import {CreateSample, deleteSamplePlot, getSamplePlotList, updateSample} from "@/api/samplePlot";
import {uploadPlantBatch} from "@/api/plant";

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

/********** 弹框专用 ***********/
function rafThrottle(fn) {      // 保证在短时间内多次触发时，只有一次函数执行。
  let locked = false;
  return function (...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame(_ => {
      fn.apply(this, args);
      locked = false;
    });
  };
}

//确保在不同的浏览器环境中，添加和移除事件监听器的操作都能够得到正确的执行，从而保证了跨浏览器的兼容性。
const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();
const isFirefox = function () {
  return !Vue.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i);
};

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';


const colorList = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink', 'black', 'white']
/********** 弹框专用 ***********/
export default {
  name: 'ComplexTable',
  components: {Pagination},
  directives: {waves},
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
      /************* 删除样地 *****************/
      btnDeleteDisable: false,    //删除弹窗是否生效
        dialogVisible_delete: false,    // 确认删除的弹框是否展示
        deleteIndex: null,
        deleteRow: null,               // 确认删除时的临时变量
      /***************************************/
      //dataList表示后端数据接受的变量，然后赋值给list在表格中进行展示
      dataList: [],
      row: {},         // 鼠标停留的那一行存到row中
      sampleNameFilter: '', // 新的样地名称过滤器
      pageLimit: 20,
      page: 1,
      currentList: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      //搜索变量
      searchText: '',
      /************* 修改样地弹窗 ************/
      dialogTableVisibleModify: false,

      dataModify: {samplePlotId: null, samplePlotName: ""},  //{ samplePlotId: 1, samplePlotName: "吐鲁番1" },    待修改的样地数据
      ruleFormModify: {
        samplePlotName: ''
      },
      rulesModify: {
        samplePlotName: [
          {required: true, message: '请输入样地名称', trigger: 'blur'},
        ]
      },
      /**************************************/

      /************* 新建样地弹窗 ************/
      dialogTableVisibleCreate: false,
      ruleFormCreate: {
        samplePlotName: '',
        longitude: '',
        latitude: '',

      },
      rulesCreate: {
        samplePlotName: [
          {required: true, message: '请输入样地名称', trigger: 'blur'},
        ],
        longitude: [
          {required: true, message: '请输入经度', trigger: 'blur'},
        ],
        latitude: [
          {required: true, message: '请输入纬度', trigger: 'blur'}
        ]
      },
      /**************************************/
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
      downloadLoading: false
    }
  },
  computed: {
    nextTotal() {
      return this.total + 1;
    },
    filteredData() {
      if (!this.searchText) {
        return this.list;
        // 判断关键字是否为空，如果为空则显示所有数据
      }
      //const searchText = this.searchText.toLowerCase();
      // 使用 Array.prototype.filter() 方法来过滤数据
      return this.dataList.filter(item => {
        // 判断名称中是否包含关键字（不区分大小写）
        return item.name.toLowerCase().includes(this.searchText.trim().toLowerCase());
      });
    }
  },
  created() {
    this.getList()
  },
  methods: {
    updateSample(row) {
      // 跳到修改页面
      this.dataModify.samplePlotId = row.id;
      this.dataModify.samplePlotName = row.name;
      this.dialogTableVisibleModify = true;
    },
    createSample() {
      // 跳到新建样地
      this.dialogTableVisibleCreate = true;

    },
    /************修改样地信息 **************/
    offPopover() {       // 关闭弹出框
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    submitFormModify(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          /****************/
          let request = {
            samplePlotName: this.ruleFormModify.samplePlotName,
            samplePlotId: this.dataModify.samplePlotId
          }
          updateSample(request).then(res => {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            this.getList();
            this.dialogTableVisibleModify = false
          })
          /**************/
        } else {
          // alert("error submit");
          return false;
        }
      });
    },
    resetFormModify(formName) {      //
      this.$refs[formName].resetFields();
      this.dialogTableVisibleModify = false;      // 关闭页面
    },
    /**********************************/

    /************ 新建样地 **************/
    submitFormCreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let request = {
            samplePlotName: this.ruleFormCreate.samplePlotName,
            longitude: this.ruleFormCreate.longitude,
            latitude: this.ruleFormCreate.latitude
          }
          this.ruleFormCreate.samplePlotName = '';
          this.ruleFormCreate.longitude = '';
          this.ruleFormCreate.latitude = '';
          CreateSample(request).then(res => {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            this.getList();
            this.dialogTableVisibleCreate = false;
          })
        } else {
          // alert("error submit");
          return false;
        }
      });
    },
    resetFormCreate(formName) {
      this.$refs[formName].resetFields();
      this.dialogTableVisibleCreate = false;      // 关闭页面
    },
    /**********************************/
    getList() {
      this.dataList = [];
      this.listLoading = true
      getSamplePlotList().then(response => {
        response['SamplePlotList'].forEach(sampleInfo => {
          let data = {
            id: sampleInfo.samplePlotId,
            name: sampleInfo.samplePlotName,
            longitude: sampleInfo.longitude,
            latitude: sampleInfo.longitude,
            samplePlant: sampleInfo.samplePlant,
            province: sampleInfo.province,
          }
          this.dataList.push(data)
          // console.log(data)
        })
        this.list = this.dataList.slice(0, this.pageLimit)
        this.total = this.dataList.length
        /* 还要访问数据库将植物种类显示出来*/
        /*
         * 第一种方案：根据dataList 中的samplePlotId一个一个查。好处在于可以直接使用 { getSamplePlantList//根据id来查询样地植物列表}，省的再写一个后端函数，坏处是：加载一遍使用的时间太长
         * 第二种方案：改写后端函数getSamplePlotList(),将samplePlot_plant 表中所有元素信息，放到response中
         */
      })
      this.listLoading = false
    },
    checkDetail(row) {
      this.$router.push({path: '/samplePlot/samplePlantInfo', query: {samplePlotId: row.id, samplePlotName: row.name}})
      //通过￥router将此页面的信息传递给植物页面，在植物页面中通过this.id = this.$route.query.samplePlotId获取数据
    },
    pageChange() {
      this.listLoading = true
      this.list = this.dataList.slice((this.page - 1) * this.pageLimit, this.page * this.pageLimit)
      setTimeout(() => {
        this.listLoading = false
      }, 0.2 * 1000)//等待0.2秒
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
        return true
      } else if (timeList[0] === beginYear || timeList[0] === endYear) {
        if (timeList[1] > beginMonth && timeList[1] < endMonth) {
          return true
        } else if (timeList[1] === beginMonth || timeList[1] === endMonth) {
          if (timeList[2] >= beginDate && timeList[2] <= endDate) {
            return true
          }
        }
      } else {
        return false
      }
    },
    nameCompare(name, nameFilter) {
      if (nameFilter === name) return true;
      else return false;
    },
    handleFilterName() {
      console.log(this.timeFilter)
      // console.log(typeof(this.dataList[0].time))

      let tempList = []
      this.dataList.forEach(data => {
        if (this.nameCompare(data.name, this.sampleNameFilter)) {
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
    handleFilter() {
      console.log(this.timeFilter)
      // console.log(typeof(this.dataList[0].time))

      let tempList = []
      this.dataList.forEach(data => {
        if (this.timeCompare(data.time, this.timeFilter)) {
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
    /************* 删除样地的确认弹窗 *************/
    handleDelete(row, index) {
      this.dialogVisible_delete = true;
      this.btnDeleteDisable = true;
      // console.log(row.id)
      this.$confirm('是否确定删除数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSamplePlot(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        //notify消息提示
        // this.$notify({
        //   title: 'Success',
        //   message: 'Delete Successfully',
        //   type: 'success',
        //   duration: 1000
        // })
        this.list.splice(index, 1)
      })
      this.dialogVisible_delete = false;
      this.btnDeleteDisable = false;
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
