<template>
    <div>
        <h2>欢迎访问K15后台管理系统</h2>
        <div id="map">
          <baidu-map class="map" :center="map.center" :zoom="map.zoom" @ready="handler">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
            <bm-local-search v-if="map.isAdd" class="search" :keyword="map.keyword" :auto-viewport="true" :location="map.location"></bm-local-search>
          </baidu-map>
        </div>

    </div>
</template>

<script>

export default {
  name: "mymap",
  data: () => ({
    map:{
      center: {lng: 121.4472540000, lat: 31.3236200000},
      zoom: 15,
      show: true,
      dragging: true
    },
  }),
  methods: {
    handler ({BMap, map}) {
      let me = this;
      console.log(BMap, map)
      // 鼠标缩放
      map.enableScrollWheelZoom(true);
      // 点击事件获取经纬度
      map.addEventListener('click', function (e) {
        console.log(e.point.lng, e.point.lat)
      })
    }
  }
}

</script>

<style scoped>
.map {
  width: 100%;
  height: 700px;
}
</style>