/**
 *
 * @file mapDraw.js
 * @author Librarian
 * @date 2023-06-19
 * @desc 기본 맵을 그릴때 사용하는 js 파일
 *
 */


var overviewMapControl = null; // 인덱스맵 컨트롤러
var indexMapView = null; // 인덱스맵 뷰
var rotationAngle = 0; // 화면 회전 각도
	
//마우스 위치에 따른 좌표값 전달 함수
/*var mousePositionCoordinateControl = new ol.control.MousePosition({
	  coordinateFormat: ol.coordinate.createStringXY(4),
	  projection: "EPSG:4326",
	  className: "custom-mouse-position",
	  target: document.getElementById("coordinate")
});*/

var mapView = new ol.View({
        center: [14151646.114382012, 4497700.055161816],
        zoom: 14, 
        minZoom: 7, 
        maxZoom: 18,
        rotation: rotationAngle
    });

	
// 기본지도 그리기
var _map = new ol.Map({
    target : 'map',
    layers : [
       baseLayers['VWorldMidnight'], sidoLayer, sggLayer, controlVectorLayer, controlTileImgLayer
    ],
    overlays: [],
    view : mapView,
    controls: ol.control.defaults({attributionOptions: { collapsible: true }})
    .extend([new ol.control.ZoomToExtent({ extent: [13599573.582313137, 4044710.672790877, 14753466.961306157, 4621963.110400528] })])
    /*.extend([mousePositionCoordinateControl])  //마우스 위치에 따른 좌표값 전달*/
    .extend([new ol.control.FullScreen()])
});
controlVectorLayer.on("change", ()=>{
	animateFeatures();		
})


//busRouteLayer.setVisible(false);

// 기본 인덱스 맵
var createIndexMap = function(crscode, basemapId) {
   _map.removeControl(this.overviewMapControl);
   this.overviewMapControl = null;
   this.indexMapView = null;
   var baseMapInfo = baseLayers[basemapId];
   var layer;
   var layers;
   var setUrl;
   var basemapName = basemapId;
   if (basemapName == "VWorld") {
     setUrl = "http://api.vworld.kr/req/wmts/1.0.0/2FCA8FDE-E460-349E-93D0-87AF2B3A3DCF/Base/{z}/{y}/{x}.png";
   }
     
   layer = new ol.layer.Tile({
       source : new ol.source.XYZ({
           projection : baseMapInfo.crscode,
           url : '/proxy/proxy.jsp?url=' + setUrl
       }),
       name : 'overviewMap',
       visible : true      
   });
   layers = [ layer ];
   
   layers = [
     new ol.layer.Tile({
       source : new ol.source.XYZ({
           projection : "EPSG:3857",
           url : setUrl
       }),
       name : 'overviewMap',
       visible : true,
       opacity : 1
     }), layer 
   ];
   
   var spanEl = document.createElement("div");
   spanEl.className = 'indexMap_span';
   spanEl.title = '접기';
   
   var colSpanEl = document.createElement("div");
   colSpanEl.className = 'indexMap_colspan';
   colSpanEl.title = '펼치기';
     
   var indexMapView = new ol.View({
     projection: _map.getView().getProjection().getCode(),
     resolution: _map.getView().getResolutions(),
     zoom: 14, minZoom: 7, maxZoom: 19          
   });
   this.overviewMapControl = new ol.control.OverviewMap({
       view : indexMapView,
       className : 'ol-overviewmap ol-custom-overviewmap',
       layers : layers,
       collapseLabel : spanEl,
       label : colSpanEl,
       collapsed : false
   });         
   //_map.addControl(this.overviewMapControl);
};

this.createIndexMap(_map.getView().getProjection().getCode(), _map.getLayers().getArray()[0].get("id"));