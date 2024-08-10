<template>
  <div class="app-container">
    <!--    <el-radio-group v-model="selectPage">-->
    <!--      <el-radio-button label="UAVDevice">无人机设备管理</el-radio-button>-->
    <!--      <el-radio-button label="cameraDevice">相机设备管理</el-radio-button>-->
    <!--    </el-radio-group>-->
    <div :key="key" style="margin-top:30px;">
      <div class="el-container">
        <div>
          <el-form ref="UAVForm" model="UAVFormModel" style="width: 600px">
            <!-- 样地名称首先要从后端申请得到（在create生命周期中写），然后列举出来 -->
            <el-form-item prop="UAVFormModel" label-width="100px" label="无人机品牌:">
              <!-- <el-input v-model="sampleName" placeholder="请选择样地" style="width: 220px"></el-input> -->
              <el-select v-model="UAVBrand" filterable allow-create placeholder="请输入或选择，如：大疆"
                         style="width: 220px">
                <el-option v-for="item in this.brands" :key="item.brand" :label="item.brand" :value="item.brand">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="100px" label="无人机型号:">
              <el-input v-model="UAVType" placeholder="请输入，如：TY350" style="width: 220px"></el-input>
              <!--                <el-select v-model="sampleName" placeholder="请输入，如：TY350" style="width: 220px">-->
              <!--                  <el-option v-for="item in sampleNameList" :key="item.value" :label="item.label" :value="item.value">-->
              <!--                  </el-option>-->
              <!--                </el-select>-->
            </el-form-item>


            <!--              <el-row>-->
            <!--                <el-col :span="12">-->
            <!--                  <el-form-item label-width="100px" label="图像范围:">-->
            <!--                    <el-select v-model="sampleLength" filterable allow-create placeholder="请选择或输入X">-->
            <!--                      <el-option v-for="item in sizeList" :key="item.value" :label="item.label" :value="item.value">-->
            <!--                      </el-option>-->
            <!--                    </el-select>-->
            <!--                  </el-form-item>-->
            <!--                </el-col>-->

            <!--                <el-col :span="12">-->
            <!--                  <el-select v-model="sampleWidth" filterable allow-create style="margin-left: 20px;"-->
            <!--                             placeholder="请选择或输入Y">-->
            <!--                    <el-option v-for="item in sizeList" :key="item.value" :label="item.label" :value="item.value">-->
            <!--                    </el-option>-->
            <!--                  </el-select>-->
            <!--                </el-col>-->
            <!--              </el-row>-->

            <el-form-item label-width="100px" label="相机类型:">
              <el-radio v-model="radioCamera" label="1" border size="medium">集成相机</el-radio>
              <el-radio v-model="radioCamera" label="2" border size="medium">改装相机</el-radio>
              <!--                <div style="margin-top: 20px"></div>-->
            </el-form-item>

            <el-form-item label-width="100px" label="相机分辨率:">
              <el-input v-model="resolution" placeholder="请输入相机分辨率" style="width: 150px"></el-input>
              <!--                <el-select v-model="sampleIsPart" placeholder="整体或部分" style="width: 220px">-->
              <!--                  <el-option v-for="item in sampleIsPartList" :key="item.value" :label="item.label" :value="item.value">-->
              <!--                  </el-option>-->
              <!--                </el-select>-->
            </el-form-item>

            <el-form-item label-width="100px" label="图片类型:">
              <!--                 <el-input v-model="sampleName" placeholder="整体图像请输入0 ，部分图像请输入1" style="width: 100px"></el-input>-->
              <el-select v-model="imageType" placeholder="选择成像类型" style="width: 150px">
                <el-option v-for="item in ['可见光', '红外光', '多光谱' ]" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="100px">
              <el-button @click="addUAVInfo" :disabled="btnDisable" style="width: 80px"
                         class="custom-button">{{ btnText }}
              </el-button>
              <el-button @click="cancel" class="cancel-button" style="width: 80px">取消</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
                  style="width: 100%;" @sort-change="sortChange">
          <el-table-column label="序号" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="无人机品牌" prop="id" align="center" min-width="5%"
                           :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.brand }}</span>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="集成设备" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.camera }}</span>
            </template>
          </el-table-column>
          <el-table-column label="图像类型" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.image }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="10%" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <!--                <el-button type="primary" size="mini" @click="checkDetail(row)">-->
              <!--                  详细信息-->
              <!--                </el-button>-->
              <el-button size="mini" @click="updateUAV(row)">
                修改
              </el-button>
              <el-button size="mini" type="danger" @click="deleteUAV(row,$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>


<script>
// import {hergeImg, uploadStitchingImg, uploadUnstitchingImg} from '@/api/uploadStichingImage'
// import {getSamplePlotList} from "@/api/samplePlot";
import {createArticle, fetchPv, updateArticle} from '@/api/article'
import waves from '@/directive/waves' // waves directive
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Vue from 'vue';
import {addUAV, getUAVList} from "@/api/device";
import SparkMD5 from 'spark-md5'

export default {
  name: 'device',
  data() {
    return {
      UAVBrand: '',     //品牌
      UAVType: '',      //型号
      brands: [],       //以添加的品牌
      resolution: '',   //分辨率
      imageType: '',      //图片类型


      btnText: '添加',
      btnTextCancel: '取消',
      btnDisable: false,

      //选择相机
      radioCamera: '1',

      //表格信息
      dataList: null,
      tableKey: 0,
      listLoading: true,
      list: null,

      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },

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
    addUAVInfo() {
      let request = {
        brand: this.UAVBrand,     //品牌
        type: this.UAVType,      //型号
        camera: this.radioCamera, //成像设备是否集成
        resolution: this.resolution,   //分辨率
        imageType: this.imageType,      //图片类型
      }
      this.$refs['UAVForm'].validate((valid) => {
        addUAV(request).then(res => {
          // console.log(res)
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          // this.btnText = '上传'
          this.btnDisable = false
        })
      })
    },

    getList() {
      this.dataList = [];
      this.brands = [];
      this.listLoading = true
      getUAVList().then(response => {
        let tmpBrands = {};
        let num = 0;
        response['list'].forEach(UVAListInfo => {
          num++;
          let data = {
            id: num,
            // id: UVAListInfo.UAVId,
            brand: UVAListInfo.UAVBrand,
            type: UVAListInfo.UAVType,
            camera: UVAListInfo.UAVCamera,
            image: UVAListInfo.imageType,
          }
          this.dataList.push(data)
          //添加品牌
          if (data.brand !== null) {
            if (tmpBrands[data.brand] !== 1) {
              this.brands.push(data);
              tmpBrands[data.brand] = 1;
            }
          }
        })
        // console.log(this.dataList)
        // this.list = this.dataList.slice(0, 7)
        // this.list = this.dataList.slice(0, this.pageLimit + 1)
        this.list = this.dataList
        // this.total = 7
        this.total = this.dataList.length
      })
      this.listLoading = false
    },
    async handleFileChange(file, fileList) {
      for (let index = 0; index < fileList.length; index++) {
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
    getHash(file) {
      return SparkMD5.hash(file)
    },
    checkHash(hash) {
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

        for (let i = 0; i < this.tifFiles.length; i++) {
          let num = this.tifFiles[i]['chunkNum']
          for (let j = 0; j < num; j++) {
            this.uploadChunk(this.tifFiles[i]['chunks'][j], i, num, this.tifFiles[i]['HASH']);
            console.log(j)
            console.log("完成第" + j + "个")
          }
        }

        console.log("###################")
        hergeImg("123").then(res => {
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
    uploadChunk(chunk, index, totalChunks, hash) {
      let data = {
        HASH: hash,
        file: chunk,
        index: index,
        totalChunk: totalChunks
      }
      // const formData = new FormData();
      // formData.append('HASH',hash)
      // formData.append('file', chunk);
      // formData.append('index', index);
      // formData.append('totalChunks', totalChunks);
      console.log("hash = " + data['HASH'])
      uploadUnstitchingImg(data)
      console.log("###" + "wan")
      // 实现切片上传逻辑，发送 HTTP 请求将 chunk 上传到服务器
      // 可以使用 Axios 或其他 HTTP 请求库发送请求
      // 这里应该包括上传进度的监听和处理
    },
    notifyServerToMerge(hash) {

      return "成功"
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
