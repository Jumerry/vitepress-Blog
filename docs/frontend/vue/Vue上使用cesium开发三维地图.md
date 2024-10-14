---
outline: deep
title: Vue上使用cesium开发三维地图
---

# Vue上使用cesium开发三维地图

### 一、地图加载

效果如下：
![cesium2.gif](..%2F..%2Fpublic%2Fimg%2F1.gif)
#### 官方文档介绍

看着[官网的文档](https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/)，地图实例是这样创建下来的，见下图：

![2.png](..%2F..%2Fpublic%2Fimg%2F2.png)

但是`cesium`的`Viewer方法`中，是可以设置不少参数的，我们打开`cesium`的`API文档`看看

![3.png](..%2F..%2Fpublic%2Fimg%2F3.png)

![4.png](..%2F..%2Fpublic%2Fimg%2F4.png)


击上图的这个`Viewer.ConstructorOptions` 配置项看看

![5.png](..%2F..%2Fpublic%2Fimg%2F5.png)


#### 开始

实际开发中，都是开局一张展开的地图，屏幕上就是一张地图，其他什么都没有，效果如下图：

![6.png](..%2F..%2Fpublic%2Fimg%2F6.png)

贴上代码：<span style="color:orange">cesiumMap.vue</span>

```vue
<template>
  ...
</template>
<script>
export default {
  ...
  methods: {
    init() {
      ...
      const viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false, // 如果设置为false，将不会创建右上角图层按钮。
        geocoder: false, // 如果设置为false，将不会创建右上角查询(放大镜)按钮。
        navigationHelpButton: false, // 如果设置为false，则不会创建右上角帮助(问号)按钮。
        homeButton: false, // 如果设置为false，将不会创建右上角主页(房子)按钮。
        sceneModePicker: false, // 如果设置为false，将不会创建右上角投影方式控件(显示二三维切换按钮)。
        animation: false, // 如果设置为false，将不会创建左下角动画小部件。
        timeline: false, // 如果设置为false，则不会创建正下方时间轴小部件。
        fullscreenButton: false, // 如果设置为false，将不会创建右下角全屏按钮。
        scene3DOnly: true, // 为 true 时，每个几何实例将仅以3D渲染以节省GPU内存。
        shouldAnimate: false, // 默认true ，否则为 false 。此选项优先于设置 Viewer＃clockViewModel 。
        // ps. Viewer＃clockViewModel 是用于控制当前时间的时钟视图模型。我们这里用不到时钟，就把shouldAnimate设为false
        infoBox: false, // 是否显示点击要素之后显示的信息
        sceneMode: 3, // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
        requestRenderMode: false, // 启用请求渲染模式，不需要渲染，节约资源吧
        fullscreenElement: document.body, // 全屏时渲染的HTML元素 暂时没发现用处，虽然我关闭了全屏按钮，但是键盘按F11 浏览器也还是会进入全屏
        
      });
     ...
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped lang="scss">
    // 设置css样式，处理滚动条以及空白等问题
    #cesiumContainer{
        width:100%;
        height:100vh;
        margin:0;
        padding:0;
        overflow:hidden;
    }
</style>
```



#### 设置地图源

接下来，我们来设置地图的地图服务，我这里使用高德影像图

- 高德影像地形地图：

```js
https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}
```

- 高德影像注记地图：

```js
http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8
```

因为我们关掉了默认的图层切换按钮，所以我们需要给他配上这个地图源

![7.png](..%2F..%2Fpublic%2Fimg%2F7.png)

![8.png](..%2F..%2Fpublic%2Fimg%2F8.png)

我们配置地图源调用的是这个方法`Cesium.UrlTemplateImageryProvider`

![9.png](..%2F..%2Fpublic%2Fimg%2F9.png)


#### 定位

我们要让地图一加载就定位到一个位置，我这里以张家港为例，那我正常的流程应该是：

1. 页面一加载
2. 展示出来的是高德地图，有地图有标注
3. 地图直接定位到张家港

定位操作，要先设置一个区域，作为初始位置，确定区域的方法是`BoundingSphere`

![10.png](..%2F..%2Fpublic%2Fimg%2F10.png)

然后要定位到这个初始位置，`new Cesium.Camera.flyTo`

![11.png](..%2F..%2Fpublic%2Fimg%2F11.png)

![12.png](..%2F..%2Fpublic%2Fimg%2F12.png)

贴上代码：<span style="color:orange">cesiumMap.vue</span>

```vue
<template>
  ...
</template>
<script>
export default {
  ...
  methods: {
    init() {
      ...
      const viewer = new Cesium.Viewer("cesiumContainer", {
        ...
        // 我使用高德影像地形地图
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        }),
        
      });
      // 再加上高德影像注记地图
      viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
        })
      );
      // 设置初始位置  Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result)
      const boundingSphere = new Cesium.BoundingSphere(
        Cesium.Cartesian3.fromDegrees(120.55538, 31.87532, 100),
        15000
      );
      // 定位到初始位置
      viewer.camera.flyToBoundingSphere(boundingSphere, {
        // 定位到初始位置的过渡时间，设置成0，就没有过渡，类似一个过场的动画时长
        duration: 0,
      });
     ...
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped lang="scss">
...
</style>

```

效果如下：

![13.gif](..%2F..%2Fpublic%2Fimg%2F13.gif)



#### 优化一下

因为这个创建出来的`实例 viewer`，只在`init方法`中，我们接下来要经常用到它，所以我们把这个`viewer`对象，提升到`data`中

![14.png](..%2F..%2Fpublic%2Fimg%2F14.png)



### 二、点位加载

效果如下：

![15.png](..%2F..%2Fpublic%2Fimg%2F15.png)

首先讲下，`entities`实体，通俗的讲，一个三维地图上，上面可以`放`一些`模型`，比方说，`放`一个`房子模型`，`放`一个`工厂模型`，这个房子，工厂，肉眼看上去，就是放在了地图上，你鼠标不管怎么移动视角，都看到这个房子，工厂，是和地图绑定在一块的。房子，工厂都是和地图一起移动的。这个我们人眼看到的`模型`，在cesium里面有个学名，就叫`实体`。

我们这次说的点位加载，它也属于实体，实体可以是二维的，也可以是三维的，我先讲下我们这个实体里面有哪些东西，在接下来讲二维和三维的实体。

#### entities

![16.png](..%2F..%2Fpublic%2Fimg%2F16.png)

![17.png](..%2F..%2Fpublic%2Fimg%2F17.png)

> entities的属性

![18.gif](..%2F..%2Fpublic%2Fimg%2F18.gif)



#### 开始

代码如下：

```vue
<template>
  <div id="container" class="box">
    <div id="cesiumContainer"></div>
  </div>
</template>
<script>
export default {
  name: "cesiumMap",
  data() {
    return {
      viewer: undefined,
      pointInfo: [], // 点位信息
    };
  },
  methods: {
    init() {
      ...
    },
    loadPoints() {
      // 用模拟数据测试
      this.pointInfo = [
        {
          id: "392f7fbb-ae25-4eef-ac43-58fd91148d1f",
          latitude: "31.87532",
          longitude: "120.55538",
          psName: "有限公司1",
        },
        {
          id: "0278a88c-b4f4-4d64-9ccb-65831b3fb19d",
          latitude: "31.991057",
          longitude: "120.700713",
          psName: "有限公司2",
        },
        {
          id: "248f6853-2ced-4aa6-b679-ea6422a5f3ac",
          latitude: "31.94181",
          longitude: "120.51517",
          psName: "有限公司3",
        },
        {
          id: "F8DADA95-A438-49E1-B263-63AE3BD7DAC4",
          latitude: "31.97416",
          longitude: "120.56132",
          psName: "有限公司4",
        },
        {
          id: "9402a911-78c5-466a-9162-d5b04d0e48f0",
          latitude: "31.91604",
          longitude: "120.57771",
          psName: "有限公司5",
        },
        {
          id: "EB392DD3-6998-437F-8DCB-F805AD4DB340",
          latitude: "31.88727",
          longitude: "120.48887",
          psName: "有限公司6",
        },
      ];
      this.addMarker();
    },
    // cesium 加载点位
    addMarker() {
      const Cesium = this.cesium;
      // 清除上一次加载的点位
      this.viewer.entities.removeAll();
      // foreach循环加载点位
      this.pointInfo.forEach((pointObj) => {
         this.viewer.entities.add({
          name: pointObj.psName,
          code: pointObj.id,
          id: pointObj.id,
          position: Cesium.Cartesian3.fromDegrees(
            pointObj.longitude * 1,
            pointObj.latitude * 1
          ),
          // 点
          // point: {
          //   pixelSize: 5,
          //   color: Cesium.Color.RED,
          //   outlineColor: Cesium.Color.WHITE,
          //   outlineWidth: 2,
          // },
          // 文字标签
          label: {
            // show: false,
            text: pointObj.psName,  
            font: "12px monospace",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.LIME,
            outlineWidth: 4,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向以底部来计算标签的位置
            pixelOffset: new Cesium.Cartesian2(0, -20), // 偏移量
          },
          // 图标
          billboard: {
            image: require("@/assets/imgs/point.png"),
            width: 18,
            height: 24,
          },
        });
      });
    },
  },
  mounted() {
    this.init();
    this.loadPoints();
  },
};
</script>
<style scoped lang="scss">
...
</style>
```

效果如下：

![19.png](..%2F..%2Fpublic%2Fimg%2F19.png)

点位的图标 和 文字样式明显不协调，我们把文字的样式再改改

![20.png](..%2F..%2Fpublic%2Fimg%2F20.png)

![21.png](..%2F..%2Fpublic%2Fimg%2F21.png)

```javascript
label: {
    // show: false,
    text: pointObj.psName,
    font: "12px monospace",
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    // fillColor: Cesium.Color.LIME,
    fillColor: Cesium.Color.fromCssColorString(rgb(11, 255, 244)),
    outlineWidth: 4,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向以底部来计算标签的位置
    pixelOffset: new Cesium.Cartesian2(0, -20), // 偏移量
},
```

修改过后效果：

![22.png](..%2F..%2Fpublic%2Fimg%2F22.png)



### 三、点位弹框

效果如下：

![23.gif](..%2F..%2Fpublic%2Fimg%2F23.gif)



#### 点击事件

`ScreenSpaceEventHandler`

![24.png](..%2F..%2Fpublic%2Fimg%2F24.png)

`ScreenSpaceEventType`

![25.png](..%2F..%2Fpublic%2Fimg%2F25.png)

![26.png](..%2F..%2Fpublic%2Fimg%2F26.png)

![27.png](..%2F..%2Fpublic%2Fimg%2F27.png)



#### 经纬度获取

弹窗的实现效果是点击某个存在的点模型后在点的右侧打开，原理是通过获取点击点的`屏幕坐标`，将坐标的`y`和`x`分别赋值给`div`的`top`和`left`属性。我们现在要先拿到屏幕坐标。

![28.png](..%2F..%2Fpublic%2Fimg%2F28.png)

![29.png](..%2F..%2Fpublic%2Fimg%2F29.png)



#### 创建弹框

此处用到了cesiumAPI的`Sence`

![30.png](..%2F..%2Fpublic%2Fimg%2F30.png)

![31.png](..%2F..%2Fpublic%2Fimg%2F31.png)

![32.png](..%2F..%2Fpublic%2Fimg%2F32.png)

##### 1、创建弹窗div

创建弹框，两种方式，大家按照各自的实际情况来选择：

1. 可以直接在html中创建一个`<div>我是弹框</div>`的标签，然后弹框的内容通过`js往里面添加`
2. 也可以直接通过js的方法 `document.createElement('div');`的方法，在`js中创建html标签`，进而构造出弹框来

因为我们是`vue开发`，`组件思维`更适合我们的这个场景，我们就选用第一种方式，在html里面创建一个`<div>我是弹框</div>`标签，弹框里面的内容可能根据业务不同，展示的内容页不同，这个内容我们就通过组件的方式引进来，而且这种方式，也避免了在同一个.vue文件中，写大量的代码，避免了后期查看代码的复杂性。

`html`部分需要加上弹框

```vue
<template>
  <div id="container" class="box">
    <div id="cesiumContainer"></div>
    <!-- 地图弹框 -->
    <div class="dynamic-layer" id="one">
      <div class="line"></div>
      <div class="main">
        <cesiumPopup :pointInfo="popData" ref="popUp" />
      </div>
    </div>
  </div>
</template>
```

`css`部分需要设置样式

```css
// ---------------------------------------------------------- 弹框样式 ------------------------------------------------------
.dynamic-layer {
  display: none;
  user-select: none;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 534px;
  // width: 100%; // 这里设置成100%，打算在组件内根据内容设置具体的宽度实践 发现无效
  z-index: 99990;
}
.dynamic-layer .line {
  position: absolute;
  left: 0;
  width: 0;
  /* height: 100px; */
  bottom: 0;
  /* background: url(./images/line.png); */
}
.dynamic-layer .main {
  display: none;
  position: absolute;
  top: 0;
  left: 30px;
  right: 0;
  /* bottom: 100px; */
  transform: translateY(-100%);
  background: url(~@/assets/map/layer_border.png) no-repeat;
  background-size: 100% 100%;
  color: white;
  padding: 20px 20px 20px 20px;
  font-size: 14px;
  user-select: text;
  pointer-events: auto;
  background-color: rgba(3,22,37,.85);
}
// ---------------------------------------------------------- 弹框样式 ------------------------------------------------------
```

**大头戏**，`js`部分

```js
  methods: {
  init() {
      ...

      // 监听地图点击事件
      const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      // 单击事件
      handler.setInputAction((click) => {
        console.log("左键单击事件：", click.position);
        // 屏幕坐标转世界坐标——关键点
        const cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid);
        // 将笛卡尔坐标转换为地理坐标
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        // 将弧度转为度的十进制度表示，保留5位小数
        const lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
        const lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
        console.log(lon, lat);

        // 获取地图上的点位实体(entity)坐标
        const pick = this.viewer.scene.pick(click.position);
        // 如果pick不是undefined，那么就是点到点位了
        if (pick && pick.id) {
          // 定位到地图中心
          // this.locationToCenter(lon, lat);
          console.log(pick.id);
          const data = {
            layerId: "layer1", // 英文，且唯一,内部entity会用得到
            lon: lon,
            lat: lat,
            element: "#one", // 弹框的唯一id
            boxHeightMax: 0, // 中间立方体的最大高度
          };

          this.$("#one").css("z-index", 9990);
          this.showDynamicLayer(this.viewer, data, () => { // 回调函数 改变弹窗的内容;
            this.popData.title = pick.id.name;
            this.popData.pointId = pick.id.id;
          });
          // 调用弹框的默认方法
          this.$refs.popUp.defalutSetting();
        } else {
          // 移除弹框
          if (document.querySelector("#one")) {
            this.removeDynamicLayer(this.viewer, { element: "#one" });
            this.$("#one").css("z-index", -1);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
  ...
    // 创建一个动态实体弹窗
    showDynamicLayer(viewer, data, callback) {
      /* 弹窗的dom操作--默认必须*/
      this.$(data.element).css({ opacity: 0 }); // 使用hide()或者display是不行的 因为cesium是用pre定时重绘的div导致 left top display 会一直重绘
      this.$(".dynamic-layer .line").css({ width: 0 });
      this.$(data.element).find(".main").hide(0);
      /* 弹窗的dom操作--针对性操作*/
      callback();

      // 添加div弹窗
      const lon = data.lon * 1, lat = data.lat * 1;
      // data.boxHeightMax为undef也没事
      var divPosition = this.cesium.Cartesian3.fromDegrees(lon, lat, data.boxHeightMax);
      this.$("#one").css({ opacity: 1 });
      this.$("#one").find(".line").animate({
        width: 50 // 线的宽度
      }, 500, () => {
        this.$("#one").find(".main").fadeIn(500);
      });
      // 当为true的时候，表示当element在地球背面会自动隐藏。默认为false，置为false，不会这样。但至少减轻判断计算压力
      this.creatHtmlElement(viewer, data.element, divPosition, [10, -0], true);
    },

    // 创建一个 htmlElement元素 并且，其在earth背后会自动隐藏
    creatHtmlElement(viewer, element, position, arr, flog) {
      const Cesium = this.cesium;
      var ele = document.querySelector(element);
      var scratch = new Cesium.Cartesian2(); // cesium二维笛卡尔 笛卡尔二维坐标系就是我们熟知的而二维坐标系；三维也如此
      var scene = viewer.scene, camera = viewer.camera;
      scene.preRender.addEventListener(() => {
        var canvasPosition = scene.cartesianToCanvasCoordinates(position, scratch); // cartesianToCanvasCoordinates 笛卡尔坐标（3维度）到画布坐标
        if (Cesium.defined(canvasPosition)) {
          // ele.style.left = canvasPosition.x + arr[0] + "px";
          // ele.style.top = canvasPosition.y + arr[1] + "px";
           
          // 将弹框设置在点位的正上方
          // ele.style.left 中的 534/2 中 534是css样式里设置的弹框宽度，
          // ele.style.left 中的 15 中 30是点位图标宽度的一半
          // ele.style.left 中的 后面的3 就是对着页面微调之后加的增量，保证点位弹框刚好在点位的正上方
          // ele.style.top 中的 30 是点位图标的高度， 图标是30*30的
          // ele.style.top 中的 22 是因为点位上方还有label(点位名称)，弹框不能遮住label，微调出来的结果
          ele.style.left = (canvasPosition.x + arr[0] - 534/2 - 15 + 15) + 'px';
          ele.style.top = (canvasPosition.y + arr[1] - 30 - 22) + 'px';
            
          /* 此处进行判断**/// var px_position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian)
          if (flog && flog == true) {
            var e = position, i = camera.position, n = scene.globe.ellipsoid.cartesianToCartographic(i).height
            if (!(n += 1 * scene.globe.ellipsoid.maximumRadius, Cesium.Cartesian3.distance(i, e) > n)) {
              // $(element).show()
              ele.style.display = "block";
            } else {
              ele.style.display = "none";
              // $(element).hide()
            }
          }
        }
      });
    },

    // 移除动态弹窗 为了方便 这里的移除 是真的移除，因此 到时是需要重建弹窗的doom的
    removeDynamicLayer(viewer, data) {
      document.querySelector(data.element).style.opacity = 0;
    },
  },
```



##### 2、绑定到点击事件

在`左键点击监听事件`中调用，在点击事件中通过`pick`来判断`是否选中点对象`(该方法可在`官方api`中学习到)。点击监听事件的基础上进行了扩展，通过pick判断是否选中对象，`选中`后`打开弹窗`，展示传入的信息



##### 3、使弹窗跟随点移动

不论缩放地图或者移动点，都会造成弹窗的移动的需求，那么就要通过监听来完成弹窗移动的效果。

预渲染`preRender`

![33.png](..%2F..%2Fpublic%2Fimg%2F33.png)

`scene`，我的理解，它就是渲染之后的整个`canvas`对象，地图一系列的东西都在这个`canvas`中

![33.5.png](..%2F..%2Fpublic%2Fimg%2F33.5.png)

`viewer.scene.preRender.addEventListener`

![34.png](..%2F..%2Fpublic%2Fimg%2F34.png)

Cesium虚拟场景中所有3D图形对象和状态的容器，获取在场景更新之后和场景渲染之前立即引发的事件。



### 四、定位及优化

#### 开始

用到的api是`new Cesium.BoundingSphere`

![35.png](..%2F..%2Fpublic%2Fimg%2F35.png)

然后要定位到这个初始位置，`new Cesium.Camera.flyTo`

![36.png](..%2F..%2Fpublic%2Fimg%2F36.png)

![37.png](..%2F..%2Fpublic%2Fimg%2F37.png)

上面这2个`api`之前在讲`地图加载`的时候已经介绍过了，其实这里就是把之前的api复用一下。

代码如下：

```js
// 点位定位到地图中心
    locationToCenter(lon, lat) {
      const Cesium = this.cesium;
      const pointLocation = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(lon * 1, lat * 1, 100), 15000); // 120.55538, 31.87532
      this.viewer.camera.flyToBoundingSphere(pointLocation);
    },
```

然后在`init()`中点击点位的时候加入这个方法

```js
init() {
      ...

      // 监听地图点击事件
      const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      // 单击事件
      handler.setInputAction((click) => {
        ...

        // 获取地图上的点位实体(entity)坐标
        const pick = this.viewer.scene.pick(click.position);
        // 如果pick不是undefined，那么就是点到点位了
        if (pick && pick.id) {
          // 定位到地图中心
          this.locationToCenter(lon, lat);
          ...
        } else {
          // 移除弹框
          if (document.querySelector("#one")) {
            this.removeDynamicLayer(this.viewer, { element: "#one" });
            this.$("#one").css("z-index", -1);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
```

![38.gif](..%2F..%2Fpublic%2Fimg%2F38.gif)



#### 优化弹框内容

用`axios`方式`加载json数据`，json数据如下：

```json
{
  "success": true,
  "code": 200,
  "msg": "操作成功",
  "count": 8,
  "data": {
    "lowValue": "0",
    "unit": "mg/l",
    "upperValue": "1",
    "factorCode": "w21003",
    "tstamp": "2020-06-30 09:00:00",
    "factorName": "氨氮",
    "data": [
      {
        "tstamp": "2020-10-20 15:00:00",
        "factorValue": "0.32"
      },
      {
        "tstamp": "2020-10-20 16:00:00",
        "factorValue": "0.1"
      },
      {
        "tstamp": "2020-10-20 17:00:00",
        "factorValue": "0.1"
      },
      {
        "tstamp": "2020-10-20 18:00:00",
        "factorValue": "0.2"
      },
      {
        "tstamp": "2020-10-20 19:00:00",
        "factorValue": "0.3"
      },
      {
        "tstamp": "2020-10-20 20:00:00",
        "factorValue": "0.1"
      },
      {
        "tstamp": "2020-10-20 21:00:00",
        "factorValue": "0.4"
      },
      {
        "tstamp": "2020-10-20 22:00:00",
        "factorValue": "0.1"
      },
      {
        "tstamp": "2020-10-20 23:00:00",
        "factorValue": "0.4"
      },
      {
        "tstamp": "2020-10-21 00:00:00",
        "factorValue": "0.1"
      },
      {
        "tstamp": "2020-10-21 01:00:00",
        "factorValue": "0.8"
      },
      {
        "tstamp": "2020-10-21 02:00:00",
        "factorValue": "0.1"
      },
      {
        "tstamp": "2020-10-21 03:00:00",
        "factorValue": "0.1"
      },
      {
        "tstamp": "2020-10-21 04:00:00",
        "factorValue": "0.1"
      },
      {
        "tstamp": "2020-10-21 05:00:00",
        "factorValue": "0.3"
      },
      {
        "tstamp": "2020-10-21 06:00:00",
        "factorValue": "0.2"
      },
      {
        "tstamp": "2020-10-21 07:00:00",
        "factorValue": "0.1"
      },
      {
        "tstamp": "2020-10-21 08:00:00",
        "factorValue": "0.7"
      },
      {
        "tstamp": "2020-10-21 09:00:00",
        "factorValue": "0.1"
      },
      {
        "tstamp": "2020-10-21 10:00:00",
        "factorValue": "0.3"
      },
      {
        "tstamp": "2020-10-21 11:00:00",
        "factorValue": "0.14"
      },
      {
        "tstamp": "2020-10-21 12:00:00",
        "factorValue": "0.12"
      },
      {
        "tstamp": "2020-10-21 13:00:00",
        "factorValue": "0.05"
      },
      {
        "tstamp": "2020-10-21 14:00:00",
        "factorValue": "0.2"
      }
    ]
  }
}
```

`cesiumPopup.vue`弹框的内容如下，基本都有注释，都能看得懂

```vue
<template>
  <div style="width: 532px;">
    <div class="header">
      <div class="title">{{pointInfo.title}}</div>
      <div class="dateTime">{{dateTime}}</div>
    </div>
    <div class="pop-tab">
      <div :class="{'tab':true, 'checked': item.checked}"
        v-for="(item) in choseList" :key="item.code"
        @click="choseType(item)">
        {{item.label}}
      </div>
    </div>
    <div class="factorUnitText">单位：{{curChosedUnit}}</div>

    <div v-show="isChartHaveData" style="width: 435px; height: 170px;">
      <Echart ref="FactorChart" :options="echartObj" :autoResize="true" style="width: 435px; height: 170px;"/>
    </div>
    <div v-show="!isChartHaveData" style="width: 445px;height: 170px;color:#909399;text-align: center;line-height: 170px;">暂无数据</div>
  </div>
</template>
<script>
export default {
  props: {
    pointInfo: {
      type: Object, // 要传的值的类型
      default() {
        return {
          pointId: "--",
          title: "--",
        };
      },
    },
  },
  data() {
    return {
      // tab 列表
      choseList: [
        { code: "SO2", label: "SO2", unit: "μg/m3", checked: true },
        { code: "NO2", label: "NO2", unit: "μg/m3", checked: false },
        { code: "PM10", label: "PM10", unit: "μg/m3", checked: false },
        { code: "CO", label: "CO", unit: "μg/m3", checked: false },
        { code: "O38", label: "O3-8", unit: "μg/m3", checked: false },
        { code: "PM25", label: "PM2.5", unit: "μg/m3", checked: false },
      ],
      // 默认选中的项
      curChosed: "SO2", // 当前选中因子编码
      curChosedLabel: "SO2", // 当前选中因子名称
      curChosedUnit: "μg/m3", // 当前选中因子单位
      echartObj: {}, // 图表对象
      dateTime: "--", // 传的时间
      lineChartData: [], // 接口返回的图表数据
      upperValue: "", // 上限值
      isChartHaveData: false, // false 图表无数据 true 图表有数据
    };
  },
  methods: {
    choseType(item) {
      // 清空上一次的图表
      this.echartObj = {};
      this.choseList.forEach((element) => {
        element.checked = false;
      });
      item.checked = true;
      this.curChosed = item.code;
      this.curChosedLabel = item.label;
      this.curChosedUnit = item.unit;
      this.loadEcharts();
    },
    loadEcharts() {
      this.dateTime = "";
      this.isChartHaveData = false;

      // 调用 具体的方法
      this.$apiMethods
        .getChartData(this.pointInfo.pointId, this.curChosed)
        .then((res) => {
          // console.log(res.data.data);
          if (res.data != null) {
            this.dateTime = res.data.tstamp;
            this.upperValue = res.data.upperValue;
            if (res.data.data != null && res.data.data.length > 0) {
              this.isChartHaveData = true;
              this.lineChartData = res.data.data;
              this.drawChart();
            } else {
              this.isChartHaveData = false;
            }
          } else {
            this.isChartHaveData = false;
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.isChartHaveData = false;
          }, 8000);
        });
    },
    drawChart() {
      const XData = []; // 横坐标数据
      const YData = []; // 纵坐标数据
      const limitData = []; // 限值数据

      this.lineChartData.forEach((item) => {
        XData.push(item.tstamp);
        YData.push(item.factorValue);
        limitData.push(this.upperValue);
      });

      const seriesData = [
        {
          name: this.curChosedLabel,
          type: "line",
          smooth: true,
          stack: "总量",
          data: YData,
          areaStyle: {},
          itemStyle: {
            normal: {
              lineStyle: {
                width: 3, // 折线宽度
                color: "rgba(252, 254, 0, 1)",
              },
            },
          },
        }
      ];

      if (this.upperValue != null && this.upperValue != "") {
        seriesData.push({
          name: "标准限值",
          type: "line",
          showSymbol: false,
          data: limitData,
          lineStyle: {
            normal: {
              width: 1,
              color: "#e74143", // 这儿设置安全基线颜色
              type: "dashed",
            },
          },
        });
      }

      this.echartObj = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        grid: {
          top: "6%",
          left: "6%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: XData,
          axisLine: { // x轴线的颜色以及宽度
            show: true,
            lineStyle: {
              color: "white",
              width: 1,
              type: "solid",
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "white",
            },
            // 坐标轴刻度标签的相关设置。
            formatter(params) {
              let newParamsName = ""; // 最终拼接成的字符串
              const paramsNameNumber = params.length; // 实际标签的个数
              const provideNumber = 10; // 每行能显示的字的个数
              const rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                // eslint-disable-next-line no-plusplus
                for (let p = 0; p < rowNumber; p++) {
                  let tempStr = ""; // 表示每一次截取的字符串
                  const start = p * provideNumber; // 开始截取的位置
                  const end = start + provideNumber; // 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p === rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = `${params.substring(start, end)}\n`;
                  }
                  newParamsName += tempStr; // 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params;
              }
              // 将最终的字符串返回
              return newParamsName;
            },
          },
        },
        yAxis: {
          type: "value",
          axisTick: false,
          axisLabel: {
            show: true,
            textStyle: {
              color: "white",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#777"],
              opacity: 0.3,
              width: 1,
              type: "solid",
            },
          },
          axisLine: { // y轴线的颜色以及宽度
            show: false,
            lineStyle: {
              color: "#9dcbfb",
              width: 1,
              type: "solid",
            },
          },
        },
        itemStyle: { // 面积图颜色设置
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(252, 254, 0, 1)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(252, 254, 0, 0.1)", // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          },
        },
        series: seriesData,
      };
    },
    clearEcharts() {
      this.$refs.FactorChart.dispose(); // 组件销毁时清除定时器
    },
    // 因为弹框组件是一直放在cesiumMap.vue中，没有使用v-if，所以它是一直就存在的，所以我们想让弹框一打开，就调用mounted()钩子，调用加载loadEcharts方法，是没有用的
    // 因此，我们这边要做一个弹框每次打开就会调用的方法
    defalutSetting() {
      // 恢复默认设置
      this.choseList.forEach((element) => {
        element.checked = false;
        if (element.code == "SO2") {
          element.checked = true;
          this.curChosed = "SO2";
          this.curChosedLabel = "SO2";
          this.unit = "μg/m3";
        }
      });
      this.loadEcharts();
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.header{
  position: relative;
  margin-bottom: 15px;
  .title{
    display: inline-block;
    color: #19ffff;
    font-weight: 700;
    font-size: 18px;
  }
  .dateTime{
    color: #00de00;
    transform: skew(-20deg);
    font-size: 21px;
    padding-left: 10px;
    padding-right: 10px;
    position: absolute;
    right: 75px;
    top: 0px;
  }
}
.pop-tab {
  .tab {
    display: inline-block;
    width: 60px;
    height: 40px;
    background-color: transparent;
    cursor: pointer;
    text-align: center;
    line-height: 40px;
  }
  .checked {
    background-color: #00a2ff;
    border-radius: 7px;
  }
}
.factorUnitText {
  color: white;
  width: 100px;
  padding: 5px 0px 0px 10px;
}
</style>
```

实现效果：

![39.gif](..%2F..%2Fpublic%2Fimg%2F39.gif)



#### 修改弹框位置

![40.png](..%2F..%2Fpublic%2Fimg%2F40.png)

在`GIS项目`中，一般都会在`地图的左右两侧`设置`2个容器`，这两个容器里面放的内容，一般`左边容器`里放的是`点位的列表`，或者`点位的树形结构`，对这些点位操作，比如，`点位`的`定位`，`打开弹框`等同于`在地图上操作点位图标`，还有`隐藏/显示点位`。

**两个问题**：

1. 点位弹框在右侧展示，如果弹框比较大，而右侧容器又比较宽，像上图的情况，`弹框就和右侧容器相交了`，部分`内容被遮住`了，看`数据看的不全`了
2. 这个问题也是昨天留下来的第三个问题，在`左侧容器里操作点位`，虽然`功能上和在地图上操作点位图标一样`，但`有个效果不同`，那就是在地图上操作点位图标，会有一个`绿色的四角框`出现，但是我在`左侧容器里操作`，是`不会有四角框出现`的，因为我没在地图上点击啊

**解决第一个问题**：让点位弹框出现在点位的正上方，上篇文章已经说了弹框实现式，出现位置的原理，看下图：

![40.5.png](..%2F..%2Fpublic%2Fimg%2F40.5.png)

那么这次我们只要修改这个弹框的`div`的`top`和`left`:

```js
...
  methods: {
  ...
  // 创建一个 htmlElement元素 并且，其在earth背后会自动隐藏
    creatHtmlElement(viewer, element, position, arr, flog) {
      ...
        if (Cesium.defined(canvasPosition)) {
          // 将弹框设置在点位的正上方
          // ele.style.left 中的 534/2 中 534是css样式里设置的弹框宽度，
          // ele.style.left 中的 15 中 30是点位图标宽度的一半
          // ele.style.left 中的 后面的3 就是对着页面微调之后加的增量，保证点位弹框刚好在点位的正上方
          // ele.style.top 中的 30 是点位图标的高度， 图标是30*30的
          // ele.style.top 中的 22 是因为点位上方还有label(点位名称)，弹框不能遮住label，微调出来的结果
          ele.style.left = (canvasPosition.x + arr[0] - 534/2 - 15 + 5) + 'px';
          ele.style.top = (canvasPosition.y + arr[1] - 30 - 22) + 'px';
          ...
        }
      });
    },
  ...
  }
...
```

![41.gif](..%2F..%2Fpublic%2Fimg%2F41.gif)



**解决第二个问题**：要让弹框出现的时候知道，这个弹框对应的是哪个点位，聪明的你肯定猜到了，那就给弹框下方加一个箭头呗，没错，我们画一个箭头放在下方即可。然后，有箭头了，那么cesium自带的点击点位，出现的四角框，就拿掉吧

代码如下： `html`部分

```vue
<template>
  <div id="container" class="box">
    <div id="cesiumContainer"></div>
    <!-- 地图弹框 -->
    <div class="dynamic-layer" id="one">
      <div class="line"></div>
      <div class="main">
        <cesiumPopup :pointInfo="popData" ref="popUp" />
        <!-- 多了这个 -->
        <div class="tooltip-arrow"></div>
      </div>
    </div>
  </div>
</template>
```

`css`部分

```css
...

.tooltip-arrow{
  position: absolute;
  left: 45%;
  bottom: -21px;
  width: 0;
  height: 0;
  border-top: 12px solid rgba(3, 22, 37, 0.85);
  border-right: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid transparent;
}
```

`js`部分

```js
  ...
  methods: {
    init() {
    ...
    this.viewer = new Cesium.Viewer("cesiumContainer", {
        ...
        selectionIndicator: false, // Cesium 关闭点击绿色框
        ...
    });
    ...
    }
    ...
 },
 ...
```

最后效果：

![42.gif](..%2F..%2Fpublic%2Fimg%2F42.gif)



### 五、点击波纹特效

#### 1、实现思路

1. 给`cesium`的`viewer实例`，添加`add`两个`圆弧`的`实体`，就和之前的`点位实体`一样，
2. 写两个`回调函数`，( Cesium中使用圆的扩散，可以采用回调函数来进行绘制，这样可以可以获得动态扩散的效果)
3. 然后通过延时函数setTimeOut，让这2个圆弧实体，间隔一定的时间，调用上面的回调函数，形成一种像波纹一样在扩散的效果

> 1.先构造出需要的圆弧

```js
// methods 中的 addCircleRipple(viewer, data)方法

/**
     * 圆扩散构造方法
     * @param  {Object}  viewer  viewer实例对象
     * @param  {Object}  data    配置项
     */
    addCircleRipple(viewer, data) {
      const Cesium = this.cesium;
      var r1 = data.minR, r2 = data.minR;
      // 通过 entities.getById()方法找到要操作的实体
      // 移除上一次的波纹效果
      if (viewer.entities.getById(data.id[0])) {
        viewer.entities.remove(viewer.entities.getById(data.id[0]))
      }

      if (viewer.entities.getById(data.id[1])) {
        viewer.entities.remove(viewer.entities.getById(data.id[1]))
      }

      // 回调函数1
      function changeR1() { //这是callback，参数不能内传
        r1 = r1 + data.deviationR;
        if (r1 >= data.maxR) {
          r1 = data.minR;
        }
        return r1;
      }
      // 回调函数2
      function changeR2() {
        r2 = r2 + data.deviationR;
        if (r2 >= data.maxR) {
          r2 = data.minR;
        }
        return r2;
      }
      viewer.entities.add({
        id: data.id[0],
        name: "",
        position: Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.height),
        ellipse: {
          // 这里为什么一个方法要写成 changeR1 changeR2
          // 因为 Cesium中使用圆的扩散，可以采用回调函数来进行绘制，这样可以可以获得动态扩散的效果。但是做的过程中遇到一个长半轴小于短半轴的报错
          // 原因
          // semiMinorAxis和semiMajorAxis使用同一个回调函数，并且semiMajorAxis属性要早于semiMinorAxis属性，所以造成长半轴小于短半轴。
          // 解决方案：
          // semiMinorAxis使用另一个回调函数
          // 关于这里的报错，可以看最下方的参考文章那里
          semiMinorAxis: new Cesium.CallbackProperty(changeR1, false),
          semiMajorAxis: new Cesium.CallbackProperty(changeR2, false),
          height: data.height,
          material: new Cesium.ImageMaterialProperty({
            image: data.imageUrl,
            repeat: new Cesium.Cartesian2(1.0, 1.0),
            transparent: true,
            color: new Cesium.CallbackProperty(function () {
                var alp = 1 - r1 / data.maxR;
                return Cesium.Color.WHITE.withAlpha(alp)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
            }, false)
          })
        }
      });
      setTimeout(function () {
        viewer.entities.add({
          id: data.id[1],
          name: "",
          position: Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.height),
          ellipse: {
            semiMinorAxis: new Cesium.CallbackProperty(changeR1, false),
            semiMajorAxis: new Cesium.CallbackProperty(changeR2, false),
            height: data.height,
            material: new Cesium.ImageMaterialProperty({
              image: data.imageUrl,
              repeat: new Cesium.Cartesian2(1.0, 1.0),
              transparent: true,
              color: new Cesium.CallbackProperty(function () {
                  var alp = 1;
                  alp = 1 - r2 / data.maxR;
                  return Cesium.Color.WHITE.withAlpha(alp)
              }, false)
            })
          }
        });
      }, data.eachInterval);
    }
```

> 2.选中效果

```js
// methods 中的 addCircleRippleInit(viewer, long, lat, height)方法
// 添加点位选中特效
/**
 * 圆扩散调用方法
 * @param  {String}  long   经度
 * @param  {String}  lat    维度
 * @param  {String}  height 高度
 */
addCircleRippleInit(viewer, long, lat, height) {
  let data = {
      id: ["abcd-111", "abcd-222"], // 2个实现圆弧效果的实体id，后面对这2个实体的操作都是通过这个id来的
      lon: long * 1, // 经度 就不多说了
      lat: lat * 1, // 维度 也不多说了
      height: height, // 因为是3d地图，地图上的实体会有高度属性，可以设置实体的高度
      maxR: 40,                       // 圆弧的最大半径
      minR: 0,                        // 最好为0
      deviationR: 0.3,                  // 差值 差值也大 速度越快
      eachInterval: 1000,             // 两个圈的时间间隔
      imageUrl: require("@/assets/map/red_circle.png"),
    };
  // 调用上面构造圆弧的方法
  this.addCircleRipple(viewer, data);
},
```

代码中用到的圆弧图片,`red_circle.png`

![43.png](..%2F..%2Fpublic%2Fimg%2F43.png)

> 3. 使用在`鼠标单击的事件`中`调用圆弧特效方法`

```js
 methods: {
    init() {
      ...
      // 监听地图点击事件
      const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      // 单击事件
      handler.setInputAction((click) => {
        ...

        // 获取地图上的点位实体(entity)坐标
        const pick = this.viewer.scene.pick(click.position);
        // 如果pick不是undefined，那么就是点到点位了
        if (pick && pick.id) {
          // 得到点位的经纬度
          const cartographic2 = Cesium.Cartographic.fromCartesian(pick.id.position._value);
          const lon2 = Cesium.Math.toDegrees(cartographic2.longitude).toFixed(5);
          const lat2 = Cesium.Math.toDegrees(cartographic2.latitude).toFixed(5);
          // 定位到地图中心
          this.locationToCenter(lon2, lat2);
          // 添加弹框特效
          this.addCircleRippleInit(this.viewer, lon2, lat2, 1);
          console.log(pick.id);
          const data = {
            layerId: "layer1", // 英文，且唯一,内部entity会用得到
            lon: lon2,
            lat: lat2,
            element: "#one", // 弹框的唯一id
            boxHeightMax: 0, // 中间立方体的最大高度
          };

          ...
        } else {
          // 移除弹框
          if (document.querySelector("#one")) {
            this.removeDynamicLayer(this.viewer, { element: "#one" });
            this.$("#one").css("z-index", -1);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    ...
}
```



#### 2、点位移除特效

```js
methods: {
    init() {
        ...
        // 监听地图点击事件
      const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      // debugger;
      // 单击事件
      handler.setInputAction((click) => {

        ...

        if (pick && pick.id) {

          ...

        } else {
          // 移除弹框
          if (document.querySelector('#one')) {
            this.removeDynamicLayer(this.viewer, { element: '#one' });
            this.$('#one').css('z-index', -1);
          }
          // 移除波纹特效
          if (this.viewer.entities.getById("abcd-111")) {
            this.viewer.entities.remove(this.viewer.entities.getById("abcd-111"))
          }
          if (this.viewer.entities.getById("abcd-222")) {
            this.viewer.entities.remove(this.viewer.entities.getById("abcd-222"))
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      ...
   },
   ...
}
```



### 六、加载三维数据

#### 3d tiles简介

简单介绍下 3d tiles

3DTiles数据集是cesium小组AnalyticlGraphics与2016年3月定义的一种数据集，3DTiles数据集以分块、分级渲染，将大数据量三维数据以分块，分层的形式组织起来，可以大量减轻浏览器和GPU的负担是一个优秀的，并且格式公开的数据格式。

3D Tiles是用于流式传输大规模异构3D地理空间数据集的开放规范。为了扩展Cesium的地形和图像流，3D Tiles将用于流式传输3D内容，包括建筑物，树木，点云和矢量数据。



#### 加载3d模型

在 `vue.config.js` 中配置本地数据的代理

![44.png](..%2F..%2Fpublic%2Fimg%2F44.png)

这里解释一下为什么调用这个3d模型要像调接口数据一样调用，因为cesium里面加载3d模型的方法是一个Promise

![45.png](..%2F..%2Fpublic%2Fimg%2F45.png)

加载模型方法代码如下

```js
 methods: {
    // 加载3d模型  3D Tiles
    // 数据来源 https://gitee.com/HQCode/Cesium-test/blob/master/lesson02/Scene/testm3DTiles.json
    load3DTiles() {
      const Cesium = this.cesium;
      let tilesetModel = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: "LocalDemoApi/Scene/testm3DTiles.json",
      }));
      tilesetModel.readyPromise.then((currentModel) => {
        // 定位到模型
        this.viewer.zoomTo(currentModel, new Cesium.HeadingPitchRange(0.5, -0.2, currentModel.boundingSphere.radius * 1.0));
      }).otherwise((error) => {
        console.log(error);
      });
    },
  ...  
  }
```

![46.gif](..%2F..%2Fpublic%2Fimg%2F46.gif)

模型是加载出来了，但是位置不太对，模型出现在了空中，这是为什么？ 理由也很简单，

1. 3d tiles文件生成时本身就具有位置和高度， 生成的数据不一定是落在地面上，有可能是浮在空中的，这并不是我们想要的,我们希望拍摄的成果能贴到地面上。
2. 单个瓦片的位置信息是写到了数据中的(.b3dm和对应的json文件中),如果能整体调整加载后的tileset，就会是最好的选择
3. 是生成3dtiles文件时使用的底图和地形和cesium加载的可能不同，再加上人工调整模型位置具有一定的偏差，所以3dtiles模型加载到数字地球上之后，大部分概率是需要再次调整位置

调整3dtiles位置 本质是通过 **矩阵运算** 来实现的

![47.png](..%2F..%2Fpublic%2Fimg%2F47.png)

```js
    // 创建平移矩阵方法一
      // m = Cesium.Matrix4.fromArray([
      //     1.0, 0.0, 0.0, 0.0,
      //     0.0, 1.0, 0.0, 0.0,
      //     0.0, 0.0, 1.0, 0.0,
      //     x, y, z, 1.0
      // ]);

      //创建平移矩阵方法二
      var translation = Cesium.Cartesian3.fromArray([x, y, z]);
      m = Cesium.Matrix4.fromTranslation(translation);
      tilesetModel.modelMatrix = m;
```

我们只要不断的修改 x,y,z ，就可以调整物体的位置了

得到合适的 x,y,z ，在加载3d tiles 的时候，将modelMatrix 设置成 刚刚的x,y,z 值，就可以了

还有一种方法就是计算偏移量（高度为例）

```js
// 设置指定高度
function changeHeight(height) {
        height = Number(height);
        if (isNaN(height)) {
            return;
        }
        var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude,height);
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    }
```

调整3d模型的位置

![48.png](..%2F..%2Fpublic%2Fimg%2F48.png)

设置定位

![49.png](..%2F..%2Fpublic%2Fimg%2F49.png)

在这张图上，我们可以看到，它这个是3d 笛卡尔坐标，我们常态下都是对120.xx  30.xxx 这种形式的经纬度比较熟悉。

```js
// 经纬度转笛卡尔
fromDegrees(x,y,z) {
  return Cesium.Cartesian3.fromDegrees(x,y,z);
},
```



#### glTF模型实现

GLTF代表Graphics Language Transmission Format（图形语言传输格式）。这种跨平台格式已成为Web上的3D对象标准。它由OpenGL和Vulkan背后的3D图形标准组织Khronos所定义，这使得GLTF基本上成为3D模型的JPG格式：Web导出的通用标准。

Cesium提供了两种方式加载glTF模型，分别是通过 Entity API 和 Primitive API 两个 API 实现的。核心代码如下：

**Entity API**

```js
var position = Cesium.Cartesian3.fromDegrees(-120.05, 44, 0);
    var heading = Cesium.Math.toRadians(45);
    var pitch = 0;
    var roll = 0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    );
    var model_entity = viewer.entities.add({
      name: "gltf模型",
      position: position, // 笛卡尔坐标
      // 默认情况下，模型是直立的并面向东。
      // 通过 Quaternion 为 Entity.orientation 属性指定值来控制模型的方向，控制模型的航向，俯仰和横滚。
      orientation: orientation,
      model: {
        show: true,
        uri: "./data/models/DracoCompressed/CesiumMilkTruck.gltf",
        scale: 1.0, // 缩放比例
        minimumPixelSize: 128, // 最小像素大小
        maximumScale: 20000, // 模型的最大比例尺大小。 minimumPixelSize的上限
        incrementallyLoadTextures: true, // 加载模型后纹理是否可以继续流入
        runAnimations: true, // 是否应启动模型中指定的glTF动画
        clampAnimations: true, // 指定glTF动画是否应在没有关键帧的持续时间内保持最后一个姿势

        // 指定模型是否投射或接收来自光源的阴影 type:ShadowMode
        // DISABLED 对象不投射或接收阴影;ENABLED 对象投射并接收阴影;CAST_ONLY  对象仅投射阴影;RECEIVE_ONLY  对象仅接收阴影
        shadows: Cesium.ShadowMode.ENABLED,
        heightReference: Cesium.HeightReference.NONE,
      },
    });
    // viewer.trackedEntity = entity; // 相机保持在实体上
```

**Primitive API**

```js
var origin = Cesium.Cartesian3.fromDegrees(-120, 44.0, 0);
    // 创建一个本地的东北向上坐标系，其原点为经度-120度，纬度44.0度。
    // 可以随时更改模型的modelMatrix属性以移动或旋转模型。
    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
    var model = viewer.scene.primitives.add(
      Cesium.Model.fromGltf({
        url: "./data/models/DracoCompressed/CesiumMilkTruck.gltf",
        modelMatrix: modelMatrix,
        minimumPixelSize: 128,
        maximumScale: 20000,
      })
    );
    model.readyPromise.then(function (model) {
      // Play all animations when the model is ready to render
      model.activeAnimations.addAll();
    });
```

**直接从 GLTF 文件创建模型对象**

```js
// 创建模型
let modelGltf = new Cesium.Model.fromGltf({
    url: `/static/gltf/ship.glb`,
    modelMatrix: modelMatrix,
    scale: 0.4,
    id: 'ship_1',
    show: true,
    color: Cesium.Color.WHITE
});
// 加载模型
this.viewer.scene.primitives.add(modelGltf);
```

![image-20241012142313795.png](https://wp-cdn.4ce.cn/v2/8PIbfH4.png)

![image-20241012142330948.png](https://wp-cdn.4ce.cn/v2/SvfauXO.png) 

`viewer.entities.add` 和 `Cesium.Model.fromGltf` 是在 Cesium 中加载 glTF 模型的两种不同方法，它们各有特点：

1. 使用场景：
   - `viewer.entities.add` 主要用于创建和管理实体（entities），它提供了丰富的属性设置选项，比如位置、旋转、缩放等。通过这种方式加载 glTF 模型时，可以将模型作为实体的一部分进行操作。
   - `Cesium.Model.fromGltf` 则更专注于 glTF 模型本身，它直接从 glTF 文件创建一个 Cesium.Model 实例，适用于需要对模型有更多定制化需求的场合。
2. 灵活性与控制：
   - 使用 `viewer.entities.add` 时，可以方便地结合其他实体属性一起管理，如标签（labels）、多边形（polygons）等，便于构建复杂的应用场景。
   - 而 `Cesium.Model.fromGltf `提供了更细粒度的控制，例如访问模型的各个节点，实现动画效果或自定义渲染等高级功能。
3. 性能考量：
   - 对于大量模型的处理，`Cesium.Model.fromGltf `可能会提供更好的性能优化选项，因为它允许开发者更直接地控制模型的加载和渲染流程。
   - 相比之下，`viewer.entities.add `在管理少量模型时更加简便快捷，但在大规模应用中可能不如前者高效。
     选择哪种方式取决于具体的应用需求以及对模型控制的精细程度要求。如果你的应用需要高度定制化的模型展示或者复杂的交互逻辑，那么 `Cesium.Model.fromGltf` 可能更适合；反之，如果只需要简单地添加一些模型到场景中，并且希望快速实现，那么 viewer.entities.add 将是一个不错的选择。

