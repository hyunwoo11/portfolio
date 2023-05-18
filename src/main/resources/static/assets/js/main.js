(function($) {
	"use strict";

	// Smooth scrolling on the navbar links
	$(".navbar-nav a").on('click', function(event) {
		if (this.hash !== "") {
			event.preventDefault();

			$('html, body').animate({
				scrollTop : $(this.hash).offset().top - 30
			}, 1500, 'easeInOutExpo');

			if ($(this).parents('.navbar-nav').length) {
				$('.navbar-nav .active').removeClass('active');
				$(this).closest('a').addClass('active');
			}
		}
	});

	// Typed Initiate
	if ($('.header h2').length == 1) {
		var typed_strings = $('.header .typed-text').text();
		var typed = new Typed('.header h2', {
			strings: typed_strings.split(', '), // 출력될 문자열의 배열
			typeSpeed: 100, // 각 문자당 타이핑 속도 (밀리초 단위)
			backSpeed: 20, // 백스페이스 속도 (밀리초 단위)
			smartBackspace: false, // 스마트 백스페이스 기능 활성화
			loop: true, // 타이핑 애니메이션을 무한히 반복
			cursorChar: '_' // 커서로 사용할 문자, 이 경우에는 밑줄 (_) 문자
		});
	}

	// Skills
	$('.skills').waypoint(function() {
		$('.progress .progress-bar').each(function() {
			$(this).css("width", $(this).attr("aria-valuenow") + '%');
		});
	}, {
		offset : '80%'
	});

	// Porfolio isotope and filter
	var portfolioIsotope = $('.portfolio-container').isotope({
		itemSelector : '.portfolio-item',
		layoutMode : 'fitRows'
	});

	$(document).on('click', '#portfolio-flters li', function() {
		$("#portfolio-flters li").removeClass('filter-active');
		$(this).addClass('filter-active');
		portfolioIsotope.isotope({
			filter : $(this).data('filter')
		});
	});
	
	// Review slider
	$('.review-slider').slick({
	autoplay : true,
	dots : false,
	infinite : true,
	slidesToShow : 1,
	slidesToScroll : 1
	});

	// Back to top button
	$(window).scroll(function() {
		if ($(this).scrollTop() > 100) {
			$('.back-to-top').fadeIn('slow');
		} else {
			$('.back-to-top').fadeOut('slow');
		}
	});
	$('.back-to-top').click(function() {
		$('html, body').animate({
			scrollTop : 0
		}, 1500, 'easeInOutExpo');
		return false;
	});
})(jQuery);
