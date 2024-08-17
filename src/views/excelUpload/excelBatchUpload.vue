<template>
  <div class="app-container">
    <!-- <el-radio-group v-model="selectMethod">
      <el-radio-button label="file">上传文件</el-radio-button>
    </el-radio-group> -->
    <div :key="key" style="margin-top:30px;">
      <el-text style="font-size: 20px;">{{this.name}}</el-text>
      <div style="text-align: center">
        <el-upload class="upload-demo" drag :on-change="handleChange" :on-remove="handleRemove"
          :on-exceed="handleExceed" multiple style=""> <!-- drag:是否启用拖拽上传,
                  on-change:文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用。
                  on-remove:文件列表移除文件时的钩子
                  on-exceed:文件超出个数限制时的钩子
              -->
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <div style="text-align: center">
        <el-button type="primary" style="margin: 20px 0 " @click="handleFileUpload"
          :disabled="btnFileDisable">{{btnFileText}}</el-button>
        <el-button class="cancel-button" style="margin: 20px 0;margin-left: 10px;" @click="returnPlantInfo"
          :disabled="btnFileDisable">{{"返回"}}</el-button>
      </div>
      <div v-show="fileUpload" style="text-align: center">
        <!--          <el-button style="margin: 20px 0" @click="returnPlantInfo" :disabled="btnFileDisable">{{btnFileText}}</el-button>-->
        <el-table :data="da"> <!-- 先展示excel的数据，再显示上传按钮-->
          <el-table-column prop="plantID" label="植物编号" align="center"> <!-- prop:对应列内容的字段名 , label : 显示的标题 -->
          </el-table-column>
          <el-table-column prop="plantType" label="植物种类" align="center">
          </el-table-column>
          <el-table-column prop="long" label="经度" align="center">
          </el-table-column>
          <el-table-column prop="lat" label="纬度" align="center">
          </el-table-column>
          <el-table-column prop="height" label="高度" align="center">
          </el-table-column>
          <el-table-column prop="diameter" label="地径" align="center">
          </el-table-column>
          <el-table-column prop="maxCrownWidth" label="最大冠幅" align="center">
          </el-table-column>
          <el-table-column prop="minCrownWidth" label="最小冠幅" align="center">
          </el-table-column>
          <el-table-column prop="samplePlotID" label="样地ID" align="center">
          </el-table-column>
          <el-table-column prop="samplePlotSmall" label="小样地ID" align="center">
          </el-table-column>
          <el-table-column prop="notes" label="备注" align="center">
          </el-table-column>
        </el-table>
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
  import { uploadPlantBatch } from '@/api/plant'
  import moment from 'moment'
  import { uploadImg } from '@/api/dataView'
  import XLSX from 'xlsx'


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
    name: 'uploadBatchPlantInfo',    // 指令许可
    components: { Warning, MDinput, Upload },
    // components: { SwitchRoles },
    directives: { permission },
    data () {
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
        //上个页面传回来的id
        id: 0,
        name: '',
        key: 1, // 为了能每次切换权限的时候重新初始化指令
        selectMethod: 'file',
        fileUpload: false,   // 文件上传后的展示（包括展示解析的excel文件和上传按钮）
        btnFileDisable: false,     // 按钮是否禁用状态
        btnFileText: '上传',       // 按钮上的文字
        da: [],           // 展示excel的表格
        fileTemp: '',
        loading: false,
      }
    },
    created () {
      this.getList()
    },
    methods: {
      getList () {
        this.id = this.$route.query.samplePlotId;
        this.name = this.$route.query.samplePlotName;
      },
      handleChange (file, fileList) {
        this.fileTemp = file.raw;
        if (this.fileTemp) {
          if ((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            || (this.fileTemp.type == 'application/vnd.ms-excel')) {
            this.importfxx(this.fileTemp);
          } else {
            this.$message({
              type: 'warning',
              message: '附件格式错误，请删除后重新上传！'
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请上传附件！'
          })
        }
      },
      // 超出最大上传文件数量时的处理方法
      handleExceed () {
        this.$message({
          type: 'warning',
          message: '超出最大上传文件数量的限制！'
        })
        return;
      },
      // 移除文件的操作方法
      handleRemove (file, fileList) {
        this.fileTemp = null
      },
      handleFileUpload () {        // 上传从excel解析出来的数据到后端
        this.$confirm('是否确定提交数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnFileText = '正在上传...'
          uploadPlantBatch({ file_list: this.da }).then(response => {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            this.btnFileText = '上传'
            this.btnFileDisable = false
          })
        })
      },
      returnPlantInfo () {
        this.$router.push({ path: '/samplePlot/samplePlantInfo', query: { samplePlotId: this.id, samplePlotName: this.name } })
      },
      handleRolesChange () {
        this.key++
      },
      checkPermission,
      complexTable (data) {
        let output = []      // 用于存储最终的输出对象数组
        let temList = []     // 用于收集用作对象键的元素
        data[0].forEach((item, index) => {
          // 将标题行添加到 temList 数组中，这些元素将成为后续对象的键
          if (item !== '') {
            // output[item] = []
            temList.push(item)
          }
        })
        console.log("/*********** 查看excel第一行 ************/ ")
        console.log(temList)
        console.log("/*********** ************/ ")
        data.forEach((da, index) => {  // 主循环，处理数据行
          if (index !== 0) {  // 除了第一行和第二行
            let tem = {}    // 对于每一行 da，创建一个空对象 tem
            da.forEach((item, index) => {
              // 再次遍历该行的每个元素 item，将其与 temList 中对应的键关联起来，然后将这个对象 tem 添加到 output 数组中
              tem[temList[index]] = item
            })
            output.push(tem)
          }
        })
        return output
      },
      importfxx (obj) {
        let _this = this;
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];

        var rABS = false;    //是否将文件读取为二进制字符串
        var f = this.file;

        var reader = new FileReader();
        FileReader.prototype.readAsBinaryString = function (f) {
          var binary = "";
          var rABS = false; //是否将文件读取为二进制字符串
          var pt = this;
          var wb;           //读取完成的数据
          var outdata = [];
          var reader = new FileReader();
          reader.onload = function (e) {
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
            wb.SheetNames.forEach(name => {      // 遍历 Excel 文件的每个工作表
              let tem_output = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: '' })
              // XLSX.utils.sheet_to_json 将每个工作表转换为 JSON 格式的数组 tem_output
              // header: 1 指定了 Excel 表格的第一行作为 JSON 数组的键（即对象的属性）
              // defval:'' 指定了当 Excel 单元格中没有值时，默认使用的值 空
              console.log(tem_output)
              tem_output = _this.complexTable(tem_output)   // 通过 _this.complexTable 方法进一步处理数据
              console.log(tem_output)
              outdata = outdata.concat(tem_output)    // 将 tem_output 数组中的所有元素追加到 outdata 数组的末尾，并返回一个新的数组
            })
            // outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
            //此处可对数据进行处理
            let arr = []
            let tempObj = {}
            outdata.map(v => {
              // console.log(v['采样时间'] !== undefined)
              if (v['植物编号'] !== '') {
                // arr.push(tempObj)
                tempObj = {}
                tempObj.plantID = v['植物编号']
                tempObj.long = v['经度']
                tempObj.lat = v['纬度']
                tempObj.height = v['高度']
                tempObj.plantType = v['种类']
                tempObj.sampling_date = v['采样时间']
                tempObj.diameter = v['地径']
                tempObj.minCrownWidth = v['最小冠幅']
                tempObj.maxCrownWidth = v['最大冠幅']
                tempObj.samplePlotID = v['样地ID']
                tempObj.samplePlotSmall = v['小样地ID']
                tempObj.notes = v['备注']

              }
              arr.push(tempObj)
            })
            _this.da = arr;
            console.log(_this.da)
            _this.dalen = arr.length;
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
    }
  }
</script>

<style lang="scss" scoped>
  .cancel-button {
    background-color: #a7a7a7;
    /* 设置按钮背景色为蓝色 */
    color: #ffffff;
    /* 设置取消按钮文字颜色为灰色 */
  }
</style>
