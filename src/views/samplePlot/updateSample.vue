<template>
  <div style="width: 1483px;" v-if="stopSlideFlag">
      <el-dialog :title="'修改第'+data.samplePlotId+'个样地 : '+data.samplePlotName+' 的信息'" :visible.sync="dialogTableVisible" width="50%" :append-to-body="true">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="样地名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
  import Vue from 'vue';
  function rafThrottle (fn) {      // 保证在短时间内多次触发时，只有一次函数执行。
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

  export default {
    name: 'updateSample',
    data () {
      let self = this
      return {
        dialogTableVisible: true,

        data: {samplePlotId:1,samplePlotName:"吐鲁番1"},
        stopSlideFlag: true,          // 控制组件是否渲染
        ruleForm: {
          name: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入样地名称', trigger: 'blur' },
          ]
        }
      }
    },
    /*create(){
      this.data = {samplePlotId:1,samplePlotName:"吐鲁番1"}    //应该根据 id 从后端获取

    },*/
    methods: {
      showDialog () {
        this.dialogTableVisible = true
      },
      offPopover () {       // 关闭弹出框
        on(document, mousewheelEventName, this._mouseWheelHandler);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');   // 后续保存到数据库
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {      //
        this.$refs[formName].resetFields();
        this.dialogTableVisible = false;      // 关闭页面
      }
    }
  }
</script>

<style scoped lang="scss">
  .imgContainer {
    width: 1472px;
    height: 1558px;
    background-image: url('../../assets/originImg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    overflow-y: scroll;
    overflow-x: hidden;
    //overflowY: 'auto';
    position: absolute
  }

  .icon-div:hover {
    cursor: pointer;
    transform: scale(1.3) translate(-15%, 0);
    //transform: ;
  }

  .hover {
    position: absolute;
    font-size: 30px;
    color: red;
    transition: all 0.3s;
  }

  .hover:hover {
    cursor: pointer;
    font-size: 40px;
    transform: scale(1.3);
    transform: translate(-15%, -30%);
  }
</style>
