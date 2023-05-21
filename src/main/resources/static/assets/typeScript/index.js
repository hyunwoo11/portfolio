$(document).ready(() => {
});

// 경력기술서 다운로드 메소드
const lhwCareerFileDownlod = (id) =>{
	
	const data = {
		careerFileNm: id.attr("id")
	};
	
  $.fileDownload('/getCareerFiledown', {
    httpMethod: 'GET',
    data: data,
    prepareCallback: function(url) {
      console.log('HTTP 요청을 시작하기 전에 실행됩니다.');
      console.log('파일 다운로드 URL:', url);
    },
    successCallback: function(url) {
      console.log('다운로드 성공');
      console.log('파일 다운로드 URL:', url);
    },
    failCallback: function(responseHtml, url, err) {
      console.error('다운로드 실패');
      console.error('파일 다운로드 URL:', url);
      console.error('에러:', err);
    }
  });
}

// email send
function sendEmail() {
	
	var form = $("#contactForm").serialize();
	
	$.ajax({
		url: "/sendMail",
		data: form,
		type:"POST",
	}).done(function (fragment) {
		if(fragment){
			$("#contactForm").find("[name=email]").val('');
			$("#contactForm").find("[name=message]").val('');
			
			$("#btn_sendEmail").find('span').text('완료');
			$("#btn_sendEmail").removeClass('three');
			$("#btn_sendEmail").addClass('banner-btn');
			
			setTimeout(() => {
				$("#btn_sendEmail").find('span').text('');
				$("#btn_sendEmail").removeClass('banner-btn');
				$("#btn_sendEmail").addClass('three');
			}, 5000);
		}
	});
	return false;
}


/*
const personalLife = (type) => {
	
	if(type == "" || type == null) return;
	
	$.ajax({
		url: "/getLife",
		data: {type : type},
		type: "GET",
	}).done(function (result) {
		if(result.success){
			$('#getImgDiv').empty();
			let imgHTML = "";
			imgHTML = '<div class="row portfolio-container">';
			for(let i=0; i<result.imgList.length; i++){
				let imgSrc = result.imgList[i];
				let type = result.type;
				if(i < 6 ){
					if(type === "all"){
						imgHTML +='<div class="col-lg-4 col-md-6 portfolio-item">';
					}else if(type === "bicycle"){
						imgHTML +='<div class="col-lg-4 col-md-6 portfolio-item web-des">';
					}else if(type === "travel"){
						imgHTML +='<div class="col-lg-4 col-md-6 portfolio-item web-dev">';
					}else{
						imgHTML +='<div class="col-lg-4 col-md-6 portfolio-item dig-mar">';
					}
					
					imgHTML +='<div class="portfolio-wrap">';
					imgHTML +='<figure>';
					imgHTML +='<img src="'+imgSrc+'" class="img-fluid" alt="">';
					imgHTML +='<a href="'+imgSrc+'" class="link-preview" data-lightbox="portfolio" data-title="'+type+'" title="보기"> <i class="fa fa-eye"></i></a>';
					if(type === "fishbowl"){
						imgHTML +='<a href="https://www.youtube.com/@user-mp4hv6hg6q" class="link-details" title="유튜브 바로가기"><i class="fa fa-link"></i></a>';
					}else{
						imgHTML +='<a href="#" class="link-details" title="More Details"><i class="fa fa-link"></i></a>';
					}
					imgHTML +='<span>개인활동</span>';
					imgHTML +='</figure>';
					imgHTML +='</div>';
					imgHTML +='</div>';
				}
			}
			imgHTML +='</div>';
			$("#getImgDiv").append(imgHTML);
		} else {
			alert(result.message);
		}
	});
}*/

