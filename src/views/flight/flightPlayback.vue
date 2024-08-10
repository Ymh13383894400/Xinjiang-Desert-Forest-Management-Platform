<template>
  <div class="app-container">
    <button @click="loadUrl"  v-if="!showIframe" >访问</button>  <!-- 按钮只会在跳转到链接网址前存在 -->
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