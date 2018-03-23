// declare vue objects
var remind_modal = new Vue({
	el: '#remindModal',
	data: {
		message: '',
		drawnCard: false,
		takenDiscount: false,
		all_performers_drawn: false
	}
});

var card = new Vue({
	el: "#card",
	data:{
		title:"",
		name:"",
		work:"",
		intro:"",
		img:"",
		label:""
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
});

function jumpPage(page, label="", uname="") {
	$('#remindModal').modal('toggle');
	$(".modal-backdrop.fade.show").remove();
	setTimeout(function(){
		if (page == "chatroom") {
			// console.log(label);
			loadPage('chatroom', function(){
				select_performer( label, uname );
			});
		}
		else {
			loadPage(page);
		}
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
			

			// if the user hasn't seen tour yet, start the tour!
			if (!data.is_read_tutorial) {
				startTour();
			}
			else  {
				$('#remindModal').modal('toggle');
			}
		}
	});	
}

// if the user has logged in, check if he has drawn card or taken discount
// then get news info
function is_login_init() {
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/human/user/self/',
		xhrFields: {
            withCredentials: true
        },
        success: function(result) {
			// console.log(result);

			// revise vue object at home.js
			user_status.loggedIn = true;
			user_status.username = result.username;
			user_status.point = result.profile.point;
		},
		error: function() {
			// alert('get user info fail');
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
			card.label = result[0].label;
			card.work = result[0].performer.profile.job_description;
			card.intro = result[0].performer.profile.bio;
			card.img = result[0].performer.profile.img;

			remind_modal.drawnCard = true;
			gainPoints(30);
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
			coupon.name = result[0].vocher.store.title;
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
			gainPoints(30);
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

	// initialize popover and tooltip
	$('[data-toggle="popover"]').popover({container: "body"});
	$('[data-toggle="tooltip"]').tooltip({'placement': 'top'});

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
			// alert('get login status fail!');
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
