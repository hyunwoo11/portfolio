/**
 *
 * @file mapControlHtml.js
 * @author Librarian
 * @date 2023-06-26
 * @desc 맵 도로융합정보에 관련된 html.js 파일
 *
 */

/************************************************************************************************/
/*										hover overlay event 관련 시작								*/
/* 																								*/
/************************************************************************************************/
//overlay Div 생성
let tooltip = document.createElement('div');
tooltip.style.transform = 'scale(0.6)';

let content = document.createElement('div');
content.className = '';
content.setAttribute('role', 'button');
content.textContent = '';
tooltip.appendChild(content);
document.body.appendChild(tooltip);

// Create a new overlay for the tooltip
var mouseOverlay = new ol.Overlay({
  element: tooltip,
  stopEvent: true,
  positioning:'center-center'
});
_map.addOverlay(mouseOverlay);

const selectInteraction = new ol.interaction.Select({
	layers: [controlVectorLayer],
	hitTolerance:10,
	condition: ol.events.condition.click, 
});
_map.addInteraction(selectInteraction);


//버스
let overlayBusRoute = new ol.Overlay({
    element: document.getElementById("busRoute"),
    id: "busRoute",
    stopEvent: true,
    positioning:'center-center'
});
_map.addOverlay(overlayBusRoute);

selectInteraction.on('select', function (event) {
  $("#busRoute").show();
  const selectedFeatures = event.selected; 
  const deselectedFeatures = event.deselected;  
  if (selectedFeatures.length > 0) {	
	let style = new ol.style.Style({
	      stroke: new ol.style.Stroke({
	        color:'rgba(255, 0, 0, 0.7)',
	        width: 2,
	        lineCap: 'butt',
	        lineJoin: 'bevel'
	      })	      
	    });	
	
	function selectRouteById(routeId){
		let f = busRouteLayer.getSource().getFeatureById(routeId);
		if(!f)return;
		let style2 = new ol.style.Style({
	      stroke: new ol.style.Stroke({
	        color:'rgba(255, 255, 255, 0.8)',
	        width: 3,
	        lineCap: 'butt',
	        lineJoin: 'bevel'
	      }),
			zIndex: 1000	      
	    });	
		f.setStyle(style2);		
	}
	let html = "";
	let features =[];
	
	busRouteLayer.getSource().forEachFeatureIntersectingExtent(new ol.extent.buffer(new ol.extent.boundingExtent([event.mapBrowserEvent.coordinate]), 50), function (fs) {
		fs.setStyle(getBusRouteStyle(fs));
		features.push(fs);				
		html += "<dd><a href='#' data-route-id="+ fs.getId() +">" + fs.get("route_name")  + ' (' + fs.get("region_name") + ') ' + "</a></dd>";		
	});
	

	if(html) {
		html = "<dt> 노선 </dt>" + html;
		$(overlayBusRoute.getElement()).find(".marker_info").html(html);
		
		$(overlayBusRoute.getElement()).find("a").on("click", function(e){
			let id = $(e.currentTarget).data("route-id");
			if(!id)return;
			features.forEach(fs=>{				
				fs.setStyle(getBusRouteStyle(fs));
			});		
			selectRouteById(id);
		});
		
		overlayBusRoute.setPosition(event.mapBrowserEvent.coordinate);	
		overlayBusRoute.element.style.display = 'block';
	}
  }
  if (deselectedFeatures.length > 0) {
	let fss = busRouteLayer.getSource().getFeatures();
	if(fss.length > 0) {
		fss.forEach(fs=>{
			fs.setStyle(null);
		});		
	}
	let state = $('#busLayer').data("layer-on");
	if(state)
		busRouteLayer.setStyle(busRouteStyleFunc);
	else {
		$('#busLayer').data("layer-on", false);
		busRouteLayer.setStyle(busRouteStyleFunc);
	} 
			
	overlayBusRoute.element.style.display = 'none';
  }
});

//변화정보 오버레이
_map.on('pointermove', function(event) {
  
  let featureId;

  const feature = _map.forEachFeatureAtPixel(event.pixel, function(feature) {
    return feature;
  }, {layerFilter : function(layer){return layer === controlVectorLayer}, hitTolerance: 10 });

  if (feature) {
    if (feature.get('kindNm')) {
      return;
    } else {
		//gid 검사;
		featureId = feature.getId();
		if (featureId != undefined && featureId != "" && featureId != null) {
			showMouseFeatureTooltip(feature);
			const center = ol.extent.getCenter(feature.getGeometry().getExtent());
			showOverlay(center);
		}
    }
  } else {
    const len = $(event.originalEvent.target).closest('.location_state').length;
    hideOverlay(len <= 0);
  }
	//mouseOverlay gid 값 셋팅
	if (featureId !== undefined && featureId !== null && featureId !== "") {
		let gid = commonFeatureMath(featureId);
		$('#mouseOverId').attr('data-feature', gid);
	};
});

//LX Tooltip
function showMouseFeatureTooltip(feature) {
	
	if (!tooltip) return;
		
	//변화상태코드
	let sttsCd = feature.get('stts_cd') != '0' ? feature.get('stts_cd') : "4";
	addToltip(sttsCd);
	
	function addToltip(imgNum){
		content.className = '';
		content.textContent = '';
		content.classList.add('marker_title');
		content.style.background = 'url(/images/changeinfo/title/title_'+imgNum+'.png)50% / cover no-repeat';
		
		const undetectedDiv = content.querySelector('.undetect');
		if (undetectedDiv) {
		  undetectedDiv.textContent = sttsCd;
		}
	}
}

function showOverlay(coordinate) {
  if (coordinate) {
    mouseOverlay.setPosition(coordinate);
    mouseOverlay.element.style.display = 'block';
  }
}
function hideOverlay(coordinate) {
  if (coordinate) {
    mouseOverlay.element.style.display = 'none';
  }
}

//자동차 오버레이값 셋팅
function carOverlay(feature , oLay){
	
	if (!feature) return;
	
	let sttsCd = feature.get('stts_cd') != '0' ? feature.get('stts_cd') : "4";
	
	//변화상태코드
	$(oLay).find(".marker_title").css("background", "url(/images/changeinfo/title/title_"+sttsCd+".png)50% / cover no-repeat");
}
/************************************************************************************************/
/*										hover overlay event 관련 끝								*/
/* 																								*/
/************************************************************************************************/

/************************************************************************************************/
/*										modal Image 관련 시작										*/
/* 																								*/
/************************************************************************************************/
//관제맵 이미지 목록 조회
function mapMainImgList() {
  $.ajax({
    url: '/api/v1/data/stats/mapmainimglist',
    type: 'GET',
    data: {},
    success: function(result) {
      if (!result) {
        return;
      } else {
    	let innerHtml = '';
		for(let i=0; i<result.mapMainImgList.length; i++){
			var obj = result.mapMainImgList[i];
			
			//공사명
			let cstrnNm = obj.cstrnNm;
			
			var fileResultList = obj.dtctnfileseqarr.match(/\d+/g).map(Number);
			for(let j=0; j<fileResultList.length; j++){
				if(j == 0){
					innerHtml += '  <div class="media-wrap swiper-slide media-wrap animate__animated animate__flipInX" style="box-shadow: 0 0 0 2px rgb(217 217 217), 8px 8px 0 0 rgb(119 119 122);">';
	 				innerHtml += '    <button type="button" title="'+cstrnNm+'" id="img' + (i + 0) + '" class="btn-layer-open" data-bs-toggle="modal" data-bs-target="#modalImage" data-imgList="'+fileResultList.toString()+'" imgUrl="/api/chngeInfoGetImg/' + fileResultList[i] + '">확대보기</button>';
	 				innerHtml += '    <img src="/api/chngeInfoGetImg/' + fileResultList[0] + '" class="media" alt="">';
	 				innerHtml += '  </div><!-- //media-wrap -->';
				}else{
					continue;
				}
			}
		}
		 $("#mapImgList").append(innerHtml);
      }
    },
    complete: function() {
    }
  });
}

//이미지 확대
$('#modalImage').on('shown.bs.modal', function(e) {
    //data-imglist 속성 값 
    const imgList = e.relatedTarget.dataset.imglist;
	
	//data-title 속성값
    const imgTitle = e.relatedTarget.title;

    //imgList를 기본 키 배열로 분할
    const annotatedPKs = imgList.split(',');

    //현재 표시된 이미지의 인덱스
    let currentIndex = 0;

    //이미지 소스 및 모달 제목 업데이트 기능 로직
	function updateImageAndTitle() {
	    const imgUrl = "/api/chngeInfoGetImg/" + annotatedPKs[currentIndex];
	    $("#imgSrc").attr("src", imgUrl);
	    $("#madalImageTitle").html(imgTitle + " (" + (currentIndex + 1) + "/" + annotatedPKs.length + ")");
	}

    //모달을 열 때 첫 번째 이미지와 제목 표시
    updateImageAndTitle();

    //이전 버튼 기능
    $("#modalImgePrev").on("click", function() {
        currentIndex = (currentIndex - 1 + annotatedPKs.length) % annotatedPKs.length;
        updateImageAndTitle();
    });
 
    //다음 버튼 기능
    $("#modalImgeNext").on("click", function() {
        currentIndex = (currentIndex + 1) % annotatedPKs.length;
        updateImageAndTitle();
    });
});

/************************************************************************************************/
/*										modal Image 관련 끝										*/
/* 																								*/
/************************************************************************************************/

//map 초기화
function modalMapClear(mapId) {
	if (mapId == "collectedDataMap") {
		collectedDataMap.setTarget(null);
	} else {
		rdDeteInstMap.setTarget(null); //탐지지시 - 작성 map
	}
};