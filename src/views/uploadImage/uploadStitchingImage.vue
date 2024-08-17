<template>
  <div class="app-container">
    <el-radio-group v-model="selectPage">
      <el-radio-button label="uploadStitchingImage">上传已拼接图像</el-radio-button>
      <el-radio-button label="uploadUnstitchingImage">上传未拼接图像</el-radio-button>
    </el-radio-group>
    <div :key="key" style="margin-top:30px;">
      <div v-show="selectPage === 'uploadStitchingImage'">
        <div class="center-container">
          <div>
            <el-form style="width: 600px">
              <!-- 样地名称首先要从后端申请得到（在create生命周期中写），然后列举出来 -->
              <el-form-item label-width="100px" label="样地名称:">
                <!-- <el-input v-model="sampleName" placeholder="请选择样地" style="width: 220px"></el-input> -->
                <el-select v-model="sampleName" placeholder="请选择样地" style="width: 220px">
                  <el-option v-for="item in sampleNameList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label-width="100px" label="拍摄设备:">
                <!-- <el-input v-model="sampleName" placeholder="请选择样地" style="width: 220px"></el-input> -->
                <el-select v-model="UAV" placeholder="请选择样地" style="width: 220px">
                  <el-option v-for="item in UAVList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-button @click="deviceInfo" type="success"  style="margin-left: 20px;">查看设备信息</el-button>
              </el-form-item>

              <el-form-item label-width="100px" label="拍摄时间:">
                <el-date-picker v-model="time" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>

              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="100px" label="图像范围:">
                    <el-select v-model="sampleLength" filterable allow-create placeholder="请选择或输入X">
                      <el-option v-for="item in sizeList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-select v-model="sampleWidth" filterable allow-create style="margin-left: 20px;"
                    placeholder="请选择或输入Y">
                    <el-option v-for="item in sizeList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <!--  列表列出常见的高度，也可以自定义高度-->
              <el-form-item label-width="100px" label="拍摄高度:">
                <el-select v-model="sampleAltitude" filterable allow-create placeholder="请选择或输入拍摄高度">
                  <el-option v-for="item in sampleAltitudeList" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

              </el-form-item>

              <el-form-item label-width="100px" label="图像类型:">
                <!-- <el-input v-model="sampleName" placeholder="整体图像请输入0 ，部分图像请输入1" style="width: 300px"></el-input> -->
                <el-select v-model="sampleIsPart" placeholder="整体或部分" style="width: 220px">
                  <el-option v-for="item in sampleIsPartList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>


              <el-form-item label-width="100px" label="tif文件:" class="upload-item">
                <el-upload class="upload-demo" drag :on-change="handleChange" :on-remove="handleRemove"
                  :on-exceed="handleExceed" :auto-upload="false" multiple style="">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </el-form-item>
              <el-form-item label-width="100px">
                <el-button @click="uploadstitchingImage" :disabled="btnDisable"
                  class="custom-button">{{btnText}}</el-button>
                <el-button @click="cancel" class="cancel-button">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <div v-show="selectPage === 'uploadUnstitchingImage'">
        <div class="center-container">
          <div>
            <el-form style="width: 600px">
              <!-- 样地名称首先要从后端申请得到（在create生命周期中写），然后列举出来 -->
              <el-form-item label-width="100px" label="样地名称:">
                <!-- <el-input v-model="sampleName" placeholder="请选择样地" style="width: 220px"></el-input> -->
                <el-select v-model="sampleName" placeholder="请选择样地" style="width: 220px">
                  <el-option v-for="item in sampleNameList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label-width="100px" label="拍摄设备:">
                <!-- <el-input v-model="sampleName" placeholder="请选择样地" style="width: 220px"></el-input> -->
                <el-select v-model="UAV" placeholder="请选择样地" style="width: 220px">
                  <el-option v-for="item in UAVList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-button @click="deviceInfo" type="success"  style="margin-left: 20px;">查看设备信息</el-button>
              </el-form-item>

              <el-form-item label-width="100px" label="拍摄时间:">
                <el-date-picker v-model="time" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>

              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="100px" label="图像范围:">
                    <el-select v-model="sampleLength" filterable allow-create placeholder="请选择或输入X">
                      <el-option v-for="item in sizeList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-select v-model="sampleWidth" filterable allow-create style="margin-left: 20px;"
                    placeholder="请选择或输入Y">
                    <el-option v-for="item in sizeList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <!--  列表列出常见的高度，也可以自定义高度-->
              <el-form-item label-width="100px" label="拍摄高度:">
                <el-select v-model="sampleAltitude" filterable allow-create placeholder="请选择或输入拍摄高度">
                  <el-option v-for="item in sampleAltitudeList" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

              </el-form-item>

              <el-form-item label-width="100px" label="图像类型:">
                <!-- <el-input v-model="sampleName" placeholder="整体图像请输入0 ，部分图像请输入1" style="width: 300px"></el-input> -->
                <el-select v-model="sampleIsPart" placeholder="整体或部分" style="width: 220px">
                  <el-option v-for="item in sampleIsPartList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label-width="100px" label="拼接算法:">
                <el-select v-model="sampleSelectAlgorithm" filterable allow-create placeholder="请选择或输入拼接算法">
                  <el-option v-for="item in sampleSelectAlgorithmList" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label-width="100px" label="tif文件:" class="upload-item">
                <el-upload class="upload-demo" drag :on-change="handleFileChange" :on-remove="handleRemove"
                  :on-exceed="handleExceed" :auto-upload="false" multiple style="">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </el-form-item>

              <el-form-item label-width="100px">
                <el-button @click="uploadUnstitchingImage" :disabled="btnDisable"
                  class="custom-button">{{btnText}}</el-button>
                <el-button @click="cancel" class="cancel-button">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import {uploadStitchingImg, uploadUnstitchingImg, hergeImg} from '@/api/uploadStichingImage'
import {getSamplePlotList} from "@/api/samplePlot";
import {getUAVList} from "@/api/device"
import SparkMD5 from 'spark-md5'

export default {
  name: 'uploadStichingImage',
  data() {
    return {
      // promise: {
      //   HASH: '',
      //   chunkNum: 0,
      //   chunks: []
      // },
      tifFiles: [],
      sampleName: '',
      UAV: '',
      len: 0,
      time: '',
      sampleLength: '',
      sampleWidth: '',
      sampleAltitude: '',
      sampleIsPart: '',
      tifFilesInfo: [],
      test: '',

      // imageType,
      // rgbBand,
      selectAlgorithm: 0,

      btnText: '上传',
      btnTextCancel: '取消',
      btnDisable: false,

      sampleSelectAlgorithm: '',
      sampleNameList: [],
      UAVList: [],
        sampleAltitudeList: [{
          value: '20',
          label: '20'
        }, {
          value: '30',
          label: '30'
        }, {
          value: '50',
          label: '50'
        }],
        sizeList: [{
          value: '20',
          label: '20'
        }, {
          value: '40',
          label: '40'
        }, {
          value: '100',
          label: '100'
        }],
        sampleIsPartList: [{
          value: 'true',
          label: '整体'
        }, {
          value: 'false',
          label: '部分'
        }],
        sampleSelectAlgorithmList: [{
          value: '0',
          label: '算法0'
        }, {
          value: '1',
          label: '算法1'
        }, {
          value: '2',
          label: '算法2'
        }, {
          value: '3',
          label: '算法3'
        }
        ],
        selectPage: 'uploadStitchingImage',
        key: 1
    }
  },
  created(){
      this.getList()
  },
  methods: {
    handleChange(file, fileList) {
      let isTif = ['image/tiff', 'image/tif'].includes(file.raw.type);
      if (isTif) {
        var reader = new FileReader();
        reader.readAsDataURL(file.raw); // 一定要传入file格式
        reader.onload = () => {
          this.tifFile = reader.result
        }
        // this.tifFile = file.raw
      } else {
        this.$message({
          type: 'warning',
          message: '附件格式错误，请删除后重新上传！'
        })
      }
    },
    uploadstitchingImage() {
      // console.log(this.tifFile)
      this.$confirm('是否确定上传文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnText = '正在上传...'
        this.btnDisable = true
        let request = {
          file: this.tifFile,
          shotTime: this.time,
          samplePlotName: this.sampleName,
          imageAreaX: this.sampleWidth,
          imageAreaY: this.sampleLength,
          shotHeight: this.sampleAltitude,
          isAllPlot: this.sampleIsPart,
          selectAlgorithm: this.selectAlgorithm
        }
        uploadStitchingImg(request).then(res => {
          // console.log(res)
          console.log("123")
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.btnText = '上传'
          this.btnDisable = false
        })
      })
    },

    getList() {
      getSamplePlotList().then(response => {
        response['SamplePlotList'].forEach(sampleInfo =>{
          let data = {
            value: sampleInfo.samplePlotId,
            label: sampleInfo.samplePlotName,
          }
          this.sampleNameList.push(data)
        })
      })
      getUAVList().then(response => {
        response['list'].forEach(UAVInfo => {
          let tmp;
          if(UAVInfo.UAVCamera === '集成相机') tmp = '1';
          else tmp = '2';
          let data = {
            value: UAVInfo.UAVBrand + ' ' + UAVInfo.UAVType + ' ' + tmp,
            label: UAVInfo.UAVBrand + '' + UAVInfo.UAVType + ' ' + UAVInfo.UAVCamera
          }
          this.UAVList.push(data)
        })
      })
    },
    async handleFileChange(file, fileList) {
      for(let index = 0;index < fileList.length;index++){
        let tifFile =
          {
            HASH: '',
            chunkNum: 0,
            chunks: []
          }
        let reader = new FileReader();
        reader.readAsDataURL(fileList[index].raw); // 一定要传入file格式
        reader.onload = () => {
          let fileRaw = reader.result

          let fileHash = this.getHash(fileRaw);
          // fileHash = this.getHash(spark,fileRaw);
          console.log('hash = ' + fileHash)
          if (this.checkHash(fileHash)) {
            alert("文件已存在，秒传成功！");
            this.uploadProgress = 100; // 直接设置进度为100%
            return;
          }

          //开始对第i个文件进行切片并上传
          const chunkSize = 1024 * 1024 * 50; // 100MB
          console.log(fileList[index].size)
          const chunkNum = Math.ceil(fileList[index].size / chunkSize);
          console.log(chunkNum)
          tifFile['chunkNum'] = chunkNum;
          tifFile['HASH'] = fileHash;
          console.log("#######")

          for (let i = 0; i < chunkNum; i++) {
            console.log("当前为第" + index + "个文件,切片为第" + i + "个")
            const start = i * chunkSize;
            let chunk = '';
            if (i === chunkNum - 1) chunk = fileRaw.slice(start, fileRaw.size);
            else chunk = fileRaw.slice(start, start + chunkSize);
            tifFile['chunks'].push(chunk);
          }
          this.tifFiles.push(tifFile)
          // this.notifyServerToMerge(fileHash);
          console.log("*********")
        }
      }
    },
    getHash(file){
      return SparkMD5.hash(file)
    },
    checkHash(hash){
      return 0;
    },
    uploadUnstitchingImage() {
      // console.log(this.tifFile)
      this.$confirm('是否确定上传文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnText = '正在上传...'
        this.btnDisable = true
        // this.uploadFile()

        for(let i = 0;i < this.tifFiles.length;i++) {
          let num = this.tifFiles[i]['chunkNum']
          for (let j = 0; j < num; j++) {
            this.uploadChunk(this.tifFiles[i]['chunks'][j], i, num, this.tifFiles[i]['HASH']);
            console.log(j)
            console.log("完成第"+j+"个")
          }
        }

        console.log("###################")
        hergeImg("123").then( res =>{
          this.$message({
            type: 'success',
            message: '上传成功'
          })
        })
        this.btnText = '上传'
        this.btnDisable = false
        // uploadImg("123").then(res => {
        //   console.log("完全结束123")
        //   this.$message({
        //     type: 'success',
        //     message: '上传成功'
        //   })
        //   this.btnText = '上传'
        //   this.btnDisable = false
        // })
      })
    },
    uploadChunk(chunk, index, totalChunks,hash) {
      let data = {
        HASH : hash,
        file : chunk,
        index : index,
        totalChunk : totalChunks
      }
      // const formData = new FormData();
      // formData.append('HASH',hash)
      // formData.append('file', chunk);
      // formData.append('index', index);
      // formData.append('totalChunks', totalChunks);
      console.log("hash = "+data['HASH'])
      uploadUnstitchingImg(data)
      console.log("###"+"wan")
        // 实现切片上传逻辑，发送 HTTP 请求将 chunk 上传到服务器
        // 可以使用 Axios 或其他 HTTP 请求库发送请求
        // 这里应该包括上传进度的监听和处理
    },
    notifyServerToMerge(hash){
      return "成功"
    },
    deviceInfo(){
      this.$router.push({path: '/device/device'})
    }
  }
}
</script>

<style scoped lang="scss">
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* 垂直居中对齐 */
}

.custom-button {
  background-color: #409EFF;
  /* 设置按钮背景色为蓝色 */
  color: #fff;
  /* 设置文字颜色为白色 */

}

.cancel-button {
  background-color: #a7a7a7; /* 设置按钮背景色为蓝色 */
  color: #ffffff; /* 设置取消按钮文字颜色为灰色 */
}
</style>


<!--大文件切片上传博客 https://blog.csdn.net/qq_42696432/article/details/137345958-->
