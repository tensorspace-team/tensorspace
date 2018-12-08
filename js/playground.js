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

	$("#playgroundMenu").click(function() {
		moveInHiddenContent();
	});

	$("#curtain").click(function() {
		moveOutHiddenContent();
	});

	$("#close").hover(function() {
		$("#close").attr("src", "../../assets/img/playground/close_hover.png");
	}, function() {
		$("#close").attr("src", "../../assets/img/playground/close.png");
	}).click(function() {
		moveOutHiddenContent();
	});

	$("#resetTrigger").click(function() {
		model.reset();
	});

});

function moveInHiddenContent() {

	$("#playgroundNav").animate({
		left:"+=200px"
	},500);
	$("#curtain").fadeIn(500);

}

function moveOutHiddenContent() {

	$("#playgroundNav").animate({
		left:"-=200px"
	},500);
	$("#curtain").fadeOut(500);

}

function registerProgress ( totalFiles, progressCallBack, doneCallback ) {

	let totalTasks = totalFiles * 2;
	let currentTasks = 0;
	let taskEpoch = 0;

	let PromiseAll = Promise.all.bind( Promise );

	Promise.all = function ( requests ) {

		if ( requests.length === totalFiles && taskEpoch <= 1 ) {

			requests.forEach( request => {

				request.then( response => {

					currentTasks ++;

					progressCallBack( currentTasks / totalTasks );

					if ( currentTasks === totalTasks ) {

						doneCallback();

					}

				} );

			} );

			taskEpoch ++;

		}

		return PromiseAll.apply( null, arguments );

	};

}