var login = false;
var cardDrawn = false;
var discountTaken = false;

// declare vue objects
var remind_modal = new Vue({
	el: '#remindModal',
	data: {
		message: '',
		drawnCard: false,
		takenDiscount: false,
		all_performers_drawn: false
	}
})

var card = new Vue({
	el: "#card",
	data:{
		title:"",
		name:"",
		work:"",
		intro:"",
		img:""
	}
});

var coupon = new Vue({
	el: "#coupon",
	data:{
		name:"",
		content:"",
		deadline:"",
		img:"",
		rareness:""
	}
})

function jumpPage(page) {
	$('#remindModal').modal('toggle');
	$(".modal-backdrop.fade.show").remove();
	setTimeout(function(){
		loadPage(page);
	}, 500);
}

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

function getNews() {
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/sky/news/',
		xhrFields: {
            withCredentials: true
        },
        success: function(data) {
        	// data will be a list of objects: {title, url}
			for (i = 0; i < data.length; i++) {
				let item = '<li class="pl-3"><a href=\"' + data[i].url + '\">' + data[i].title + '</a></li>';
				$('#news').append(item);
			}
		}
	});
}

function getDrawn() {
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/accounts/check/daily/',
		xhrFields: {
            withCredentials: true
        },
        success: function(data) {
        	// console.log(data);
			remind_modal.drawnCard = data.performer_drawn;
			remind_modal.takenDiscount = data.vocher_drawn;
			remind_modal.all_performers_drawn = data.all_performers_drawn;
			if (remind_modal.all_performers_drawn) {
				remind_modal.drawnCard = true;
			}
			// remind_modal.drawnCard = false;
			// remind_modal.takenDiscount = false;

			$('#loginModal').remove();
			$('#remindModal').modal('toggle');
		}
	});	
}

// if the user has logged in, check if he has drawn card or taken discount
// then get news info
function is_login_init() {
	// change navbar description

	var username="使用者", realName="使用者", point = 0;
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/human/user/self/',
		xhrFields: {
            withCredentials: true
        },
        success: function(result) {
			// console.log(result);
			username = result.username;
			// realName = result.last_name + result.first_name;
			point = result.profile.point;
			$('#login-text').html('<span>又見面了，'+username+'！您目前累積 '+point+' 點</span>');

			// set cookie for chat room
			Cookies.set('username', username);
		},
		error: function() {
			alert('get user info fail');
		}
	});

	getDrawn();
	getNews();
}

function draw_card() {
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/human/daily/',
		xhrFields: {
            withCredentials: true
        },
        success: function(result) {
			// console.log('draw card result:');
			// console.log(result);
			card.title = result[0].performer.profile.job;
			card.name = result[0].performer.username;
			card.work = result[0].performer.profile.job_description;
			card.intro = result[0].performer.profile.bio;
			card.img = result[0].performer.profile.img;

			remind_modal.drawnCard = true;
		}
	});

}

function draw_coupon() {
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/earth/daily/',
		xhrFields: {
            withCredentials: true
        },
        success: function(result) {
			// console.log('draw coupon result:');
			// console.log(result);
			coupon.name = result[0].vocher.title;
			coupon.content = result[0].vocher.description;
			coupon.img = result[0].vocher.img;
			var deadlineText = result[0].vocher.due_time.substring(0,10);
			coupon.deadline = deadlineText;
			var category = result[0].vocher.category;

			// category = 3;
			if (category == 1) {
				coupon.rareness = "普通";
			}
			else if (category == 2) {
				coupon.rareness = "稀有";
				$('#rare-text').css('color', '#3366ff');
			}
			else if (category == 3) {
				coupon.rareness = "史詩";
				$('#rare-text').css('color', '#9933ff');
			}

			remind_modal.takenDiscount = true;
		}
	});
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

	// initialize popover
	$('[data-toggle="popover"]').popover({container: "body"});

	// check if the user has logged in
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/accounts/check/login/',
		xhrFields: {
            withCredentials: true
        },
        success: function(data) {
        	// console.log('login status: ' + data.auth_status);

			if (data.auth_status) {
				is_login_init();
			}

			// if the user hasn't logged in, remove remind modal
			else {
				$('#remindModal').remove();
				$('#loginModal').modal('toggle');
			}
		},
		error: function() {
			alert('get login status fail!');
		}
	});


	$('#rule-title').fadeTo(1000, 0.85, 'swing', function() {
		$('#rule-space').show("blind", 800, function() {
			var h = $('body').height();
			// $('#content-background').css('height', h);
		});
	});

	// add enlarge hover effect on all .floating elements
	imgEnlarge();
	// draw card and draw coupon events
	$('#draw-card').on('click', draw_card);
	$('#draw-discount').on('click', draw_coupon);
})

// function statusChangeCallback(response) {
// 	console.log('statusChangeCallback');
// 	console.log(response.authResponse);
// 	if (response.status === 'connected') {
// 		// alert('you\'ve logged in!!!');

// 		// if the user has logged in, check if he has drawn card or taken discount
// 		// then get news info
// 		// then remove log in modal
// 		getDrawn();
// 		getNews();
// 		$('#loginModal').remove();
// 		$('#remindModal').modal('toggle');
// 	}
// 	else {
// 		// alert('you\'ve not logged in!!!');
// 		$('#remindModal').remove();
// 		$('#loginModal').modal('toggle');

// 		// $('#fb-btn').on('click', function(){
// 		// 	FB.login(function(response) {
// 		// 		// console.log(response);

// 		// 		if (response.status === 'connected') {
// 		// 			alert('you\'ve logged in!!!!!');
// 		// 		}
// 		// 		else {
// 		// 			alert('you\'ve cancelled login.')
// 		// 		}
// 		// 	});
// 		// });
// 	}
// }

// var login_modal = new Vue({
// 	el: '#loginModal',
// 	data: {
// 		message: '',
// 		loggedIn: false
// 	}
// })


	// check if the user has logged in (at backend app)
	// $.ajax({
	// 	type: 'GET',
	// 	url: 'https://imnight2018backend.ntu.im/accounts/check/login/',
	// 	xhrFields: {
 //            withCredentials: true
 //        },
 //        success: function(data) {
	// 		login = data.auth_status;

	// 		// if the user has logged in, check if he has drawn card or taken discount
	// 		// then get news info
	// 		// then remove log in modal
	// 		if (login) {
	// 			getDrawn();
	// 			getNews();
	// 			$('#loginModal').remove();
	// 			$('#remindModal').modal('toggle');
	// 		}

	// 		// if the user hasn't logged in, remove remind modal
	// 		else {
	// 			$('#remindModal').remove();
	// 			$('#loginModal').modal('toggle');
	// 		}
	// 	},
	// 	error: function() {
	// 		alert('get login status fail!');
	// 	}
	// });	

	// check if the user has logged in (at facebook app)
	// $.ajaxSetup({ cache: true });
	// $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
	//     FB.init({
	//       appId      : '155420448490917',
	//       cookie     : true,
	//       xfbml      : true,
	//       version    : 'v2.12'
	//     });
	//     FB.getLoginStatus(statusChangeCallback);
	// });
