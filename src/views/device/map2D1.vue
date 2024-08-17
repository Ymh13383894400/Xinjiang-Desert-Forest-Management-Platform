<template>

<!--    <div><img src="../../../public/test4.png"></div>-->
    <div><img src="../../../public/tiles/tiles/0/0/0.png"></div>
  <!--  	http://localhost:9527/static/img/11.fdfb3d32.png-->
  <!--  	http://localhost:9527/static/img/12.17402b4f.png-->
  <!--  	http://localhost:9527/static/img/13.32ae1567.png-->
  <!--  <div><img :src="imageBase64"></div>-->
<!--  <div id="container"></div>-->
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import {getSampleImageList} from "@/api/mapSamplePlot";

export default {
  name: "map-view",
  mounted() {
    this.checkImg();
    // this.initAMap();
  },
  unmounted() {
    this.map?.destroy();
  },
  data() {
    return {
      imageBase64: '',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAAC.',
    }
  },
  methods: {
    checkImg() {      // 把id(样地的ID)传到后端获取缩略图，然后开一个新的网页展示缩略图
      console.log("访问图片的id:", this.ymh)
      getSampleImageList('0501').then(response => {
        response['list'].forEach(samplePlantInfo => {
          this.imageBase64 = samplePlantInfo.imageBase64
        })
      })
    },
    initAMap() {
      window._AMapSecurityConfig = {
        securityJsCode: "c6b4d67ffab9ff4ab432d583c2a78c73",
      };
      AMapLoader.load({
        key: "dfb0a5b65e1b9ba16a281f570fcc89ca", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      })
        .then((AMap) => {
          var imageLayer = new AMap.ImageLayer({
            // url: 'https://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg',
            // url: 'https://p4.itc.cn/images01/20210319/508dfeb6404644fbbadc92363d19edaa.jpeg',
            url: 'http://localhost:9527/static/img/test3-jinghe01.fa6012d8.png',      //test3-jinghe.png
            // url: 'http://localhost:9527/static/img/test4.cc38d2e1.png',      //test4.png
            bounds: new AMap.Bounds(
              [116.327911, 39.939229],
              [116.342659, 39.946275]
            ),
            zooms: [15, 20]
          });

          //创建卫星图层
          var satellite = new AMap.TileLayer.Satellite();
          //创建路网图层
          var roadNet = new AMap.TileLayer.RoadNet();

          var map = new AMap.Map("container", {
            // 设置地图容器id
            // viewMode: "3D", // 是否为3D地图模式
            zoom: 16, // 初始化地图级别
            // minZoom: 8, // 最小缩放级别
            // maxZoom: 21,  // 最大缩放级别
            center: [116.33719, 39.942384], // 初始化地图中心点位置
            layers: [
              // roadNet, //创建路网图层
              // satellite, //创建卫星图层
              // AMap.createDefaultLayer(),
              imageLayer,
            ],
          });

          const marker = new AMap.Marker({
            position: [116.33719, 39.942384], //位置
          });
          map.add(marker); //添加到地图

          console.log(map.getZoom())
          // map.on('zoomstart', mapZoomstart);
          // map.on('zoomchange', mapZoom);
          // map.on('zoomend', mapZoomend);
          map.on('zoomend', function () {
            var currentZoom = map.getZoom();
            console.log(currentZoom)
            if (currentZoom < 15) {
              map.setZoom(15);
            } else if (currentZoom > 20) {
              map.setZoom(20);
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
<style scoped>
#container {
  width: 100%;
  height: 800px;
}
</style>
