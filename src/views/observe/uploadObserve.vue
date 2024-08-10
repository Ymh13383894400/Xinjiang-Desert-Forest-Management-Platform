<template>
  <div class="app-container">
    <el-radio-group v-model="selectMethod">
      <el-radio-button label="single">手动输入</el-radio-button>
      <el-radio-button label="file">上传文件</el-radio-button>
    </el-radio-group>
    <div :key="key" style="margin-top:30px;">
      <div v-show="selectMethod === 'single'">
        <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
          <el-row>
  <!--          <Warning />-->

            <el-col :span="24">
              <el-row>
                <el-col :span="5">
                  <el-form-item label-width="60px" label="观测点:" class="postInfo-container-item">
                    <el-select v-model="observePoint" filterable default-first-option placeholder="选择观测点" @change="handleOption">
                      <el-option v-for="(item,index) in optionList" :key="item.id" :label="item.id" :value="index" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label-width="80px" label="种植作物:" class="postInfo-container-item">
                    <el-input placeholder="种植作物种类" :disabled="true" v-model="planting_structures"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="postInfo-container">
                <el-row type="flex" style="margin: 20px 0;">
                  <el-col :span="2" style="vertical-align: middle; margin: auto 0">
                    <span style="font-size: large; font-weight: bolder; height: 100%">深度10：</span>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px;">
                    <el-form-item label-width="100px" label="土壤湿度:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth10.humidity" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px">
                    <el-form-item label-width="100px" label="土壤电导率:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth10.conductivity" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px">
                    <el-form-item label-width="100px" label="土壤氮含量:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth10.nitrogen_content" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row type="flex" style="margin: 20px 0;">
                  <el-col :span="2" style="vertical-align: middle; margin: auto 0">
                    <span style="font-size: large; font-weight: bolder; height: 100%">深度20：</span>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px;">
                    <el-form-item label-width="100px" label="土壤湿度:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth20.humidity" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px">
                    <el-form-item label-width="100px" label="土壤电导率:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth20.conductivity" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px">
                    <el-form-item label-width="100px" label="土壤氮含量:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth20.nitrogen_content" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row type="flex" style="margin: 20px 0;">
                  <el-col :span="2" style="vertical-align: middle; margin: auto 0">
                    <span style="font-size: large; font-weight: bolder; height: 100%">深度40：</span>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px;">
                    <el-form-item label-width="100px" label="土壤湿度:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth40.humidity" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px">
                    <el-form-item label-width="100px" label="土壤电导率:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth40.conductivity" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px">
                    <el-form-item label-width="100px" label="土壤氮含量:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth40.nitrogen_content" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row type="flex" style="margin: 20px 0;">
                  <el-col :span="2" style="vertical-align: middle; margin: auto 0">
                    <span style="font-size: large; font-weight: bolder; height: 100%">深度60：</span>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px;">
                    <el-form-item label-width="100px" label="土壤湿度:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth60.humidity" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px">
                    <el-form-item label-width="100px" label="土壤电导率:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth60.conductivity" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin: auto 20px">
                    <el-form-item label-width="100px" label="土壤氮含量:" class="postInfo-container-item" style="margin: auto 0">
                      <el-input v-model="postForm.depth60.nitrogen_content" required style="max-width: 100px"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row style="padding: 20px 0;margin-top: 20px">
            <el-col :span="20">
              <el-form-item style="text-align: center;">
                <el-button @click="singleUpload" :disabled="btnDisable">
                  {{btnText}}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div v-show="selectMethod === 'file'">
        <div style="text-align: center">
          <el-upload
              class="upload-demo"
              drag
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              multiple
              style=""
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!--          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </div>
        <div v-show="fileUpload" style="text-align: center">
          <el-button style="margin: 20px 0" @click="handleFileUpload" :disabled="btnFileDisable">{{btnFileText}}</el-button>
          <el-table :data="da">
            <el-table-column prop="planting_structures" label="种植结构" align="center">
            </el-table-column>
            <el-table-column prop="sampling_date" label="采样时间" align="center">
            </el-table-column>
            <el-table-column prop="box_num" label="铝盒编号" align="center">
            </el-table-column>
            <el-table-column prop="depth" label="深度" align="center">
            </el-table-column>
            <el-table-column prop="humidity" label="土壤湿度" align="center">
            </el-table-column>
            <el-table-column prop="conductivity" label="土壤电导率" align="center">
            </el-table-column>
            <el-table-column label="土壤氮含量" align="center">
              <el-table-column prop="nh4" label="NH4-N" align="center">
              </el-table-column>
              <el-table-column prop="no3" label="NO3-N" align="center">
              </el-table-column>
            </el-table-column>
<!--            <el-table-column prop="SPAD" label="SPAD">-->
<!--            </el-table-column>-->
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission'
import MDinput from '@/components/MDinput/index.vue'
import Warning from '@/views/example/components/Warning.vue'
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import $state from '@/store/getters' // 权限判断函数
import { mapState } from 'vuex'
import Upload from '@/components/Upload/SingleImage3'
import { getObserveData, getObserveList, uploadData } from '@/api/observe'
import moment from 'moment'
import { uploadImg } from '@/api/dataView'
import XLSX from 'xlsx'
// import SwitchRoles from './components/SwitchRoles'
// import switchRoles from '@/views/permission/components/SwitchRoles.vue'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  name: 'DirectivePermission',
  components: { Warning, MDinput, Upload },
  // components: { SwitchRoles },
  directives: { permission },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      key: 1, // 为了能每次切换权限的时候重新初始化指令
      selectMethod: 'single',
      optionList: [
        {
          id:1,
          box_num:1,
          planting_structures:'玉米'
        },{
          id:2,
          box_num:2,
          planting_structures:'小麦'
        },{
          id:3,
          box_num:3,
          planting_structures:'棉花'
        },{
          id:4,
          box_num:4,
          planting_structures:'番茄'
        },{
          id:5,
          box_num:5,
          planting_structures:'玉米'
        }
      ],
      planting_structures: '',
      observePoint: 0,
      da:[],
      fileUpload:false,
      // postForm: Object.assign({}, defaultForm),
      postForm: {
        box_num: '',
        depth10: {
          humidity: '',
          conductivity: '',
          nitrogen_content: ''
        },
        depth20: {
          humidity: '',
          conductivity: '',
          nitrogen_content: ''
        },
        depth40: {
          humidity: '',
          conductivity: '',
          nitrogen_content: ''
        },
        depth60: {
          humidity: '',
          conductivity: '',
          nitrogen_content: ''
        }
      },
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      btnDisable: false,
      btnText: '提交',
      btnFileDisable: false,
      btnFileText: '上传'
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    },
    ...mapState({
      observeList: state => state.observeList
    })
    // ...mapState(['observeList'])
  },
  created() {
    // this.optionList = this.observeList
    // for (let i = 1; i < 87; i++) {
    //   this.optionList.push(i)
    // }
    getObserveList().then(response => {
      this.optionList = response.coords
      console.log(this.optionList)
    })
  },
  methods: {
    handleOption() {
      console.log(this.optionList[this.observePoint].id)
      getObserveData(this.optionList[this.observePoint].id).then(response => {
        console.log(response)
        this.data = response
        this.planting_structures = response.planting_structures
        // this.postForm.box_num = response.box_num
        this.postForm.long = this.optionList[this.observePoint].long
        this.postForm.lat = this.optionList[this.observePoint].lat
      })
    },
    singleUpload(){
      this.$confirm('是否确定提交数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnText = '正在提交...'
        this.btnDisable = true
        var myDate = new Date;
        var year = myDate.getFullYear(); //获取当前年
        var mon = myDate.getMonth() + 1; //获取当前月
        var date = myDate.getDate(); //获取当前日
        let nowDate = year + '-' + mon + '-' + date
        let uploadList = [
          {
            depth: '10',
            planting_structures: this.planting_structures,
            // box_num: this.postForm.box_num,
            sampling_date: nowDate,
            long: this.postForm.long,
            lat: this.postForm.lat,
            humidity: this.postForm.depth10.humidity,
            conductivity: this.postForm.depth10.conductivity,
            nitrogen_content: this.postForm.depth10.nitrogen_content
          },{
            depth: '20',
            planting_structures: this.planting_structures,
            // box_num: this.postForm.box_num,
            sampling_date: nowDate,
            long: this.postForm.long,
            lat: this.postForm.lat,
            humidity: this.postForm.depth20.humidity,
            conductivity: this.postForm.depth20.conductivity,
            nitrogen_content: this.postForm.depth20.nitrogen_content
          },{
            depth: '40',
            planting_structures: this.planting_structures,
            // box_num: this.postForm.box_num,
            sampling_date: nowDate,
            long: this.postForm.long,
            lat: this.postForm.lat,
            humidity: this.postForm.depth40.humidity,
            conductivity: this.postForm.depth40.conductivity,
            nitrogen_content: this.postForm.depth40.nitrogen_content
          },{
            depth: '60',
            planting_structures: this.planting_structures,
            // box_num: this.postForm.box_num,
            sampling_date: nowDate,
            long: this.postForm.long,
            lat: this.postForm.lat,
            humidity: this.postForm.depth60.humidity,
            conductivity: this.postForm.depth60.conductivity,
            nitrogen_content: this.postForm.depth60.nitrogen_content
          }
        ]
        uploadData({ file_list: uploadList }).then(response => {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.btnText = '提交'
          this.btnDisable = false
        })
      })
    },
    checkPermission,
    handleRolesChange() {
      this.key++
    },
    handleChange(file, fileList){
      this.fileTemp = file.raw;
      if(this.fileTemp){
        if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            || (this.fileTemp.type == 'application/vnd.ms-excel')){
          this.importfxx(this.fileTemp);
        } else {
          this.$message({
            type:'warning',
            message:'附件格式错误，请删除后重新上传！'
          })
        }
      } else {
        this.$message({
          type:'warning',
          message:'请上传附件！'
        })
      }
    },
    // 超出最大上传文件数量时的处理方法
    handleExceed(){
      this.$message({
        type:'warning',
        message:'超出最大上传文件数量的限制！'
      })
      return;
    },
    // 移除文件的操作方法
    handleRemove(file,fileList){
      this.fileTemp = null
    },
    complexTable(data){
      let output = []
      let temList = []
      data[0].forEach((item, index) => {
        if (item !== '' && item !== '土壤氮含量') {
          // output[item] = []
          temList.push(item)
        }
      })
      data[1].forEach(item => {
        if (item !== '') {
          // output[item] = []
          temList.push(item)
        }
      })
      console.log(temList)
      data.forEach((da, index) => {
        if(index !== 0 && index !== 1){
          let tem = {}
          da.forEach((item, index) => {
            // output.push({temList[index]: item})
            tem[temList[index]] = item
          })
          output.push(tem)
        }
      })
      return output
    },
    importfxx(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据

      this.file = event.currentTarget.files[0];

      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;

      var reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata = [];
        var reader = new FileReader();
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          //此处引入，用于解析excel
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64",
              cellDates: true
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary",
              cellDates: true
            });
          }
          wb.SheetNames.forEach(name => {
            let tem_output = XLSX.utils.sheet_to_json(wb.Sheets[name], {header: 1, defval:''})
            console.log(tem_output)
            tem_output = _this.complexTable(tem_output)
            console.log(tem_output)
            outdata = outdata.concat(tem_output)
          })
          // outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          // console.log(outdata)
          // outdata = _this.complexTable(outdata)
          // console.log(outdata)
          //outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
          //此处可对数据进行处理
          let arr = []
          let tempObj = {}
          outdata.map(v => {
            // console.log(v['采样时间'] !== undefined)
            if(v['采样时间'] !== ''){
              // arr.push(tempObj)
              tempObj = {}
              tempObj.long = v['经度']
              tempObj.lat = v['纬度']
              tempObj.planting_structures = v['种植结构']
              tempObj.sampling_date = v['采样时间']
              tempObj.box_num = v['点位编号']
              tempObj.SPAD = v['SPAD']
              // tempObj.deepList = []
            }
            let obj = {}
            obj.planting_structures = tempObj.planting_structures
            obj.sampling_date = moment(tempObj.sampling_date).format('YYYY-MM-DD')
            obj.box_num = tempObj.box_num
            obj.long = tempObj.long
            obj.lat = tempObj.lat
            obj.depth = v['深度']
            obj.humidity = v['土壤湿度']
            obj.conductivity = v['土壤电导率']
            obj.nitrogen_content = v['土壤氮含量']
            obj.nh4 = v['NH4-N']
            obj.no3 = v['NO3-N']
            obj.SPAD = tempObj.SPAD
            arr.push(obj)
            // tempObj.deepList.push(obj)
          })
          _this.da=arr;
          // this.setTabelRowSpan(_this.da, ['plant', 'time', 'id'], {})
          console.log(_this.da)
          _this.dalen=arr.length;
          _this.fileUpload = true
          return arr;
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },

    handleFileUpload(){
      // uploadData({ file_list: this.da }).then(response => {
      //   console.log(response)
      // })
      this.$confirm('是否确定提交数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnFileText = '正在上传...'
        // this.btnFileDisable = true
        uploadData({ file_list: this.da }).then(response => {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.btnFileText = '上传'
          this.btnFileDisable = false
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }
  ::v-deep .permission-sourceCode {
    margin-left: 15px;
  }
  ::v-deep .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>

