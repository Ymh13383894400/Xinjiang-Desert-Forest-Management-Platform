<template>
  <div class="app-container">
    <div>
      <div>
        <div>
          <el-form style="width: 450px">
            <el-form-item label-width="100px" label="日期:">
              <el-date-picker
                  v-model="time"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label-width="100px" label="tif文件:">
              <el-upload
                  class="upload-demo"
                  drag
                  :on-change="handleChange"
                  :on-remove="handleRemove"
                  :on-exceed="handleExceed"
                  :auto-upload="false"
                  multiple
                  style=""
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label-width="100px" style="text-align: center">
              <el-button @click="upload" :disabled="btnDisable">{{btnText}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { uploadImg } from '@/api/dataView'

export default {
  name: 'uploadTif',
  data() {
    return {
      tifFile: '',
      time: '',
      btnText: '上传',
      btnDisable: false
    }
  },
  methods: {
    handleChange(file, fileList){
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
          type:'warning',
          message:'附件格式错误，请删除后重新上传！'
        })
      }
    },
    upload() {
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
          sampling_date: this.time
        }
        uploadImg(request).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.btnText = '上传'
          this.btnDisable = false
        })
        // uploadImg(request).then(res => {
        //   console.log(res)
        //   this.$message({
        //     type: 'success',
        //     message: '上传成功'
        //   })
        //   this.btnText = '上传'
        //   this.btnDisable = false
        // })
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
