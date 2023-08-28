/**
 *
 * @file commonMap.js
 * @author Librarian
 * @date 2023-07-14
 * @desc 맵 관련된 html.js 공통 파일
 *
 */

/************************************************************************************************/
/*										map 관련된 전역변수 파라미터										*/
/* 																								*/
/************************************************************************************************/

/************************************************************************************************/
/*										map 관련된 전역변수 파라미터										*/
/* 																								*/
/************************************************************************************************/

/************************************************************************************************/
/*										map 시도 시군구 조회 관련 START								*/
/* 																								*/
/************************************************************************************************/
// 시도 레이어 리스트 조회(shape 제외)
function selectCtpvLayrNmMList() {
	$.ajax({
		url		: "/api/base/ctpv-layr-nm-m"
	  , type	: "GET"
	  , data	: {}
	  , async	: false
	  , success	: function(response) {
			let optionHtml = "<option value=''>광역시/시도</option>";
			if(response != null && response.API_RESULT_DATA.length > 0) {
				response.API_RESULT_DATA.forEach(result => {
					optionHtml	+=	"<option data-id='"+result.gid+"' value='"+result.ctpvCd+"'>" + result.ctpvKornNm + "</option>"
				});
			}
			// 동적으로 생성된 데이터 내용 삽입
			$("#selectSido").html(optionHtml);
	  	},
	  	error	: function(error) {
	  		console.log("시도 목록을 가져오는데 실패했습니다.");
	  		console.log(error);
	  	}
	});
}

// 선택한 시도에 대한 시군구 목록 조회
$("#selectSido").selectmenu({
	change: function (event, data) {
		
		//시도 ID
		let sidoId = data.item.element[0].attributes[0].value;
		
		//시도 코드
		let selectedSido = $("#selectSido option:selected").val();
		
		//시도 맵 시점이동
		(async function(){
			if(!sidoId)return;
			let wktMap = await $.get('/api/v1/data/stats/selectCentroidGeomByLegalCode', {gb:'SIDO', cd :sidoId})
			let feature = format.readFeature(wktMap.ct);
			let geom = feature.getGeometry();
			_map.getView().fit(geom.getExtent());
			_map.getView().setZoom(10);
		})();
		
		//시군구 레이어 상세 조회
		selectSggLayrMDtl(selectedSido);
		
		//시도 값 없을경우
		if(selectedSido == "광역시/시도"){
			//시군구 검색 X
			$("#selectSgg").prop("disabled", true).selectmenu("refresh");
		} else {
			//시군구 검색 새로고침
			$("#selectSgg").prop("disabled", false).selectmenu("refresh");
		}
	},
});

//시군구 레이어 상세 조회
function selectSggLayrMDtl(selectedSido) {
	$.ajax({
		url		: "/api/base/sgg-layr-m"
	  , type	: "GET"
	  , data	: {
		  ctpvCd	: selectedSido		// 선택한 시도 코드 전달
	  	}
	  , async	: false
	  , success	: function(response) {
			let optionHtml = "<option value=''>시/군/구</option>";
			if(response != null && response.API_RESULT_DATA.length > 0) {
				console.log(response.resultList);
				response.API_RESULT_DATA.forEach(result => {
					optionHtml	+=	"<option data-id='"+result.gid+"' value='"+result.sggCd+"'>" + result.sggKornNm + "</option>"
				});
			}
			// 동적으로 생성된 데이터 내용 삽입
			$("#selectSgg").html(optionHtml);
			$("#selectSgg option:eq(0)").prop("selected", true);
	  	},
	  	error	: function(error) {
	  		console.log("시군구 목록을 가져오는데 실패했습니다.");
	  		console.log(error);
	  	}
	});
}

// 선택한 시군구 목록 조회
$("#selectSgg").selectmenu({
	change: function (event, data) {
		//시군구 ID
		let sggId = data.item.element[0].attributes[0].value;
		//시군구 코드
		let selectedSgg = $("#selectSgg option:selected").val();
		
		//시군구 맵 시점이동
		(async function(){
			if(!sggId)return;
			let wktMap = await $.get('/api/v1/data/stats/selectCentroidGeomByLegalCode', {gb:'SGG', cd :sggId})
			let feature = format.readFeature(wktMap.ct);
			let geom = feature.getGeometry();
			_map.getView().fit(geom.getExtent());
			_map.getView().setZoom(13);
		})();
		
  	},
});

//주소 직접검색 enter
$("#adr").bind('keypress', function(e) {
	if(e.which == 13) {
		textSch ();
	}
});

//주소 직접검색 리스트 버튼
function textSch (){
    if($("#adr").val() == "" || $("#adr").val() == ''){
        return false;
    }
    let params = {
            keyword: $("#adr").val()
    }
    var baseURL = "/api/v1/data/stats/selectCentroidGeomByKeyword";
    $.ajax({
        type: "GET", //method 형태 GET, POST, DELETE, PUT 등으로 설정
        url: baseURL, //데이터를 받아올 url
        data: params, //전송할 데이터가 있을때.. 없으면 주석처리 하고 데이터만 받아오면 됨
        async: false,
        success: function (res) {
        if(!res || res.length==0){
            alert('검색결과가 존재하지 않습니다.');
            return;
        }
        if(res.length==1){
            let gb = res[0].gb;
            let ct = res[0].ct;
            moveToGeom(gb, ct);
            return;
        }
        function moveToGeom(gb, wktGeom){
            let feature = format.readFeature(wktGeom);
            let geom = feature.getGeometry();
            _map.getView().fit(geom.getExtent());
            let zoom =  (gb == "SIDO")? 10 : ((gb == "SGG") ? 13 : ( (gb == "EMD") ? 15 :15 )) ;
            _map.getView().setZoom(zoom);
        }
        $("#modalListView").modal('show');
        let modalListViewHtml;
        $.each(res, function(i){
            let nmx = res[i].nmx;
            let gb = res[i].gb;
            let ct = res[i].ct; //"POINT(14136665.97057956 4516329.468366524)"
            //onclick="a(\'' + authrtAplySttsCd + '\')"
            modalListViewHtml += '<tr data-ct="'+ct+'">'
            modalListViewHtml += '<td style="cursor:pointer" data-geom = "' + ct + '" data-gb = "' + gb + '">'+ ++i +'</td>'
            modalListViewHtml += '<td style="cursor:pointer">'+nmx+'</td>'
            modalListViewHtml += '</tr>'
        });
        //tbody 초기화
        $('#modalListViewList').empty();
        //table tbody 생성
        $("#modalListViewList").append(modalListViewHtml);
        $("#modalListViewList").find("tr").each( (i,m)=>{
            $(m).on("click", (e)=>{
                let wktGeom = $(e.currentTarget).find("td:first").data("geom");
                let gb = $(e.currentTarget).find("td:first").data("gb");
                moveToGeom(gb, wktGeom);
            })
        })
        },
        //통신에 실패 했을때
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("통신 실패.");
        },
    });
}
/************************************************************************************************/
/*										map 시도 시군구 조회 관련 END									*/
/* 																								*/
/************************************************************************************************/

/************************************************************************************************/
/*										changeData 관련 데이터 소스									*/
/* 																								*/
/************************************************************************************************/
//데이터 날짜 포맷 변경 (20230714 - > 2023-07-14)
function commonFormatDate(data) {
	if (data && data.length > 6) {
		var formattedDate = data.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
	} else {
		data = data || '';
		data = data + '01';
		var formattedDate = data.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
	}
	return formattedDate;
};

/************************************************************************************************/
/*										changeData 관련 소스									    */
/* 																								*/
/************************************************************************************************/


/************************************************************************************************/
/*										map 공통 관련 소스										    */
/* 																								*/
/************************************************************************************************/
//변화정보 상태코드 체크
function commonSttsCdfn (sttsCd){
	let sttsCdStr;
	if(sttsCd === "1"){  //예정
		sttsCdStr = "예정";
	}else if(sttsCd === "2"){ //진행중
		sttsCdStr = "진행중"
	}else if(sttsCd === "3"){ //완료
		sttsCdStr = "완료"
	}else{ //미탐지
		sttsCdStr = "미탐지"
	}
	return sttsCdStr;
}

//FeaturId String 변환
function commonFeatureMath(featureid){
	return featureid.match(/\d+/)[0];
}


// Create an animation function
// 원형 이미지
function animateFeatures() {
 	// Get all features in the WFS layer
    var features = controlVectorSource.getFeatures();
    // Update the style of each feature with the current animation frame
	//if(typeof _map != 'undefined')
		//_map.getOverlays().clear();
    features.forEach(function(feature) {
		
		let o = _map.getOverlayById(feature.getId());
		if(o)
			_map.removeOverlay(o);	
		
		//원형 img 체크
		if(feature.get('stts_cd') === "1"){
			let d = $("<div></div>").attr("id", feature.getId())
					.html('<img src="/images/changeinfo/stts/1.png" style="width:25px;height:25px;">');
				d.appendTo(document.body);
		}else if(feature.get('stts_cd') === "2"){
			let d = $("<div></div>").attr("id", feature.getId())
					.html('<img src="/images/changeinfo/stts/2.png" style="width:25px;height:25px;">');
				//d.addClass("animate__animated animate__heartBeat animate__infinite animate__slower")
				d.appendTo(document.body);
		}else if(feature.get('stts_cd') === "3"){
			let d = $("<div></div>").attr("id", feature.getId())
					.html('<img src="/images/changeinfo/stts/3.png" style="width:25px;height:25px;">');
				d.appendTo(document.body);
		}else{
			let d = $("<div></div>").attr("id", feature.getId())
					.html('<img src="/images/changeinfo/stts/4.png" style="width:25px;height:25px;">');
				d.appendTo(document.body);
		}
	
      	let overlay = new ol.Overlay({
	        element: document.getElementById(feature.getId()),
	        id: feature.getId(),
	        stopEvent: false,
	        positioning:'center-center'
	    });

		let coordinate = feature.getGeometry().getCoordinateAt(0.5);
		overlay.setPosition(coordinate);			     
		_map.addOverlay(overlay);
		
    });
}

/************************************************************************************************/
/*										map 공통 관련 소스									    */
/* 																								*/
/************************************************************************************************/