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