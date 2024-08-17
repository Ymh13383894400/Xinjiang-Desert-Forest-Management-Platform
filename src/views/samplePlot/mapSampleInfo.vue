<template>
  <div style="width: 1483px;" v-if="stopSlideFlag">
    <el-checkbox v-model="showId" style="z-index: 289;background-color: grey;"><span
      style="color:white;">显示名称</span></el-checkbox>
    <div style="height: 1380px;width: 1483px;" :style="imgStyle">
      <el-amap class="amap-box" :vid="'amap-vue'" :zoom="zoom" :center="center" :plugin="mapplugin">
        <el-amap-layer-satellite/> <!-- 高德地图的卫星图层组件，用于在地图上显示卫星影像 -->
        <!-- <el-amap-polyline :path="amapPath" :strokeWeight="5" :strokeColor="'blue'" /> -->
        <!-- :path="amapPath"：绑定折线的路径数据，amapPath 是一个在 Vue 数据中定义的数组变量，包含了折线经过的坐标点。
             :strokeWeight="5"：设置折线的宽度为 5 像素。    :strokeColor="'blue'"：设置折线的颜色为蓝色。-->
        <div v-for="(icon, index) in observeList" @click="showDialog(icon.id)">
          <el-amap-marker :position="[icon.long-0.0, icon.lat-0.0]" :extData="{id: icon.id, name :icon.samplePlotName}" style="background: none"
                          :events="markerEvents"></el-amap-marker> <!-- 在地图上显示一个标记点-->

          <el-amap-text :visible="showId" :position="[icon.long-0.0, icon.lat-0.0]" :text="icon.samplePlotName + '' " :domStyle="text_style"
                        @click="showDialog(icon.id)" :events="textEvents" :extData="icon.id"/>
<!--            text 显示标记点的名称,点击事件 showDialog(icon.id) -->
<!--          <el-amap-->
        </div>
      </el-amap>

      <el-dialog :title="'样地名称：'+ samplePlotName_temp" :visible.sync="dialogTableVisible" width="70%"
                 :append-to-body="true">

        <div class="filter-container">
          <el-select v-model="value" placeholder="请选择日期">
            <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

          <el-button type="primary" size="mini" style="float: right; margin-left: 10px;" @click="downLoadImg">
            下载样地图片
          </el-button>

          <el-button type="primary" size="mini" style="float: right" @click="checkMap">
            查看样地图片
          </el-button>
        </div>


        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
                  style="width: 100%;" height="500" @sort-change="sortChange">
          <!--  height="500" 后，el-table 组件会在页面上占据 500 像素的高度。当表格内容超过这个高度时，会在垂直方向上出现滚动条 -->
          <el-table-column label="植物编号" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="植物种类" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="经度" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.longitude }}</span>
            </template>
          </el-table-column>
          <el-table-column label="纬度" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.latitude }}</span>
            </template>
          </el-table-column>

          <el-table-column label="高度" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.height }}</span>
            </template>
          </el-table-column>

          <el-table-column label="地径" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.diameter }}</span>
            </template>
          </el-table-column>

          <el-table-column label="最大冠幅" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.maxCrownWidth }}</span>
            </template>
          </el-table-column>

          <el-table-column label="最小冠幅" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.minCrownWidth }}</span>
            </template>
          </el-table-column>

          <el-table-column label="备注" prop="id" align="center" min-width="5%" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.notes }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import MdInput from '@/components/MDinput'
import Mallki from '@/components/TextHoverEffect/Mallki'
import DropdownMenu from '@/components/Share/DropdownMenu'
import waves from '@/directive/waves/index.js' // 水波纹指令
import plantBarChart from '@/views/homePage/plantBarChart'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import { getCurrentData, getDataById } from '@/api/dataView'
// import {getObserveList} from '@/api/observe'
import Vue from 'vue';
import echarts from 'echarts'
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
import {getSamplePlantList} from "@/api/samplePlot"
import {getSampleImageList, getSamplePlotName, get_all_coords} from "@/api/mapSamplePlot"

function rafThrottle(fn) {
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

const mockFunc = () => new Promise((resolve, reject) => {
  resolve({
    band_num_list: ['500nm', '550nm', '600nm'],
    count: 3,
    reflection_list: [{
      sampling_date: '2023-08-02',
      list: [30, 40, 50]
    }, {
      sampling_date: '2023-08-04',
      list: [40, 60, 30]
    }, {
      sampling_date: '2023-08-06',
      list: [70, 50, 60]
    }]
  });
})

const colorList = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink', 'black', 'white']

const calendarTypeOptions = [
  {key: 'CN', display_name: 'China'},
  {key: 'US', display_name: 'USA'},
  {key: 'JP', display_name: 'Japan'},
  {key: 'EU', display_name: 'Eurozone'}
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'observeShow',
  components: {
    PanThumb,
    MdInput,
    Mallki,
    DropdownMenu,
    plantBarChart,
    Pagination       // 分页组件
  },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    let self = this
    return {
      ymh: '',
      amapPath: [[86.38412475585936, 44.889019208718665], [86.34756088256835, 44.90500972765334], [86.28335952758789, 44.92804527782559], [86.26421928405762, 44.90215243272469], [86.228084564209, 44.909751307960505], [86.22044563293457, 44.893336479013286], [86.19443893432617, 44.88226902409724], [86.17538452148438, 44.88847192596021], [86.14585876464844, 44.87205102180421], [86.16336822509764, 44.85221805506482], [86.14036560058592, 44.841020971575404], [86.14791870117186, 44.83103912787289], [86.14448547363281, 44.829578225225724], [86.14448547363281, 44.82689980753217], [86.14242553710936, 44.82568230380037], [86.1441421508789, 44.82373424434254], [86.14105224609374, 44.821055555099875], [86.13109588623047, 44.81813320670732], [86.12491607666014, 44.817280827192235], [86.10757827758789, 44.815880462063284], [86.10860824584961, 44.81192272457701], [86.09899520874023, 44.81411473581954], [86.11719131469725, 44.79828167147634], [86.12731933593749, 44.788292426535435], [86.12028121948242, 44.77330531715043], [86.02312088012695, 44.7380763935453], [85.9305953979492, 44.74856198566429], [85.9130859375, 44.74124665685063], [85.90737819671631, 44.73853365378816], [85.9070348739624, 44.73761912968634], [85.9064769744873, 44.73713137758442], [85.90548992156982, 44.736643621368216], [85.90506076812743, 44.73618634617892], [85.90433120727538, 44.73591197932963], [85.9036874771118, 44.73612537588046], [85.9032154083252, 44.735881494043795], [85.89866638183594, 44.73002802139269], [85.89377403259277, 44.726125377149934], [85.88175773620605, 44.68983037817844], [85.87411880493164, 44.685741952648534], [85.880126953125, 44.67902898641666], [85.88115692138672, 44.67536704062165], [85.88253021240233, 44.672193167070205], [85.88544845581053, 44.66682160045419], [85.88493347167969, 44.66096114184373], [85.89660644531251, 44.64533035584482], [85.8995246887207, 44.64093343822226], [85.8995246887207, 44.640078443319275], [85.91437339782716, 44.63250508131393], [85.91978073120116, 44.630611586372304], [85.91900825500488, 44.628901279778844], [85.91772079467772, 44.62902344620689], [85.91171264648438, 44.605257237293976], [85.90879440307619, 44.591567397710136], [85.90433120727538, 44.58875569217597], [85.90398788452147, 44.584354488705785], [85.89849472045898, 44.56148732059202], [85.89643478393553, 44.5603865349151], [85.89420318603514, 44.55316975746653], [85.88922500610352, 44.554393003079994], [85.88630676269531, 44.548643525129044], [85.89969635009766, 44.5415476417437], [85.91540336608887, 44.52747566008577], [85.91643333435059, 44.52423250398534], [85.91531753540039, 44.52276384560217], [85.91454505920409, 44.52111156066468], [85.9141159057617, 44.52037719676218], [85.91360092163086, 44.51982641776091], [85.91111183166504, 44.51792925023669], [85.91033935546875, 44.51731724753548], [85.9082794189453, 44.514746765997494], [85.90716361999512, 44.51321666362915], [85.90664863586426, 44.51229858292442], [85.90639114379881, 44.51156410794742], [85.90561866760254, 44.509972713743416], [85.90441703796387, 44.5080140150722], [85.90407371520996, 44.506973429630946], [85.90342998504639, 44.50382095447318], [85.90982437133789, 44.50336184192755], [85.91076850891113, 44.50146413838063], [85.91094017028807, 44.50106622496424], [85.91261386871338, 44.50060709072457], [85.91284990310668, 44.500040820182704], [85.91265678405762, 44.498219534393584], [85.91254949569702, 44.49728591205955], [85.91233491897582, 44.491285883970036], [85.91351509094237, 44.491025664703756], [85.90888023376463, 44.4872600088921], [85.90295791625975, 44.481871330600605], [85.8936882019043, 44.472501193512976], [85.88587760925292, 44.4650285026779], [85.88201522827147, 44.46159809472371], [85.8812427520752, 44.45896389465947], [85.88132858276366, 44.45688095465622], [85.88441848754881, 44.45443034187561], [85.88828086853026, 44.45179581843463], [85.88828086853026, 44.44376897957793], [85.88587760925292, 44.43978578749886], [85.88587760925292, 44.43898911649505], [85.88261604309082, 44.42299211572249], [85.90398788452147, 44.41998835920543], [85.90888023376463, 44.41802663899564], [85.91514587402342, 44.41680053044145], [85.91660499572754, 44.41680053044145], [85.92853546142578, 44.41575831795587], [85.92982292175293, 44.415819625086876], [85.93246221542358, 44.41562804008909], [85.93422174453735, 44.41526019513381], [85.9349513053894, 44.41571233756544], [85.93528389930725, 44.41572000096635], [85.93531608581543, 44.414900011373014], [85.93377113342285, 44.39668868186236], [85.93977928161621, 44.39644337273804], [85.95162391662598, 44.396136734886475], [85.97814559936523, 44.38804091443972], [85.97814559936523, 44.3848513443536], [85.99050521850585, 44.37969859477634], [85.989990234375, 44.37012799950905], [85.99780082702637, 44.36761239118651], [85.99943161010742, 44.36712152818466], [86.00157737731934, 44.36724424432075], [86.0024356842041, 44.36736696019977], [86.00561141967772, 44.36460579073823], [86.00629806518553, 44.36368537199505], [86.00655555725096, 44.36307175146552], [86.01479530334473, 44.36276493879054], [86.01737022399901, 44.357794349595025], [86.03728294372557, 44.366017071390665], [86.09882354736328, 44.36583299323374], [86.0995101928711, 44.36626250803341], [86.09946727752686, 44.366814736719626], [86.09946727752686, 44.36733628125412], [86.0992956161499, 44.36791917847381], [86.09912395477295, 44.368256642633966], [86.09878063201904, 44.36871681790087], [86.09865188598633, 44.369207667534], [86.09813690185547, 44.369851901434984], [86.09787940979004, 44.37003596696231], [86.09723567962646, 44.37061883731598], [86.09654903411867, 44.37092560885643], [86.0952615737915, 44.3716311773016], [86.09367370605469, 44.372766204355905], [86.0932445526123, 44.37322634419239], [86.09281539916991, 44.37396256041082], [86.09238624572752, 44.37463741714718], [86.0940170288086, 44.375220241706344], [86.09843730926514, 44.37675396282849], [86.09865188598633, 44.37739811372087], [86.09955310821533, 44.377520808325535], [86.1001968383789, 44.37749013469847], [86.10092639923094, 44.37736744002954], [86.10165596008301, 44.37739811372087], [86.10212802886964, 44.376968680579964], [86.10315799713135, 44.37626317643998], [86.10393047332762, 44.37564968766976], [86.10534667968749, 44.375833734975686], [86.10676288604736, 44.375803060464875], [86.10727787017822, 44.376079130483774], [86.10993862152098, 44.37672328879972], [86.11375808715819, 44.37804225752714], [86.11506700515746, 44.37854836554665], [86.11538887023926, 44.379131151180374], [86.11538887023926, 44.37943787813137], [86.11556053161621, 44.37998998259395], [86.11558198928833, 44.38054208185039], [86.11581802368163, 44.38086413734575], [86.11581802368163, 44.381247534435175], [86.12611770629883, 44.381906971556], [86.12560272216795, 44.37675396282849], [86.12611770629883, 44.37479079259356], [86.12697601318358, 44.37209132605595], [86.12817764282225, 44.37061883731598], [86.12852096557616, 44.368532748227956], [86.12955093383788, 44.364114902541495], [86.13178253173828, 44.35896032812693], [86.13470077514648, 44.35613739282085], [86.13710403442381, 44.354419017787706], [86.13882064819335, 44.353928044237335], [86.13899230957031, 44.35208685678841], [86.14002227783202, 44.35073661589564], [86.14225387573244, 44.35220960441796], [86.14397048950195, 44.35405078801056], [86.14688873291016, 44.356260131966486], [86.14791870117186, 44.35822392333253], [86.14963531494139, 44.36202858181479], [86.15238189697266, 44.35920579433502], [86.16508483886717, 44.3631331138077], [86.17160797119139, 44.36558755479136], [86.17469787597656, 44.36337856253368], [86.19375228881836, 44.3684100347913], [86.19976043701172, 44.369269023448915], [86.20130538940428, 44.37000528941459], [86.20628356933594, 44.37061883731598], [86.21658325195314, 44.37110967100943], [86.21383666992186, 44.392824943700965], [86.21349334716795, 44.39429687403318], [86.2107467651367, 44.397363276651625], [86.20800018310547, 44.39871244289861], [86.20800018310547, 44.39926436557886], [86.21053218841553, 44.40196257929401], [86.2107467651367, 44.4022691866153], [86.21126174926758, 44.40196257929401], [86.21460914611816, 44.40205456165912], [86.21675491333006, 44.40236116849835], [86.21731281280518, 44.4026371132798], [86.22126102447508, 44.40355691981783], [86.25125885009764, 44.398283166103504], [86.25228881835936, 44.39852846751492], [86.25323295593262, 44.400429518584644], [86.25263214111327, 44.40141068206639], [86.2525463104248, 44.40196257929401], [86.26627922058105, 44.40974990732029], [86.28190040588377, 44.422133915322206], [86.26945495605469, 44.445300904220645], [86.26859664916992, 44.44677151408317], [86.2423324584961, 44.460740461239396], [86.23563766479492, 44.46453845673994], [86.23340606689452, 44.47103123156183], [86.23100280761719, 44.48303483736593], [86.22980117797852, 44.50972788000914], [86.2239646911621, 44.52147873914484], [86.22190475463866, 44.52404892371224], [86.220703125, 44.52796517739783], [86.22465133666991, 44.53848880455611], [86.23443603515624, 44.54362755923919], [86.23838424682616, 44.54693080488453], [86.2404441833496, 44.55145717041115], [86.23924255371094, 44.55243579775659], [86.2407875061035, 44.5537813834873], [86.24404907226562, 44.55537158105795], [86.24250411987303, 44.55641130212879], [86.24447822570801, 44.55720637041294], [86.24576568603516, 44.55763447960476], [86.24653816223145, 44.55867416024305], [86.24705314636229, 44.559469197608166], [86.25263214111327, 44.55989729015126], [86.31443023681639, 44.62590812197045], [86.32575988769531, 44.62835152767069], [86.3309097290039, 44.629573191951025], [86.34635925292969, 44.63323803051274], [86.34876251220703, 44.63494820931143], [86.3528823852539, 44.6391012908593], [86.35528564453125, 44.64423115768091], [86.36816024780273, 44.66926328335603], [86.38206481933592, 44.66816453877845], [86.38326644897461, 44.678784863896844], [86.38154983520508, 44.68537581091083], [86.39854431152342, 44.68354506750863], [86.41038894653319, 44.6907456577919], [86.38481140136719, 44.72734498176141], [86.3887596130371, 44.72929629565426], [86.38206481933592, 44.739905412820356], [86.3909912109375, 44.743319427333724], [86.39013290405272, 44.76282421425501], [86.40129089355467, 44.76611499788708], [86.3960552215576, 44.77318345478962], [86.39931678771973, 44.774036485915225], [86.40850067138672, 44.779885502772736], [86.39966011047363, 44.78378451819761], [86.40686988830565, 44.78908432002448], [86.41304969787598, 44.79657631303473], [86.42652511596678, 44.80595516075284], [86.43184661865234, 44.825560552012874], [86.4352798461914, 44.8344477567128], [86.43871307373045, 44.84175128249546], [86.451416015625, 44.85854587861506], [86.44386291503905, 44.861587853968516], [86.4181137084961, 44.87837666574494], [86.40729904174805, 44.87740353501266], [86.3829231262207, 44.876795319947576], [86.38412475585936, 44.889019208718665]]
      ,   // 用于绘制折线的各个坐标
      dialogTableVisible: false,
      list: null,
      mapplugin: [
        {
          pName: "MapType",
          defaultType: 1, //0代表默认，1代表卫星
          showTraffic: false, // 路网
          showRoad: false, // 路况
        },
      ],
      text_style: {
        background: 'transparent',
        border: 0,
      },
      center: [85.975579, 44.486883],
      zoom: 11,
      observeList: [],
      beginLong: 85.89690747,
      beginLat: 44.88899441,
      endLong: 86.384950,
      endLat: 44.364947,
      imgHeight: 1380,
      imgWidth: 1483,
      showId: true,
      data: {},
      tableKey: 0,
      listLoading: true,
      id: '',
      dateOptions: [{           // 日期选择，暂时使用的假数据，后续按照样地ID从数据库导入
        value: '选项1',
        label: '2023-6-17'
      }, {
        value: '选项2',
        label: '2023-6-18'
      }, {
        value: '选项3',
        label: '2023-8-17'
      }],
      dateSelect: '',
      value: '',
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      },
      tmp: '',
      stopSlideFlag: true,
      markerEvents: {
        click(e) {
          let id = e.target.w.extData.id
          let name = e.target.w.extData.name
          id = parseInt(id)

          //获取id的函数
          self.getId(id,name)
          self.getTableData(id)
          self.dialogTableVisible = true
        }
      },
      textEvents: {
        click(e) {
          let id = e.target.w.text     // 提取所点击标记点的id
          id = parseInt(id)
          // console.log(e)
          self.getTableData(id)    // 获取与点击的 id 相关的数据
          self.initChart(id)       // 根据点击的 id 初始化或更新图表
          self.dialogTableVisible = true
        }
      },
      dataList: [],
      total: '',
      pageLimit: 20,
      page: 1,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{required: true, message: 'type is required', trigger: 'change'}],
        timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
        title: [{required: true, message: 'title is required', trigger: 'blur'}]
      },
      samplePlotName_temp: '',
      imageBase64: ''
    }
  },
  computed: {
    imgStyle() {
      const {scale, deg, offsetX, offsetY, enableTransition} = this.transform
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`
      }
      return style
    },
  },
  created() {
    this.getData()
  },
  methods: {

    getId(id) {
      // console.log(id,name)
      this.ymh = id
      this.ymhName = name
    },
    getData() {
      get_all_coords().then(response => {    // 获取坐标点
        this.observeList = response.coords
        // console.log(this.observeList[0]['samplePlotName'])
        // console.log(this.observeList)
        // console.log(this.observeList[0].long, this.observeList[0].lat)
      })
    },
    showDialog(id) {
      this.getTableData(id)
      this.dialogTableVisible = true
    },
    getTableData(id) {
      this.getSamplePlotName(id)     // 把样地名字查找出来
      this.dataList = []
      this.list = []
      this.listLoading = true
      getSamplePlantList(id).then(response => {
        response['list'].forEach(samplePlantInfo => {
          let data = {
            id: samplePlantInfo.plantId,
            name: samplePlantInfo.plantClassification,
            longitude: samplePlantInfo.longitude,
            latitude: samplePlantInfo.latitude,
            height: samplePlantInfo.plantHeight,
            maxCrownWidth: samplePlantInfo.maxCrownWidth,
            minCrownWidth: samplePlantInfo.minCrownWidth,
            diameter: samplePlantInfo.groundDiameter,
            notes: samplePlantInfo.notes,
          }
          this.dataList.push(data)
          this.list = this.dataList.slice(0, this.pageLimit + 1)
          //list为row方法的内置变量，通过分页将datalist的内容传给list，再传给临时变量row，用于表格中的数据展示
          this.total = this.dataList.length
        })
      })
      this.listLoading = false
    },
    getSamplePlotName(id) {           // 根据id找样地名字
      getSamplePlotName(id).then(response => {
        this.samplePlotName_temp = response['samplePlotName']
        // console.log(response['samplePlotName'])
      })
    },
    checkImg() {      // 把id(样地的ID)传到后端获取缩略图，然后开一个新的网页展示缩略图
      console.log("访问图片的id:", this.ymh)
      getSampleImageList(this.ymh).then(response => {
        response['list'].forEach(samplePlantInfo => {
          this.imageBase64 = samplePlantInfo.imageBase64
        })
      })
      // console.log("前端接收到的：", this.imageBase64)
      const newWindow = window.open()
      if (newWindow) {
        // 在新窗口中写入HTML，显示Base64图片
        newWindow.document.write(`
          <html>
            <head>
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background-color: #fff; /* 设置背景色可选 */
                }
                img {
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                }
              </style>
            </head>
            <body>
              <img src="${this.imageBase64}" />
            </body>
          </html>
          `);
        newWindow.document.close(); // 关闭document写入流，完成页面加载
      } else {
        alert('无法打开新窗口，请允许浏览器弹出窗口。');
      }
    },

    //查看样地地图
    checkMap() {
      // this.showIframe = true;
      this.$router.push({path: '/device/map2D',samplePlotName: this.ymhName})
    },
    downLoadImg() {
      // 创建一个下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = this.imageBase64;
      downloadLink.download = 'image.png'; // 下载的文件名
      // 将链接添加到文档中（必须添加到DOM中才能有效触发点击）
      document.body.appendChild(downloadLink);
      // 模拟点击下载链接
      downloadLink.click();
      // 清理
      document.body.removeChild(downloadLink);
    },
    offPopover() {
      this.listLoading = true
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      };
    },
    handleActions(action, options = {}) {
      const {zoomRate, rotateDeg, enableTransition} = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      };
      const {transform} = this;
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
          }
          break;
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case 'clocelise':
          transform.deg += rotateDeg;
          break;
        case 'anticlocelise':
          transform.deg -= rotateDeg;
          break;
      }
      transform.enableTransition = enableTransition;
    },
    deviceSupportInstall() {
      this._mouseWheelHandler = rafThrottle(e => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: 0.13,
            enableTransition: false
          });
        } else {
          this.handleActions('zoomOut', {
            zoomRate: 0.13,
            enableTransition: false
          });
        }
      });
      // console.log(mousewheelEventName)
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    sortChange(data) {
      const {prop, order} = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    pageChange() {
      this.listLoading = true
      this.list = this.currentList.slice((this.page - 1) * this.pageLimit, this.page * this.pageLimit + 1)
      setTimeout(() => {
        this.listLoading = false
      }, 0.3 * 1000)
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

//.icon-div{
//  position: absolute;
//  width: 30px;
//  height: 30px;
//  transition: all 0.3s;
//  text-align: center;
//}
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
