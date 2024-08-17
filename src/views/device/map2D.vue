<template>

  <!--  <div><img src="../../../public/test4.png"></div>-->
  <!--  <div><img :src="imageBase64"></div>-->
  <div id="container"></div>
<!--  <div id="container">-->
<!--    {{name}}-->
<!--  </div>-->
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import {getSampleImageList} from "@/api/mapSamplePlot";

export default {
  name: "map-view",
  created() {
    this.getData();
  },
  mounted() {
    // this.checkImg();
    this.initAMap();
  },
  unmounted() {
    this.map?.destroy();
  },
  data() {
    return {
      imageBase64: '',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAAC.',
      name: '',
      id: '',
    }
  },
  methods: {
    getData(){
      this.name = this.$route.query.samplePlotName;
      console.log(this.name)
    },
    checkImg() {      // 把id(样地的ID)传到后端获取缩略图，然后开一个新的网页展示缩略图
      console.log("访问图片的id:", this.ymh)
      getSampleImageList('0501').then(response => {
        response['list'].forEach(samplePlantInfo => {
          this.imageBase64 = samplePlantInfo.imageBase64
        })
      })
    },
    initAMap() {
      this.name = this.$route.query.samplePlotName;
      console.log(this.name)
      window._AMapSecurityConfig = {
        securityJsCode: "c6b4d67ffab9ff4ab432d583c2a78c73",
      };
      AMapLoader.load({
        key: "dfb0a5b65e1b9ba16a281f570fcc89ca", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      })
        .then((AMap) => {
          // 初始化地图


          var i = 1;
          //该demo可模拟水印效果
          var layer = new AMap.TileLayer.Flexible({
            cacheSize: 30,
            opacity: 1,
            // position: [116.397428, 39.90923],
            createTile: function (x, y, z, success, fail) {
              console.log(x, y, z)
              console.log(i++)
              // if ((x + y) % 3) {
              //   fail();
              //   return;
              // }
              var coord = {
                x: x,
                y: y,
              }
              var zoom = z
              var normalizedCoord = getNormalizedCoord(coord, zoom);
              if (!normalizedCoord) {
                return null;
              }

              var img = document.createElement('img');
              img.onload = function () {
                success(img)
              };
              img.crossOrigin = "anonymous";// 必须添加，同时图片要有跨域头
              img.onerror = function () {
                fail()
              };
              // img.src = "http://127.0.0.1:3000/tiles/" + zoom + "/" + x + "/" + y + ".png";
              // img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              img.src = "http://127.0.0.1:3000/Global Mapper/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";

              // img.src = 'http://127.0.0.1:3000/7/64/63.png';console.log(normalizedCoord.x, normalizedCoord.y, zoom)
              // if (zoom === 1 && normalizedCoord.x >= 1 && normalizedCoord.x <= 1 && normalizedCoord.y >= 0 && normalizedCoord.y <= 1) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 2 && normalizedCoord.x >= 2 && normalizedCoord.x <= 2 && normalizedCoord.y >= 1 && normalizedCoord.y <= 2) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 3 && normalizedCoord.x >= 4 && normalizedCoord.x <= 4 && normalizedCoord.y >= 3 && normalizedCoord.y <= 4) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 4 && normalizedCoord.x >= 8 && normalizedCoord.x <= 8 && normalizedCoord.y >= 7 && normalizedCoord.y <= 8) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 5 && normalizedCoord.x >= 16 && normalizedCoord.x <= 16 && normalizedCoord.y >= 15 && normalizedCoord.y <= 16) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 6 && normalizedCoord.x >= 32 && normalizedCoord.x <= 32 && normalizedCoord.y >= 31 && normalizedCoord.y <= 32) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 7 && normalizedCoord.x >= 64 && normalizedCoord.x <= 64 && normalizedCoord.y >= 63 && normalizedCoord.y <= 64) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 8 && normalizedCoord.x >= 128 && normalizedCoord.x <= 129 && normalizedCoord.y >= 126 && normalizedCoord.y <= 128) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 9 && normalizedCoord.x >= 256 && normalizedCoord.x <= 259 && normalizedCoord.y >= 252 && normalizedCoord.y <= 256) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 10 && normalizedCoord.x >= 512 && normalizedCoord.x <= 519 && normalizedCoord.y >= 504 && normalizedCoord.y <= 512) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 11 && normalizedCoord.x >= 1024 && normalizedCoord.x <= 1039 && normalizedCoord.y >= 1009 && normalizedCoord.y <= 1024) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 12 && normalizedCoord.x >= 2048 && normalizedCoord.x <= 2078 && normalizedCoord.y >= 2018 && normalizedCoord.y <= 2048) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // } else if (zoom === 13 && normalizedCoord.x >= 4096 && normalizedCoord.x <= 4156 && normalizedCoord.y >= 4036 && normalizedCoord.y <= 4096) {
              //   img.src = "http://127.0.0.1:3000/" + zoom + "/" + normalizedCoord.x + "/" + normalizedCoord.y + ".png";
              // }

              var bounds = getTileBounds(coord, zoom);
              console.log("Tile Coordinates: ", normalizedCoord);
              console.log("Tile Bounds (LngLat): ", bounds);


              function getTileBounds(coord, zoom) {
                var tileSize = 256;
                var n = Math.pow(2, zoom);
                var lonPerTile = 360 / n;
                var latPerTile = 180 / n;

                var lngMin = coord.x * lonPerTile - 180;
                var latMax = 90 - (coord.y * latPerTile) - (latPerTile);
                var lngMax = (coord.x + 1) * lonPerTile - 180;
                var latMin = 90 - (coord.y * latPerTile);

                return {
                  nw: {lng: lngMin, lat: latMax},
                  se: {lng: lngMax, lat: latMin}
                };
              }
            }
          });


          function getNormalizedCoord(coord, zoom) {
            var y = coord.y;
            var x = coord.x;

            var tileRange = 1 << zoom;

            if (y < 0 || y >= tileRange) {
              return null;
            }
            if (x < 0 || x >= tileRange) {
              x = (x % tileRange + tileRange) % tileRange;
            }

            return {
              x: x,
              y: y
            };
          }

          var map = new AMap.Map('container', {
            zoom: 9,
            zooms: [3, 19],
            center: [1.5, 1.5],
            layers: [
              layer,
            ]
          });


          const marker = new AMap.Marker({
            position: [1.5, 1.5],
          });
          const marker1 = new AMap.Marker({
            position: [44, 83],
          });
          map.add(marker); //添加到地图
          // map.add(marker1); //添加到地图
          map.on('click', function(e  ) {
            const lat = e.lnglat.getLat() // 获取纬度
            const lng = e.lnglat.getLng() // 获取经度
            console.log(`Latitude: ${lat}, Longitude: ${lng}`);
            // console.log(e.x)
            // console.log(x,y)
          })

          // 在地图上添加标记
          // L.marker([lat, lng]).addTo(map)
          //     .bindPopup(`Latitude: ${lat}, Longitude: ${lng}`)
          //     .openPopup();
    // });

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
