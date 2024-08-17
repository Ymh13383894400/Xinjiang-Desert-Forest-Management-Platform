<template>
  <div class="app-container">
    <button @click="loadUrl"  v-if="!showIframe" >访问</button>  <!-- 按钮只会在跳转到链接网址前存在 -->
    <button @click="loadUrl1"  v-if="!showIframe" >地图</button>  <!-- 按钮只会在跳转到链接网址前存在 -->
    <el-link href="http://127.0.0.1:3000/openlayers.html" target="_blank">默认链接</el-link>
    <div v-if="showIframe">
      <iframe :src="Url" style="width: 100%; height: 100vh;" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Url: '',    // 链接的网址
      showIframe: false
    };
  },
  methods: {
    loadUrl() {
      this.showIframe = true;
    },
    loadUrl1() {
      // this.showIframe = true;
      this.$router.push({path: '/device/map2D'})
    }
  }
};
</script>
<style></style>
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
