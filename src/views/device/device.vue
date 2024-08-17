<template>
  <div class="app-container">
    <div class="el-container">
      <el-main>
        <el-form ref="UAVModelForm" :model="UAVModelForm" :rules="rules" class="demo-dynamic" label-width="100px"
                 width="200px">
          <!-- 样地名称首先要从后端申请得到（在create生命周期中写），然后列举出来 -->
          <el-form-item :rules="[
              { required: true, message: '无人机品牌不能为空'},
                // { type: 'number', message: '年龄必须为数字值'}
            ]" label="无人机品牌:" label-width="100px"
                        prop="brand"
          >
            <!-- <el-input v-model="sampleName" placeholder="请选择样地" style="width: 220px"></el-input> -->
            <el-select v-model="UAVModelForm.brand" allow-create filterable placeholder="请输入或选择，如：大疆"
                       style="width: 220px">
              <el-option v-for="item in this.brands" :key="item.brand" :label="item.brand"
                         :value="item.brand"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :rules="[
                  { required: true, message: '无人机型号不能为空'},
                    // { type: 'number', message: '年龄必须为数字值'}
            ]" label="无人机型号:" label-width="100px"
                        prop="model"
          >
            <el-input v-model="UAVModelForm.model" placeholder="请输入，如：TY350" style="width: 220px"></el-input>
          </el-form-item>
          <el-form-item label="相机类型:" label-width="100px" prop="camera">
            <el-radio v-model="UAVModelForm.camera" border label="1" size="medium">集成相机</el-radio>
            <el-radio v-model="UAVModelForm.camera" border label="2" size="medium">机载相机</el-radio>
            <!--                <div style="margin-top: 20px"></div>-->
          </el-form-item>

          <el-form-item :rules="[{ required: true, message: '请选择成像类型'},]" label="成像设备:" label-width="100px"
                        prop="image">
            <div class="tag-container">

              <!--     加个注释，在表单中有各种方便的功能，比如,label以及label-width不用自己写{{}}标签输出字符，同时也有像rules这样的限制方式使用，但是注意prop必须与该表单项一样，在el-form中嵌套多个el-form-item就必须逐层找到prop,如,image.imageType控制的内容就是UAVModelForm.image.imageType.imageType等内容     -->
              <!--     表单故好用，用时需谨慎！      -->
              <el-form-item
                  :rules="[
                    { required: true, message: '请选择成像类型'},
                  ]"
                  prop="image.imageType"
              >
                  <span class="tag">
                    <el-select v-model="UAVModelForm.image.imageType" placeholder="选择成像类型" style="width: 130px">
                      <el-option v-for="item in ['可见光', '红外光', '多光谱', '激光雷达']" :key="item" :label="item"
                                 :value="item"></el-option>
                    </el-select>
                    </span>
              </el-form-item>

              <!--    span标签在里面外面都可以，因为el-form-item标签只是el-form的子组件，el-form会自己找到的，或者作为el-form-item的嵌套子组件     -->
              <el-form-item
                  :rules="[
                  { required: true, message: '请填写水平分辨率', trigger: 'blur' },
                  { type: 'number', message: '请填写正确的水平分辨率', trigger: 'blur'}
                ]" label="分辨率："
                  prop="image.resolutionX"
              >
                <!--                <span class="tag">水平分辨率:</span>-->
                <span class="tag">
                  <el-input v-model.number="UAVModelForm.image.resolutionX" style="width: 70px"></el-input>
                </span>
              </el-form-item>
              <el-form-item
                  :rules="[
                  { required: true, message: '请填写垂直分辨率', trigger: 'blur' },
                  { type: 'number', message: '请填写正确的垂直分辨率', trigger: 'blur'}
                ]"
                  prop="image.resolutionY"
              >
                <span class="tag"> * </span>
                <span class="tag">
                  <el-input v-model.number="UAVModelForm.image.resolutionY" style="width: 70px"></el-input>
                </span>
              </el-form-item>
            </div>

          </el-form-item>

          <el-form-item label-width="50px">
            <div class="tag-container" style="margin-top: 8px">
              <el-popover
                  :disabled="!addButton"
                  content="最多添加四个成像设备，请删除后重新添加！"
                  placement="top-start"
                  trigger="hover"
                  width="200">
                <el-button slot="reference" :disabled="addButton" type="primary"
                           @click="submitFormCreate('UAVModelForm')">添加
                </el-button>
              </el-popover>
              <el-tag v-for="(tag, index) in UAVModelForm.dynamicTags.tag" :key="tag"
                      :disable-transitions="false"
                      closable
                      size="50"
                      style="margin-top: 2px"
                      @close="handleClose(tag, tip)">
                <el-tooltip :content="tagTooltip(index)" effect="light" placement="bottom">
                  <span>{{ tag }}</span>
                </el-tooltip>
              </el-tag>
            </div>
          </el-form-item>

          <el-form-item label-width="100px">
            <el-button :disabled="btnDisable" class="custom-button" style="width: 80px"
                       @click="addUAVInfo">{{ btnText }}
            </el-button>
            <el-button class="cancel-button" style="width: 80px" @click="resetUAVInfo">重置</el-button>
            <el-button style="width: 120px" type="warning" @click="uploadImage">图像上传页面</el-button>
          </el-form-item>
        </el-form>
      </el-main>

      <el-container>
        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
                  style="width: 100%;" @sort-change="sortChange">
          <el-table-column :class-name="getSortClass('id')" align="center" label="序号" min-width="5%" prop="id">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column :class-name="getSortClass('id')" align="center" label="无人机品牌" min-width="6%"
                           prop="id">
            <template slot-scope="{row}">
              <span>{{ row.brand }}</span>
            </template>
          </el-table-column>
          <el-table-column :class-name="getSortClass('id')" align="center" label="型号" min-width="5%" prop="id">
            <template slot-scope="{row}">
              <span>{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column :class-name="getSortClass('id')" align="center" label="相机类型" min-width="5%" prop="id">
            <template slot-scope="{row}">
              <span>{{ row.camera }}</span>
            </template>
          </el-table-column>
          <el-table-column :class-name="getSortClass('id')" align="center" label="成像" min-width="18%" prop="id">
            <template slot-scope="{row}">
              <el-tag
                  v-for="tag in row.image"
                  :key="tag"
                  :type="tag.type">
                {{ tag }}
              </el-tag>
            </template>
            <!--            <el-tag>标签一</el-tag>-->
            <!--            <el-tag type="success">标签二</el-tag>-->
            <!--            <el-tag type="info">标签三</el-tag>-->
            <!--            <el-tag type="warning">标签四</el-tag>-->
            <!--            <el-tag type="danger">标签五</el-tag>-->
            <!--            <template slot-scope="{row}">-->
            <!--              <span>{{ row.image }}</span>-->
            <!--            </template>-->
          </el-table-column>
          <el-table-column align="center" class-name="small-padding fixed-width" label="操作" min-width="10%">
            <template slot-scope="{row,$index}">
              <!--                <el-button type="primary" size="mini" @click="checkDetail(row)">-->
              <!--                  详细信息-->
              <!--                </el-button>-->
              <el-button size="mini" @click="updateUAV(row)">
                修改
              </el-button>
              <el-button size="mini" type="danger" :visible.sync="dialogVisible_delete" :disabled="btnDeleteDisable" @click="handleDelete(row,$index)">
                删除
              </el-button>

              <!--              <el-dialog title="确认删除" :visible.sync="dialogVisible_delete" width="30%" @close="handleClose_delete1">-->
              <!--                 <p>你确定要删除这个项吗？</p>-->
              <!--                 <span slot="footer" class="dialog-footer">-->
              <!--              <el-button @click="handleClose_delete1">取消</el-button>-->
              <!--              <el-button type="danger" @click="handleConfirmDelete">确定</el-button>-->
              </span>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
    </div>
  </div>
</template>


<script>
// import {hergeImg, uploadStitchingImg, uploadUnstitchingImg} from '@/api/uploadStichingImage'
// import {getSamplePlotList} from "@/api/samplePlot";
import {addUAV, deleteUAV, getUAVList} from "@/api/device";

export default {
  name: 'device',
  data() {
    return {
      dialogVisible_delete: false,
      btnDeleteDisable: false,

      ruleFormCreate: '',
      inputVisible: false,
      inputValue: '',
      addButton: false,
      UAVModelForm: {
        brand: '',
        model: '',
        camera: '1',
        image: {
          imageType: '',
          resolutionX: '',
          resolutionY: '',
        },
        dynamicTags: {
          tip: ['添加图片分辨率'],
          tag: ['成像类型标签'],
        },
        domains: [{
          value: ''
        }],

        email: ''
      },

      //限制规则，因为部分需要函数验证内容，因为在el-form标签下另加了一个rule变量
      rules: {
        'image.resolutionX': [
          {required: true, message: '请填写水平分辨率', trigger: 'blur'},
          {validator: this.validatePositiveIntegerResolutionX, trigger: 'blur'}
        ],
        'image.resolutionY': [
          {required: true, message: '请填写垂直分辨率', trigger: 'blur'},
          {validator: this.validatePositiveIntegerResolutionY, trigger: 'blur'}
        ],
      },


      btnText: '提交',
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }

      var index1 = this.dynamicValidateForm.resolution.indexOf(item)
      if (index1 !== -1) {
        this.dynamicValidateForm.resolution.splice(index, 1)
      }
    },
    tagTooltip(index) {
      if (this.UAVModelForm.dynamicTags.tip[index] === "添加图片分辨率") {
        return this.UAVModelForm.dynamicTags.tip[index];
      }
      return "分辨率为:" + this.UAVModelForm.dynamicTags.tip[index];
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
        // brand: this.UAVBrand,     //品牌
        brand: this.UAVModelForm.brand,     //品牌
        model: this.UAVModelForm.model,      //型号
        camera: this.UAVModelForm.camera, //成像设备是否集成
        imageType: this.UAVModelForm.dynamicTags.tag,    //成像类型
        resolution: this.UAVModelForm.dynamicTags.tip,    //成像类型
      }
      this.$refs['UAVModelForm'].validate((valid) => {
        if (request.brand === '' || request.model === '' || request.camera === '' || request.imageType === '成像类型标签' || request.resolution === '添加图片分辨率') {
          this.$message({
            type: 'error',
            message: '请填写正确数据'
          })
          return false;
        }
        addUAV(request).then(res => {
          if (res.error !== null) {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            // this.btnText = '上传'
            this.btnDisable = false
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: '上传失败'
            })
          }
        })
      })
    },
    resetUAVInfo() {
      this.UAVModelForm.dynamicTags.tag.slice(0, this.UAVModelForm.dynamicTags.tag.length)
      this.UAVModelForm.dynamicTags.tip.slice(0, this.UAVModelForm.dynamicTags.tip.length)
      this.UAVModelForm.dynamicTags.tag[0] = '成像类型标签'
      this.UAVModelForm.dynamicTags.tip[0] = '添加图片分辨率'

      this.UAVModelForm.brand = ''
      this.UAVModelForm.model = ''
      this.UAVModelForm.camera = '1'
      this.UAVModelForm.image.imageType = ''
      this.UAVModelForm.image.resolutionX = null
      this.UAVModelForm.image.resolutionY = null
    },
    submitFormCreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let inputValue = " ";
          if (this.UAVModelForm.dynamicTags.tag[0] === '成像类型标签') {
            console.log("!!!")
            this.handleClose('成像类型标签', '添加图片分辨率')
          }
          // let inputValue = this.inputValue;
          if (inputValue) {
            this.UAVModelForm.dynamicTags.tag.push(this.UAVModelForm.image.imageType);
            this.UAVModelForm.dynamicTags.tip.push(this.UAVModelForm.image.resolutionX + '*' + this.UAVModelForm.image.resolutionY);
          }
          // this.inputVisible = false;
          this.inputValue = '';
          // setTimeout(() => {
          //   //设置为不为空字符
          //   this.UAVModelForm.image.resolutionX = ''
          //   this.UAVModelForm.image.resolutionY = ''
          //   this.UAVModelForm.image.imageType = ''
          // }, 0.3 * 1000)
          if (this.UAVModelForm.dynamicTags.tag.length >= 4) {
            this.addButton = true;
          }
          // alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleClose(tag, tip) {
      this.UAVModelForm.dynamicTags.tag.splice(this.UAVModelForm.dynamicTags.tag.indexOf(tag), 1);
      this.UAVModelForm.dynamicTags.tip.splice(this.UAVModelForm.dynamicTags.tip.indexOf(tip), 1);
      if (this.UAVModelForm.dynamicTags.tag.length <= 3) {
        this.addButton = false;
      }
    },
    /************* 删除样地及其确认 *************/
    handleDelete(row, index) {
      this.dialogVisible_delete = true;
      this.btnDeleteDisable = true;
      this.$confirm('是否确定删除数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUAV(row.type).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        this.list.splice(index, 1)
      })
      this.dialogVisible_delete = false;
      this.btnDeleteDisable = false;
    },
    /********************************************/

    getList() {
      // console.log("*******")
      this.dataList = [];
      this.brands = [];
      this.listLoading = true
      getUAVList().then(response => {
        let tmpBrands = {};
        let num = 0;
        console.log(response['list'])
        response['list'].forEach(UVAListInfo => {
          num++;
          //去掉无用的成像类型和分辨率标签
          let tmpImage = []
          let tmpResolution = []
          for (let i = 0; i < 4; i++) {
            if (UVAListInfo.imageType[i] !== 0) {
              tmpImage.push(UVAListInfo.imageType[i])
              tmpResolution.push(UVAListInfo.resolution[i])
            }
          }
          let data = {
            id: num,
            // id: UVAListInfo.UAVId,
            brand: UVAListInfo.UAVBrand,
            type: UVAListInfo.UAVType,
            camera: UVAListInfo.UAVCamera,
            image: tmpImage,
            resolution: tmpResolution,
            // imageNum: UVAListInfo.imageNum,
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
        // this.list = this.dataList.slice(0, this.pageLimit + 1)
        this.list = this.dataList
        // this.total = 7
        this.total = this.dataList.length
      })
      this.listLoading = false
    },
  uploadImage() {
      this.$router.push({path: '/uploadImage/uploadStitchingImage'})
    }
  },

  //验证水平分辨率输入框的内容(弃用)
  validatePositiveIntegerResolutionX(rule, value, callback) {
    if (value === '' || value === null) {
      return callback(new Error('请填写水平分辨率'));
    }
    const num = Number(value);
    if (!Number.isInteger(num) || num <= 0) {
      return callback(new Error('请填写正确的水平分辨率'));
    }
    callback();
  },
  //验证垂直分辨率输入框的内容
  validatePositiveIntegerResolutionY(rule, value, callback) {
    // if (value === '' || value === null) {
    //   return callback(new Error('请填写垂直分辨率'));
    // }
    console.log("456")
    const num = Number(value);
    if (!Number.isInteger(num) || num <= 0) {
      return callback(new Error('请填写正确的垂直分辨率'));
    }
    callback();
  }

}
</script>

<style lang="scss" scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* 垂直居中对齐 */
}

.tag-container {
  display: flex;
  gap: 10px; /* 设置标签之间的间距 */
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.tag {
  //background-color: #f0f0f0;
  //border: 1px solid #ccc;
  //border-radius: 4px;
  padding: 2px 2px;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
  font-family: inherit; /* 继承父级字体家庭 */
}

//.custom-label {
//
//}

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
