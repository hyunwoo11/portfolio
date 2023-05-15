$(document).ready(() => {
	
});

// 카카오맵(Kakao Map) API 초기화
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
	mapOption = {
		center: new kakao.maps.LatLng(37.4843, 126.75508), // 지도의 중심좌표
		level: 4 // 지도의 확대 레벨
	};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

//지도에 마커 추가
const marker = new kakao.maps.Marker({
  position: new kakao.maps.LatLng(37.4843, 126.75508), // 마커 위치 좌표
  title : "우리집 :)", // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
  map: map // 마커를 표시할 지도 객체
});

// 지도에 인포윈도우(정보 창) 추가
const infowindow = new kakao.maps.InfoWindow({
  content: '<div class="custom-infowindow"><h4>우리집</h4><p>경기도 부천시 송내동</p></div>', // 인포윈도우에 표시할 내용
  removable: true // 닫기 버튼 표시 여부
});

// 마커를 클릭하면 인포윈도우 표시
kakao.maps.event.addListener(marker, 'click', () => {
  infowindow.open(map, marker); // 인포윈도우를 지도와 마커에 연결하여 표시
});

//지도 확대/축소 이벤트를 바 소스로 생성
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT); // 바를 지도 오른쪽에 추가


// 지도 타입 정보를 가지고 있을 객체입니다
// map.addOverlayMapTypeId 함수로 추가된 지도 타입은
// 가장 나중에 추가된 지도 타입이 가장 앞에 표시됩니다
// 이 예제에서는 지도 타입을 추가할 때 지적편집도, 지형정보, 교통정보, 자전거도로 정보 순으로 추가하므로
// 자전거 도로 정보가 가장 앞에 표시됩니다
var mapTypes = {
    terrain : kakao.maps.MapTypeId.TERRAIN,    
    traffic :  kakao.maps.MapTypeId.TRAFFIC,
    bicycle : kakao.maps.MapTypeId.BICYCLE,
    useDistrict : kakao.maps.MapTypeId.USE_DISTRICT
};

// 체크 박스를 선택하면 호출되는 함수입니다
function setOverlayMapTypeId() {
    var chkTerrain = document.getElementById('chkTerrain'),  
        chkTraffic = document.getElementById('chkTraffic'),
        chkBicycle = document.getElementById('chkBicycle'),
        chkUseDistrict = document.getElementById('chkUseDistrict');
    
    // 지도 타입을 제거합니다
    for (var type in mapTypes) {
        map.removeOverlayMapTypeId(mapTypes[type]);    
    }

    // 지적편집도정보 체크박스가 체크되어있으면 지도에 지적편집도정보 지도타입을 추가합니다
    if (chkUseDistrict.checked) {
        map.addOverlayMapTypeId(mapTypes.useDistrict);    
    }
    
    // 지형정보 체크박스가 체크되어있으면 지도에 지형정보 지도타입을 추가합니다
    if (chkTerrain.checked) {
        map.addOverlayMapTypeId(mapTypes.terrain);    
    }
    
    // 교통정보 체크박스가 체크되어있으면 지도에 교통정보 지도타입을 추가합니다
    if (chkTraffic.checked) {
        map.addOverlayMapTypeId(mapTypes.traffic);    
    }
    
    // 자전거도로정보 체크박스가 체크되어있으면 지도에 자전거도로정보 지도타입을 추가합니다
    if (chkBicycle.checked) {
        map.addOverlayMapTypeId(mapTypes.bicycle);    
    }
}  



//==================== 선그리기 이벤트 ===================================
var drawingFlag = false; // 선이 그려지고 있는 상태를 가지고 있을 변수입니다
var moveLine; // 선이 그려지고 있을때 마우스 움직임에 따라 그려질 선 객체 입니다
var clickLine // 마우스로 클릭한 좌표로 그려질 선 객체입니다
var distanceOverlay; // 선의 거리정보를 표시할 커스텀오버레이 입니다
var dots = {}; // 선이 그려지고 있을때 클릭할 때마다 클릭 지점과 거리를 표시하는 커스텀 오버레이 배열입니다.

//지도에 클릭 이벤트를 등록합니다
//지도를 클릭하면 선 그리기가 시작됩니다 그려진 선이 있으면 지우고 다시 그립니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {

 // 마우스로 클릭한 위치입니다 
 var clickPosition = mouseEvent.latLng;

 // 지도 클릭이벤트가 발생했는데 선을 그리고있는 상태가 아니면
 if (!drawingFlag) {

     // 상태를 true로, 선이 그리고있는 상태로 변경합니다
     drawingFlag = true;
     
     // 지도 위에 선이 표시되고 있다면 지도에서 제거합니다
     deleteClickLine();
     
     // 지도 위에 커스텀오버레이가 표시되고 있다면 지도에서 제거합니다
     deleteDistnce();

     // 지도 위에 선을 그리기 위해 클릭한 지점과 해당 지점의 거리정보가 표시되고 있다면 지도에서 제거합니다
     deleteCircleDot();
 
     // 클릭한 위치를 기준으로 선을 생성하고 지도위에 표시합니다
     clickLine = new kakao.maps.Polyline({
         map: map, // 선을 표시할 지도입니다 
         path: [clickPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
         strokeWeight: 3, // 선의 두께입니다 
         strokeColor: '#db4040', // 선의 색깔입니다
         strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
         strokeStyle: 'solid' // 선의 스타일입니다
     });
     
     // 선이 그려지고 있을 때 마우스 움직임에 따라 선이 그려질 위치를 표시할 선을 생성합니다
     moveLine = new kakao.maps.Polyline({
         strokeWeight: 3, // 선의 두께입니다 
         strokeColor: '#db4040', // 선의 색깔입니다
         strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
         strokeStyle: 'solid' // 선의 스타일입니다    
     });
 
     // 클릭한 지점에 대한 정보를 지도에 표시합니다
     displayCircleDot(clickPosition, 0);

         
 } else { // 선이 그려지고 있는 상태이면

     // 그려지고 있는 선의 좌표 배열을 얻어옵니다
     var path = clickLine.getPath();

     // 좌표 배열에 클릭한 위치를 추가합니다
     path.push(clickPosition);
     
     // 다시 선에 좌표 배열을 설정하여 클릭 위치까지 선을 그리도록 설정합니다
     clickLine.setPath(path);

     var distance = Math.round(clickLine.getLength());
     displayCircleDot(clickPosition, distance);
 }
});
 
//지도에 마우스무브 이벤트를 등록합니다
//선을 그리고있는 상태에서 마우스무브 이벤트가 발생하면 그려질 선의 위치를 동적으로 보여주도록 합니다
kakao.maps.event.addListener(map, 'mousemove', function (mouseEvent) {

 // 지도 마우스무브 이벤트가 발생했는데 선을 그리고있는 상태이면
 if (drawingFlag){
     
     // 마우스 커서의 현재 위치를 얻어옵니다 
     var mousePosition = mouseEvent.latLng; 

     // 마우스 클릭으로 그려진 선의 좌표 배열을 얻어옵니다
     var path = clickLine.getPath();
     
     // 마우스 클릭으로 그려진 마지막 좌표와 마우스 커서 위치의 좌표로 선을 표시합니다
     var movepath = [path[path.length-1], mousePosition];
     moveLine.setPath(movepath);    
     moveLine.setMap(map);
     
     var distance = Math.round(clickLine.getLength() + moveLine.getLength()), // 선의 총 거리를 계산합니다
         content = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m</div>'; // 커스텀오버레이에 추가될 내용입니다
     
     // 거리정보를 지도에 표시합니다
     showDistance(content, mousePosition);   
 }             
});                 

//지도에 마우스 오른쪽 클릭 이벤트를 등록합니다
//선을 그리고있는 상태에서 마우스 오른쪽 클릭 이벤트가 발생하면 선 그리기를 종료합니다
kakao.maps.event.addListener(map, 'rightclick', function (mouseEvent) {

 // 지도 오른쪽 클릭 이벤트가 발생했는데 선을 그리고있는 상태이면
 if (drawingFlag) {
     
     // 마우스무브로 그려진 선은 지도에서 제거합니다
     moveLine.setMap(null);
     moveLine = null;  
     
     // 마우스 클릭으로 그린 선의 좌표 배열을 얻어옵니다
     var path = clickLine.getPath();
 
     // 선을 구성하는 좌표의 개수가 2개 이상이면
     if (path.length > 1) {

         // 마지막 클릭 지점에 대한 거리 정보 커스텀 오버레이를 지웁니다
         if (dots[dots.length-1].distance) {
             dots[dots.length-1].distance.setMap(null);
             dots[dots.length-1].distance = null;    
         }

         var distance = Math.round(clickLine.getLength()), // 선의 총 거리를 계산합니다
             content = getTimeHTML(distance); // 커스텀오버레이에 추가될 내용입니다
             
         // 그려진 선의 거리정보를 지도에 표시합니다
         showDistance(content, path[path.length-1]);  
          
     } else {

         // 선을 구성하는 좌표의 개수가 1개 이하이면 
         // 지도에 표시되고 있는 선과 정보들을 지도에서 제거합니다.
         deleteClickLine();
         deleteCircleDot(); 
         deleteDistnce();

     }
     
     // 상태를 false로, 그리지 않고 있는 상태로 변경합니다
     drawingFlag = false;          
 }  
});    

//클릭으로 그려진 선을 지도에서 제거하는 함수입니다
function deleteClickLine() {
 if (clickLine) {
     clickLine.setMap(null);    
     clickLine = null;        
 }
}

//마우스 드래그로 그려지고 있는 선의 총거리 정보를 표시하거
//마우스 오른쪽 클릭으로 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 생성하고 지도에 표시하는 함수입니다
function showDistance(content, position) {
 
 if (distanceOverlay) { // 커스텀오버레이가 생성된 상태이면
     
     // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
     distanceOverlay.setPosition(position);
     distanceOverlay.setContent(content);
     
 } else { // 커스텀 오버레이가 생성되지 않은 상태이면
     
     // 커스텀 오버레이를 생성하고 지도에 표시합니다
     distanceOverlay = new kakao.maps.CustomOverlay({
         map: map, // 커스텀오버레이를 표시할 지도입니다
         content: content,  // 커스텀오버레이에 표시할 내용입니다
         position: position, // 커스텀오버레이를 표시할 위치입니다.
         xAnchor: 0,
         yAnchor: 0,
         zIndex: 3  
     });      
 }
}

//그려지고 있는 선의 총거리 정보와 
//선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 삭제하는 함수입니다
function deleteDistnce () {
 if (distanceOverlay) {
     distanceOverlay.setMap(null);
     distanceOverlay = null;
 }
}

//선이 그려지고 있는 상태일 때 지도를 클릭하면 호출하여 
//클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 표출하는 함수입니다
function displayCircleDot(position, distance) {

 // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
 var circleOverlay = new kakao.maps.CustomOverlay({
     content: '<span class="dot"></span>',
     position: position,
     zIndex: 1
 });

 // 지도에 표시합니다
 circleOverlay.setMap(map);

 if (distance > 0) {
     // 클릭한 지점까지의 그려진 선의 총 거리를 표시할 커스텀 오버레이를 생성합니다
     var distanceOverlay = new kakao.maps.CustomOverlay({
         content: '<div class="dotOverlay">거리 <span class="number">' + distance + '</span>m</div>',
         position: position,
         yAnchor: 1,
         zIndex: 2
     });

     // 지도에 표시합니다
     distanceOverlay.setMap(map);
 }

 // 배열에 추가합니다
 dots.push({circle:circleOverlay, distance: distanceOverlay});
}

//클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 지도에서 모두 제거하는 함수입니다
function deleteCircleDot() {
 var i;

 for ( i = 0; i < dots.length; i++ ){
     if (dots[i].circle) { 
         dots[i].circle.setMap(null);
     }

     if (dots[i].distance) {
         dots[i].distance.setMap(null);
     }
 }

 dots = [];
}

//마우스 우클릭 하여 선 그리기가 종료됐을 때 호출하여 
//그려진 선의 총거리 정보와 거리에 대한 도보, 자전거 시간을 계산하여
//HTML Content를 만들어 리턴하는 함수입니다
function getTimeHTML(distance) {

 // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
 var walkkTime = distance / 67 | 0;
 var walkHour = '', walkMin = '';

 // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
 if (walkkTime > 60) {
     walkHour = '<span class="number">' + Math.floor(walkkTime / 60) + '</span>시간 '
 }
 walkMin = '<span class="number">' + walkkTime % 60 + '</span>분'

 // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
 var bycicleTime = distance / 227 | 0;
 var bycicleHour = '', bycicleMin = '';

 // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
 if (bycicleTime > 60) {
     bycicleHour = '<span class="number">' + Math.floor(bycicleTime / 60) + '</span>시간 '
 }
 bycicleMin = '<span class="number">' + bycicleTime % 60 + '</span>분'

 // 거리와 도보 시간, 자전거 시간을 가지고 HTML Content를 만들어 리턴합니다
 var content = '<ul class="dotOverlay distanceInfo">';
 content += '    <li>';
 content += '        <span class="label">총거리</span><span class="number">' + distance + '</span>m';
 content += '    </li>';
 content += '    <li>';
 content += '        <span class="label">도보</span>' + walkHour + walkMin;
 content += '    </li>';
 content += '    <li>';
 content += '        <span class="label">자전거</span>' + bycicleHour + bycicleMin;
 content += '    </li>';
 content += '</ul>'

 return content;
}

//====================================================GPS ==============================
//HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
//if (navigator.geolocation) {
//    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
//    navigator.geolocation.getCurrentPosition(function(position) {
//        var lat = position.coords.latitude, // 위도
//            lon = position.coords.longitude; // 경도
//        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
//            message = '<div class="custom-infowindow" style="text-align: center;"><현재위치></div>'; // 인포윈도우에 표시될 내용입니다
//        // 마커와 인포윈도우를 표시합니다
//        displayMarker(locPosition, message);
//      });
//    
//} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
//    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
//        message = 'geolocation을 사용할수 없어요..'
//    displayMarker(locPosition, message);
//}
//
//// 지도에 마커와 인포윈도우를 표시하는 함수입니다
//function displayMarker(locPosition, message) {
//    // 마커를 생성합니다
//    var marker = new kakao.maps.Marker({  
//        map: map, 
//        position: locPosition
//    }); 
//    
//    var iwContent = message, // 인포윈도우에 표시할 내용
//        iwRemoveable = false;
//
//    // 인포윈도우를 생성합니다
//    var infowindow = new kakao.maps.InfoWindow({
//        content : iwContent,
//        removable : iwRemoveable
//    });
//    
//    // 인포윈도우를 마커위에 표시합니다 
//    infowindow.open(map, marker);
//    
//    // 지도 중심좌표를 접속위치로 변경합니다
//    map.setCenter(locPosition);      
//} 


//============================== 로드뷰 ==================================
var overlayOn = false, // 지도 위에 로드뷰 오버레이가 추가된 상태를 가지고 있을 변수
container = document.getElementById('container'), // 지도와 로드뷰를 감싸고 있는 div 입니다
mapWrapper = document.getElementById('mapWrapper'), // 지도를 감싸고 있는 div 입니다
mapContainer = document.getElementById('map'), // 지도를 표시할 div 입니다 
rvContainer = document.getElementById('roadview'); //로드뷰를 표시할 div 입니다

//로드뷰 객체를 생성합니다 
var rv = new kakao.maps.Roadview(rvContainer); 

// 좌표로부터 로드뷰 파노라마 ID를 가져올 로드뷰 클라이언트 객체를 생성합니다 
var rvClient = new kakao.maps.RoadviewClient(); 

// 로드뷰에 좌표가 바뀌었을 때 발생하는 이벤트를 등록합니다 
kakao.maps.event.addListener(rv, 'position_changed', function() {

    // 현재 로드뷰의 위치 좌표를 얻어옵니다 
    var rvPosition = rv.getPosition();

    // 지도의 중심을 현재 로드뷰의 위치로 설정합니다
    map.setCenter(rvPosition);

    // 지도 위에 로드뷰 도로 오버레이가 추가된 상태이면
    if(overlayOn) {
        // 마커의 위치를 현재 로드뷰의 위치로 설정합니다
        marker.setPosition(rvPosition);
    }
});

// 마커 이미지를 생성합니다
var markImage = new kakao.maps.MarkerImage(
    'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
    new kakao.maps.Size(26, 46),
    {
        // 스프라이트 이미지를 사용합니다.
        // 스프라이트 이미지 전체의 크기를 지정하고
        spriteSize: new kakao.maps.Size(1666, 168),
        // 사용하고 싶은 영역의 좌상단 좌표를 입력합니다.
        // background-position으로 지정하는 값이며 부호는 반대입니다.
        spriteOrigin: new kakao.maps.Point(705, 114),
        offset: new kakao.maps.Point(13, 46)
    }
);

// 드래그가 가능한 마커를 생성합니다
//var marker = new kakao.maps.Marker({
//    image : markImage,
//    position: mapCenter,
//    draggable: true
//});

// 마커에 dragend 이벤트를 등록합니다
kakao.maps.event.addListener(marker, 'dragend', function(mouseEvent) {

    // 현재 마커가 놓인 자리의 좌표입니다 
    var position = marker.getPosition();

    // 마커가 놓인 위치를 기준으로 로드뷰를 설정합니다
    toggleRoadview(position);
});

//지도에 클릭 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent){
    
    // 지도 위에 로드뷰 도로 오버레이가 추가된 상태가 아니면 클릭이벤트를 무시합니다 
    if(!overlayOn) {
        return;
    }

    // 클릭한 위치의 좌표입니다 
    var position = mouseEvent.latLng;

    // 마커를 클릭한 위치로 옮깁니다
    marker.setPosition(position);

    // 클락한 위치를 기준으로 로드뷰를 설정합니다
    toggleRoadview(position);
});

// 전달받은 좌표(position)에 가까운 로드뷰의 파노라마 ID를 추출하여
// 로드뷰를 설정하는 함수입니다
function toggleRoadview(position){
    rvClient.getNearestPanoId(position, 50, function(panoId) {
        // 파노라마 ID가 null 이면 로드뷰를 숨깁니다
        if (panoId === null) {
            toggleMapWrapper(true, position);
        } else {
         toggleMapWrapper(false, position);

            // panoId로 로드뷰를 설정합니다
            rv.setPanoId(panoId, position);
        }
    });
}

// 지도를 감싸고 있는 div의 크기를 조정하는 함수입니다
function toggleMapWrapper(active, position) {
    if (active) {

        // 지도를 감싸고 있는 div의 너비가 100%가 되도록 class를 변경합니다 
        container.className = '';

        // 지도의 크기가 변경되었기 때문에 relayout 함수를 호출합니다
        map.relayout();

        // 지도의 너비가 변경될 때 지도중심을 입력받은 위치(position)로 설정합니다
        map.setCenter(position);
    } else {

        // 지도만 보여지고 있는 상태이면 지도의 너비가 50%가 되도록 class를 변경하여
        // 로드뷰가 함께 표시되게 합니다
        if (container.className.indexOf('view_roadview') === -1) {
            container.className = 'view_roadview';

            // 지도의 크기가 변경되었기 때문에 relayout 함수를 호출합니다
            map.relayout();

            // 지도의 너비가 변경될 때 지도중심을 입력받은 위치(position)로 설정합니다
            map.setCenter(position);
        }
    }
}

// 지도 위의 로드뷰 도로 오버레이를 추가,제거하는 함수입니다
function toggleOverlay(active) {
    if (active) {
        overlayOn = true;

        // 지도 위에 로드뷰 도로 오버레이를 추가합니다
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);

        // 지도 위에 마커를 표시합니다
        marker.setMap(map);

        // 마커의 위치를 지도 중심으로 설정합니다 
        marker.setPosition(map.getCenter());

        // 로드뷰의 위치를 지도 중심으로 설정합니다
        toggleRoadview(map.getCenter());
    } else {
        overlayOn = false;

        // 지도 위의 로드뷰 도로 오버레이를 제거합니다
        map.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);

        // 지도 위의 마커를 제거합니다
        marker.setMap(map);
    }
}

// 지도 위의 로드뷰 버튼을 눌렀을 때 호출되는 함수입니다
function setRoadviewRoad() {
    var control = document.getElementById('roadviewControl');

    // 버튼이 눌린 상태가 아니면
    if (control.className.indexOf('active') === -1) {
        control.className = 'active';

        // 로드뷰 도로 오버레이가 보이게 합니다
        toggleOverlay(true);
    } else {
        control.className = '';

        // 로드뷰 도로 오버레이를 제거합니다
        toggleOverlay(false);
    }
}

// 로드뷰에서 X버튼을 눌렀을 때 로드뷰를 지도 뒤로 숨기는 함수입니다
function closeRoadview() {
    var position = marker.getPosition();
    toggleMapWrapper(true, position);
}