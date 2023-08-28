/**
 * 
 * @file lxCommon.js
 * @author Librarian
 * @date 2023-06-19
 * @desc 맵 생성에 필요한 layer 및 변수 모음 파일
 *
 */

var INTERACTION_IDENTIFIER = 'interactionIdentifier'; //인터랙션을 식별하기 위한 식별자 설정
var apiKey ="89B8A288-51E9-3268-8CC5-33FB004FCFBB";

function hexToRgba(hex, opacity) {
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

//URL 빌더 메서드
function urlBuilder(typename) {
	var url = 'http://lxrdip.iptime.org:9999/geoserver/lxrdip/wfs';
	var query = {
			service: 'WFS',
	    version: '1.0.0',
	    request: 'GetFeature',
	    typename: typename,
	    srsName: 'EPSG:3857',
	    outputFormat: 'application/json',
	    exceptions: 'application/json'
	}
	var param;
	var keys = Object.keys(query);
	
	for(var i = 0; i < keys.length; i++){
		if(i < keys.length){
			param += `${keys[i]}=${query[keys[i]]}`;
			param += '&';
		} else {
			param += `${keys[i]}=${query[keys[i]]}`;
		}
	}
	
	return `${url}?${param}`;
}

/*var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var pixelRatio = ol.has.DEVICE_PIXEL_RATIO;

function gradient(feature, resolution) {
        var extent = feature.getGeometry().getExtent();
        // Gradient starts on the left edge of each feature, and ends on the right.
        // Coordinate origin is the top-left corner of the extent of the geometry, so
        // we just divide the geometry's extent width by resolution and multiply with
        // pixelRatio to match the renderer's pixel coordinate system.
        var grad = context.createLinearGradient(0, 0, ol.extent.getWidth(extent) / resolution * pixelRatio, 0);
        grad.addColorStop(0, 'red');
        grad.addColorStop(1 / 6, 'orange');
        grad.addColorStop(2 / 6, 'yellow');
        grad.addColorStop(3 / 6, 'green');
        grad.addColorStop(4 / 6, 'aqua');
        grad.addColorStop(5 / 6, 'blue');
        grad.addColorStop(1, 'purple');
        return grad;
      }

      // Generate style for gradient or pattern fill
      var fill = new ol.style.Fill();
      var style = new ol.style.Style({
        fill: fill,
        stroke: new ol.style.Stroke({
          color: '#333',
          width: 2
        })
      });

      var getStackedStyle = function(feature, resolution) {
        var id = feature.getId();
        fill.setColor(id > 'J' ? gradient(feature, resolution) : pattern);
        return style;
      };*/

// 기본이 될 Layer 저장
// 레이어 (단일 또는 다중)
var baseLayers = {};

//baseLayer - VWorld
(baseLayers["VWorld"] = new ol.layer.Tile({
  title: "VWorld Gray Map",
  visible: true,
  id: "VWorld",
  type: "base",
  source: new ol.source.XYZ({
    url: `http://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Base/{z}/{y}/{x}.png`,
    crossOrigin: "anonymous",
  }),
})),

//SatelliteLayer - VWorld
(baseLayers["VWorldSatellite"] = new ol.layer.Tile({
  title: "VWorld Satellite Map",
  visible: true,
  id: "VWorld",
  type: "Satellite",
  source: new ol.source.XYZ({
    url: `http://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Satellite/{z}/{y}/{x}.jpeg`,
    crossOrigin: "anonymous",
  }),
})),

//whiteLayer - VWorld
(baseLayers["VWorldWhite"] = new ol.layer.Tile({
  title: "VWorld White Map",
  visible: true,
  id: "VWorld",
  type: "white",
  source: new ol.source.XYZ({
    url: `http://api.vworld.kr/req/wmts/1.0.0/${apiKey}/white/{z}/{y}/{x}.png`,
    crossOrigin: "anonymous",
  }),
})),

//hybridLayer - VWorld
(baseLayers["VWorldHybrid"] = new ol.layer.Tile({
  title: "VWorld Gray Map",
  visible: true,
  id: "VWorld",
  type: "hybrid",
  source: new ol.source.XYZ({
    url: `http://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Hybrid/{z}/{y}/{x}.png`,
    crossOrigin: "anonymous",
  }),
})),


//midnightLayer - VWorld
(baseLayers["VWorldMidnight"] = new ol.layer.Tile({
  title: "VWorld Midnight Map",
  visible: true,
  id: "VWorld",
  type: "Midnight",
  source: new ol.source.XYZ({
    url: `http://api.vworld.kr/req/wmts/1.0.0/${apiKey}/midnight/{z}/{y}/{x}.png`,
    crossOrigin: "anonymous",
  }),
})),

(baseLayers["OSM"] = new ol.layer.Tile({
  source: new ol.source.OSM(),
}));

//기본 타일
var tileImgLayer = new ol.layer.Tile({
    visible: true,
    source: new ol.source.TileWMS({
        url: 'http://lxrdip.iptime.org:9999/geoserver/lxrdip/wms',
        params: {
           'FORMAT': 'image/png',
           'VERSION': '1.1.1',
            tiled: true,
            "STYLES": '',
            "LAYERS": 'lxrdip:rmf_001000l' // workspace:layer
        },
        crossOrigin: 'anonymous'
    }),
});

/*************************/
/*                       */
/*   도로침수 유의구간   */
/*                       */
/*************************/
//하수시설 물받이,측구,맨홀
var manholeWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:lx_od_draing_mnhl_d'),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//과거침수흔적도
var floodingWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:flooding'),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//오목구간
var concaveWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('	lxrdip:concave_section_analysis'),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//하수시설 청소이력
var gutterWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:gutter'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});



/*************************/
/*                       */
/*   모빌리티 안전지수   */
/*                       */
/*************************/
//TODO: 추후 지오서버에 레이어 올라오면 변경예정
//교차로정보
var crossInfoWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:lx_od_crss_fclt_d'),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//터널정보
var tunnelInfoWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:lx_od_tuel_d'),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//낙석위험구간
var fallingRiskSectionWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		//url: urlBuilder('lxrdip:concave'),
		url: urlBuilder('lxrdip:lx_od_stwo_bral_d'),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//변화정보
//원래는 변화정보지만 데이터가 없는 관계로 임시로 과속방지턱 사용중
var changeInfoWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:lx_od_ovrs_spbm_d'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});



/*************************/
/*                       */
/*   도로결빙 유의구간   */
/*                       */
/*************************/
//오목구간 - 도로침수 유의구간과 공유한다

//과거침수흔적도 - 도로침수 유의구간과 공유한다

//도로포장재질
var roadWrappingWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder(''),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//포트홀
var potholeWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:lx_od_pthl_d'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//결빙구간
var frostWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:lx_od_frzng_rgn_d'),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//응달지역
var shadeWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:lx_od_shdwar_rgn_d'),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});



/*************************/
/*                       */
/*  UAM 버티포트 적합지  */
/*                       */
/*************************/
//국공유지
var stateOwnedLandWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:pothole'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//건축물높이
var buildingHeightWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:manhole'),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//공역정보
var airSpaceInfoWfsLayer = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:flooding'),
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});



/************************/
/*                      */
/*      도로시설물      */
/*                      */
/************************/
//도로중심선 - WMS
/*var roadCenterLine = new ol.layer.Tile({
		id: "roadFacilities",
    visible: true,
    source: new ol.source.TileWMS({
        url: 'http://lxrdip.iptime.org:9999/geoserver/lxrdip/wms',
        params: {
           'FORMAT': 'image/png',
           'VERSION': '1.1.1',
            tiled: true,
            "STYLES": '',
            "LAYERS": 'lxrdip:rmf_001000a' // workspace:layer
        },
        crossOrigin: 'anonymous'
    })
});*/

//도로중심선 - WFS
var roadCenterLine = new ol.layer.Vector({
		id: "roadFacilities",
		source: new ol.source.Vector({
			format: new ol.format.GeoJSON(),
			url: urlBuilder('lxrdip:rmf_001000a'), 
			strategy: ol.loadingstrategy.bbox,
		}),
		style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#ffffff", 0.8)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#ffffff", 0.8),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
		properties: { name:'wfs' },
		//style: getStackedStyle
});

//도로경계 -> WFS

var roadBoundarySource = new ol.source.Vector();
var roadBoundary = new ol.layer.Vector({
	id: "roadFacilities",
	source: roadBoundarySource,
	
	properties: { name:'wfs' },
	//style: getStackedStyle
});

//도로경계 -> WMS
/*var roadBoundary = new ol.layer.Tile({
		id: "roadFacilities",
    visible: true,
    source: new ol.source.TileWMS({
        url: 'http://lxrdip.iptime.org:9999/geoserver/lxrdip/wms',
        params: {
           'FORMAT': 'image/png',
           'VERSION': '1.1.1',
            tiled: true,
            "STYLES": 'line',
            "LAYERS": 'lxrdip:rmf_002000a' // workspace:layer
        },
        crossOrigin: 'anonymous'
    })
});*/

//교량
var bridge = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_003000a'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#ff5400", 0.8)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#ff5400", 0.8),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
	properties: { name:'wfs' }
});

//터널
var tunnel = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_004000a'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#ff0054", 0.8)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#ff0054", 0.8),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
	properties: { name:'wfs' }
});

//육교
var pedestrianOverpass = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_005000a'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#9e0059", 0.8)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#9e0059", 0.8),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
	properties: { name:'wfs' }
});

//지하차도
var underGroundRoadMap = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_006000a'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#ffbd00", 0.7)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#ffbd00", 0.7),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
	properties: { name:'wfs' }
});

//고가도로
var overpass = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_007000a'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#09142f", 0.8)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#09142f", 0.8),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
	properties: { name:'wfs' }
});

//인터체인지
var interChange = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_008000a_00'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#3772ff", 0.6)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#3772ff", 0.6),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
	properties: { name:'wfs' }
});

//지하보도
var underGroundSideWalk = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_009000a'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	properties: { name:'wfs' }
});

//교점
var intersaction = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_010000l'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#ff0342", 0.9)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#ff0342", 0.9),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
	properties: { name:'wfs' }
});

//종단
var termination = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_011000l'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#01ff38", 0.9)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#01ff38", 0.9),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
	properties: { name:'wfs' }
});

//실연장
var realExtension = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_012000l'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#01fff7", 0.9)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#01fff7", 0.9),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
	properties: { name:'wfs' }
});

//측점
var sidePoint = new ol.layer.Vector({
	id: "roadFacilities",
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: urlBuilder('lxrdip:rmf_013000p'), 
		strategy: ol.loadingstrategy.bbox,
	}),
	style: new ol.style.Style({
		  fill: new ol.style.Fill({
		    //color: color // 채우기 색상 지정
					color: hexToRgba("#828282", 0.9)
		  }),
		  stroke: new ol.style.Stroke({
		    //color: color, // 외곽선 색상 지정
				color: hexToRgba("#828282", 0.9),
		    width: 0 // 외곽선 두께 지정
		  }),
	}),
	properties: { name:'wfs' }
});

//지도 그리기 사용시 TempLayer 활용
var tmpreVectorSource = new ol.source.Vector({ projection: "EPSG:4326", wrapX: false }); // tmpreVectorSource 선언
var tmprVectorLayer = new ol.layer.Vector({
  source: tmpreVectorSource,
}); // tmprVectorLayer 선언

//빈객체 생성 - 반경측정에 사용됨
var source = new ol.source.Vector();
var vectorLayer = new ol.layer.Vector({
  source: source
});

//빈객체생성 - 거리측정에 사용됨
var lineSource = new ol.source.Vector();
var lineVector = new ol.layer.Vector({
    source:lineSource
});

//빈객체생성 - 면적측정에 사용됨
var polySource = new ol.source.Vector();
var polyVector = new ol.layer.Vector({
    source: polySource
});

// 마커 레이어에 들어갈 소스 생성
var markerSource = new ol.source.Vector();
var circleSource = new ol.source.Vector();
var circleClickSource = new ol.source.Vector({projection: 'EPSG:4326'});

//빈객체생성 - 행정구역 레이어 올릴때 사용됨
var ctpvVectorSource = new ol.source.Vector();
var ctpvVectorLayer = new ol.layer.Vector({
	source: ctpvVectorSource
});