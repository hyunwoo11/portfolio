/**
 * 
 * @file lxCommon.js
 * @author Librarian
 * @date 2023-06-19
 * @desc 맵 생성에 필요한 layer 및 변수 모음 파일
 *
 */
/* ===================== 작업 레이어 ===========================================================*/
/*중심레이어 rmf_001000l_chginfo (변경 확인해봐야함)*/
var controlTileImgLayer = new ol.layer.Tile({
	visible: true,
	source: new ol.source.TileWMS({
		url: 'http://lxrdip.iptime.org:9999/geoserver/lxrdip/wms',
		params: {
			// 		    	 'FORMAT': 'application/openlayers',
			'FORMAT': 'image/png',
			'VERSION': '1.1.1',
			tiled: true,
			"STYLES": '',
			"LAYERS": 'lxrdip:rmf_001000l_chginfo' // workspace:layer
		}
	})
});

/*시도레이어 rd_legaldong_sido (변경예정)*/
var sidoLayer = new ol.layer.Vector({
	visible: true,
	minResolution: 100,
	hitTolerance: 100,
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: function(extent) {
			return 'http://lxrdip.iptime.org:9999/geoserver/lxrdip/wfs?'
				+ 'service=WFS&'
				+ 'version=1.1.0&'
				+ 'request=GetFeature&'
				+ 'typename=lxrdip:rd_legaldong_sido&'
				+ 'outputFormat=application/json&'
				+ 'srsname=EPSG:3857&'
				+ 'bbox='
				+ extent.join(',') + ',EPSG:3857';
		},
		strategy: ol.loadingstrategy.bbox
	}),
	style:function(feature){
		let ra = feature.get("ci_ratio")??0;
		let s = new ol.style.Style({
			text: new ol.style.Text({
				text: feature.get("sido_nm") + '(' + feature.get("ci_cnt") +')',
				fill: new ol.style.Fill({ color: 'rgb(45 170 235)' }),
				stroke: new ol.style.Stroke({ color: 'white', width: 3 }),
				font: '10px Arial',
			}),
	      stroke: new ol.style.Stroke({
	        color:'rgba(255, 255, 255, 0.5)',
	        width: 3,
	        lineCap: 'butt',
	        lineJoin: 'bevel'
	      }),
	      fill: new ol.style.Fill({
	        color: 'rgba('+ (255-ra) +',0, 0, 0.6)'
	      })
	    });	
		return s;
	}
});

/*시군구 레이어  rd_legaldong_sgg (변경예정)*/
var sggLayer = new ol.layer.Vector({
	visible: true,
	maxResolution: 100,
	minResolution:10,
	hitTolerance: 100,
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: function(extent) {
			return 'http://lxrdip.iptime.org:9999/geoserver/lxrdip/wfs?'
				+ 'service=WFS&'
				+ 'version=1.1.0&'
				+ 'request=GetFeature&'
				+ 'typename=lxrdip:rd_legaldong_sgg&'
				+ 'outputFormat=application/json&'
				+ 'srsname=EPSG:3857&'
				+ 'bbox='
				+ extent.join(',') + ',EPSG:3857';
		},
		strategy: ol.loadingstrategy.bbox
	}),
	style:function(feature){
		let ra = feature.get("ci_ratio")??0;
		let s = new ol.style.Style({
			text: new ol.style.Text({
				text: feature.get("sgg_nm") + '(' + feature.get("ci_cnt") +')',
				fill: new ol.style.Fill({ color: 'rgb(45 170 235)' }),
				stroke: new ol.style.Stroke({ color: 'white', width: 3 }),
				font: '10px Arial',
			}),
	      stroke: new ol.style.Stroke({
	        color:'rgba(169, 169, 169, 0.5)',
	        width: 3,
	        lineCap: 'butt',
	        lineJoin: 'bevel'
	      }),
	      fill: new ol.style.Fill({
	        color: 'rgba('+ (255-ra) +',0, 0, 0.5)'
	      })
	    });	
		return s;
	}
});

/*변화정보 레이어 (변경완료)*/
var controlVectorSource = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function(extent) {
		return 'http://lxrdip.iptime.org:9999/geoserver/lxrdip/wfs?'
			+ 'service=WFS&'
			+ 'version=1.1.0&'
			+ 'request=GetFeature&'
			+ 'typename=lxrdip:lx_ci_chnge_info_d&'
			+ 'outputFormat=application/json&'
			+ 'srsname=EPSG:3857&'
			+ 'bbox='
			+ extent.join(',') + ',EPSG:3857';
	},
	strategy: ol.loadingstrategy.bbox
});

/* 변화정보레이어 스타일 */
var controlVectorLayer = new ol.layer.Vector({
  source: controlVectorSource,
  maxResolution: 12,
  hitTolerance: 100, // Set the hit tolerance value in pixels
  style: function(feature) {
    if (feature.getGeometry().getType() !== 'LineString') {
      return null;
    }
    
    let sttsCd = commonSttsCdfn(feature.get('stts_cd'));
    var strokeColor, fillColor;
    
    switch (sttsCd) {
      case "예정":
        strokeColor = '#ff9600';
        fillColor = 'rgba(255, 0, 0, 0.1)';
        break;
      case "진행중":
        strokeColor = '#ff0000';
        fillColor = 'rgba(255, 0, 0, 0.1)';
        break;
      case "완료":
        strokeColor = '#00d304';
        fillColor = 'rgba(255, 0, 0, 0.1)';
        break;
      default:
        strokeColor = '#0080ff';
        fillColor = 'rgba(255, 0, 0, 0.1)';
        break;
    }
    
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: strokeColor,
        width: 5,
        lineCap: 'butt',
        lineJoin: 'bevel'
      }),
      fill: new ol.style.Fill({
        color: fillColor
      })
    });
  }
});
/* ===================== 작업 레이어 ===========================================================*/