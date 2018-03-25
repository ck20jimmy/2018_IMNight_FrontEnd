function imgEnlarge() {
	setTimeout(function(){
		$('.floating').addClass('enlarge');
		$('.enlarge').hover(
		function(){
			$(this).css('cursor', 'pointer');
			// $(this).addClass('transition');
			$(this).css('transform', 'scale(1.1)');
			$(this).removeClass('floating');
		}, 
		function(){
			// $(this).removeClass('transition');
			$(this).addClass('floating');
		});
	}, 1000);
}

$(function(){
	$('.lazy').Lazy({
		effect: 'fadeIn',
		effectTime: 1000,
		threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
	});

	if (!user_status.loggedIn) {
		$('.loginDeny').attr("onclick", null);
	}

	$('#rule-title').fadeTo(1000, 0.85, 'swing', function() {
		$('#rule-space').show("blind", 800);
	});

	// add enlarge hover effect on all .floating elements
	imgEnlarge();
})
