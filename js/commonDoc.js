var chapterLookUp = {
	"#startLabel": "#start",
	"#startLabelS": "#startS",
	"#basicLabel": "#basic",
	"#basicLabelS": "#basicS",
	"#preprocessingLabel": "#preprocessing",
	"#preprocessingLabelS": "#preprocessingS",
	"#modelLabel": "#model",
	"#modelLabelS": "#modelS",
	"#layerLabel": "#layer",
	"#layerLabelS": "#layerS",
	"#mergeLabel": "#merge",
	"#mergeLabelS": "#mergeS"
};

var chapterLabels = Object.keys(chapterLookUp);

$(function() {

	$("#more").click(function() {

		if ($("#nav-collapse").is(":visible")) {
			$("#nav-collapse").slideUp(function() {
				$("#smallGuide").show();
			});
		} else {
			$("#nav-collapse").slideDown();
			$("#smallGuide").hide();
		}

	});

	bindLabelClickEvent();

	$("#smallGuide").click(function() {
		moveInHiddenContent();
	});

	$("#curtain").click(function() {
		moveOutHiddenContent();
	});

	$("#close").hover(function() {
		$("#close").attr("src", "../../assets/img/docs/close_hover.png");
	}, function() {
		$("#close").attr("src", "../../assets/img/docs/close.png");
	}).click(function() {
		moveOutHiddenContent();
	});

	$("#topButton").hover(function() {
		$(this).css({
			"background-color": "#0c50bc",
			"color": "white"
		})
	}, function () {
		$(this).css({
			"background-color": "rgba(242, 242, 242, 0.5)",
			"color": "#b3b3b3"
		})
	}).click(function () {

		$('#topButton').css({
			"background-color": "#0c50bc",
			"color": "white"
		});

		$('main').animate({
			scrollTop: 0
		}, 800, function() {
			$('#topButton').css({
				"background-color": "rgba(242, 242, 242, 0.5)",
				"color": "#b3b3b3"
			});
		});
	});

	$("main").scroll(function () {
		if ($(this).scrollTop() > 650) {
			$('#topButton').fadeIn();
		} else {
			$('#topButton').fadeOut();
		}
	});

	$('.ripple').on('click', function (event) {
		event.preventDefault();

		var $div = $('<div/>'),
			btnOffset = $(this).offset(),
			xPos = event.pageX - btnOffset.left,
			yPos = event.pageY - btnOffset.top;

		$div.addClass('ripple-effect');
		var $ripple = $(".ripple-effect");

		$ripple.css("height", $(this).height());
		$ripple.css("width", $(this).height());
		$div.css({
			top: yPos - ($ripple.height()/2),
			left: xPos - ($ripple.width()/2),
			background: $(this).data("ripple-color")
		}).appendTo($(this));

		window.setTimeout(function(){
			$div.remove();
		}, 2000);
	});

});

function moveInHiddenContent() {

	$("#hideNav").animate({
		left:"+=250px"
	},500);
	$("#curtain").fadeIn(500);
}

function moveOutHiddenContent() {

	$("#hideNav").animate({
		left:"-=250px"
	},500);
	$("#curtain").fadeOut(500);
}

function bindLabelClickEvent() {

	chapterLabels.forEach(function(chapterLabel) {
		$(chapterLabel).click(function() {
			if (!$(chapterLabel).parent().hasClass("open")) {
				hidePreNav();

				console.log("666");

				showNowNav(chapterLabel);
			} else {
				hidePreNav();
			}
		});
	});

}

function hidePreNav() {

	for (var i = 0; i < chapterLabels.length; i++) {
		if ($(chapterLookUp[chapterLabels[i]]).is(":visible")) {
			$(chapterLabels[i]).parent().removeClass("open");
			$(chapterLookUp[chapterLabels[i]]).slideUp();
		}
	}
}

function showNowNav(clickedNav) {

	$(clickedNav).parent().addClass("open");
	$(chapterLookUp[clickedNav]).slideDown();
}