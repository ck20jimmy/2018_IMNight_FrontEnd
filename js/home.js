// Define the tour!
var tour = {
id: "hello-hopscotch",
steps: [
  {
    title: '歡迎！',
    content: '首次來到2018臺大資管之夜\"緣\"嗎？<br>點選Next觀看使用說明！',
    target: "help-icon",
    placement: "bottom",
    arrowOffset: 150,
    xOffset: -150,
    onShow: function(){
    	$('#remindModal').modal('hide');
    }
  },
  {
    title: "主畫面按鈕",
    content: "點擊左上角字樣來回到主畫面。",
    target: "nav-btn",
    placement: "bottom",
    fixedElement: true,
    xOffset: 20
  },
  {
    title: "打開提醒視窗",
    content: "點擊鈴鐺icon來打開提醒視窗，<br>在提醒視窗，你可以抽卡、抽每日優惠券，和查看最新消息。<br>時不時打開它看看吧！",
    target: "bell-icon",
    placement: "bottom",
    fixedElement: true,
    arrowOffset: 180,
    xOffset: -180,
    onNext: function(){
    	// $('#remindModal').modal('show');
    	setTimeout(function(){
    		$('#remind-close').attr('disabled', true);
    	}, 1000);
    	$('#remindModal').modal('show');
    }
  },
  {
    title: "天天抽卡、抽優惠券吧",
    content: "在提醒視窗中點擊來抽卡和每日優惠券。您可以前往地緣->優惠券列表，去附近商家使用你的優惠券。",
    target: "help-icon",
    fixedElement: true,
    placement: "bottom",
    arrowOffset: 120,
    xOffset: -160,
    yOffset: 250,
    onNext: function(){
    	$('#remindModal').modal('hide');
    	$("#navbarResponsive").collapse('show');
    	setTimeout(function(){
    		$('#sky-nav').trigger('click');
    	}, 200);
    	$(document).off('click', navhide);
    }
  },
  {
    title: "選單：天緣",
    content: "IM故事館蘊藏著資管系人們的故事；<br>課程與學習資源則收錄部分系上必修課程資訊。",
    target: "sky-nav",
    placement: "bottom",
    yOffset: 80,
    xOffset: 20,
    onNext: function(){
	    $('#land-nav').trigger('click');
    }
  },
  {
    title: "選單：地緣",
    content: "到優惠券列表查看&使用您擁有的優惠券，記得讓店員點選使用按鈕！<br>商家列表則是在地店家的資訊。",
    target: "land-nav",
    placement: "bottom",
    xOffset: 20,
    onNext: function(){
	    $('#people-nav').trigger('click');
    }
  },
  {
    title: "選單：人緣",
    content: "資管人記錄了所有你抽過的表演者資訊，快到聊天室找他們聊聊！",
    target: "people-nav",
    placement: "bottom",
    yOffset: 30,
    xOffset: 20
  },
  {
    title: '尋找彩蛋、累積點數！',
    content: '每次抽卡、抽優惠券都能加30點，找到藏在「天緣」文章中的彩蛋也能加20點。<br>集點越多越有機會在之夜當天抽到豐厚獎品。',
    target: "login-text",
    placement: "bottom",
    xOffset: 50,
    onNext: function(){
    	$(document).on('click', navhide);
    }
  },
  {
    title: '幫助',
    content: '再次打開幫助，請點選此圖示。<br>用抽卡來開啟你今天的緣吧！',
    target: "help-icon",
    placement: "bottom",
    arrowOffset: 150,
    xOffset: -150
  },  
],
onEnd: function(){
	$('#remindModal').modal('show');
	$('#remind-close').attr('disabled', false);
	$.ajax({
		type: 'post',
		url: 'https://imnight2018backend.ntu.im/accounts/read/tutorial/',
		xhrFields: {
			withCredentials: true
		},
		data: {},
		crossDomain: true,
		beforeSend: function(request) {
			var csrftoken = Cookies.get('csrftoken');
   			request.setRequestHeader("X-CSRFTOKEN", csrftoken);
  		}
	});
	$(document).on('click', navhide);
},
onClose: function(){
	$('#remindModal').modal('show');
	$('#remind-close').attr('disabled', false);
	$(document).on('click', navhide);
}
};

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

var user_status = new Vue({
	el: '#mainNav',
	data: {
		loggedIn: false,
		username: '',
		point: 0,
		remind: 0
	}
});

let prev_js = "";
let prev_css = "";
function loadPage(page,callback){
	script_name = "js/"+page+".js";
	css_name = "css/"+page+".css";

	if( ! (script_name == prev_js && css_name == prev_css) || prev_js == "js/menuPage.js" ){
		
		//hide the nav bar
		$(".sidenav-second-level").collapse('hide')
		$("#navbarResponsive").collapse('hide');

		//remove previous page's html & js & css
		$('script[src="'+ prev_js +'"]').remove();
		$('link[href="'+ prev_css +'"]').remove();
		$(".container .main-content").empty();

		// apply page.css
		var css = document.createElement('link');
		css.rel="stylesheet";
		css.href= css_name;
		document.head.appendChild(css);
		
		// load #mainContext of page.html
		$("div.container.main-content").load(page+".html #mainContext", function(){
			// load page.js
			$.getScript( script_name )
			  .done(function( script, textStatus ) {
			    // alert('Successfully loaded script');
			    $(window).scrollTop(0);
			    if( callback){
			    	callback();
			    }

			  })
			  .fail(function( jqxhr, settings, exception ) {
			    // alert('Failed to load script');
			});

		});

		prev_js = script_name;
		prev_css = css_name;

	}
};


function link(page,callback){
	$(".modal-backdrop.fade.show").remove();
	loadPage(page, callback);
}

function logout() {
	$.ajax({
		type: 'post',
		url: 'https://imnight2018backend.ntu.im/rest_auth/logout/',
		xhrFields: {
			withCredentials: true
		},
		data: {},
		crossDomain: true,
		beforeSend: function(request) {
			var csrftoken = Cookies.get('csrftoken');
   			request.setRequestHeader("X-CSRFTOKEN", csrftoken);
  		},
		success: function(result) {
			location.reload();
		}
	});
}

function gainPoints(points) {
	user_status.point += points;
}

function startTour(){
	if (!user_status.loggedIn) {
		return;
	}

	if ($(window).width() > 992) {
		var tour2 = $.extend(true, {}, tour);

    	tour2.steps[3].onNext = function(){ $('#remindModal').modal('hide'); $('#sky-nav').trigger('click'); };
		tour2.steps[3].xOffset = $(window).width()/2-$('#help-icon').offset().left-140;
		tour2.steps[3].yOffset = $(window).height()/2-100;
		tour2.steps[4].yOffset = 110;
   		tour2.steps[6].yOffset = 60;
		hopscotch.startTour(tour2);
	}
	else {
		var tour1 = $.extend(true, {}, tour);
		tour1.steps[3].yOffset = $(window).height()*0.3;
		hopscotch.startTour(tour1);
	}
	hopscotch.showStep(0);
}

function show_remind_modal() {
	if (user_status.loggedIn) {
		$('#remindModal').modal('show');
	}
	else {
		$('#loginModal').modal('show');
	}
}

function showEggFoundModal() {
	$('#eggFoundModal').modal('show');
}

// from menuPage.js
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
        	$('#loginModal').remove();			
        	remind_modal.drawnCard = data.performer_drawn;
			remind_modal.takenDiscount = data.vocher_drawn;
			remind_modal.all_performers_drawn = data.all_performers_drawn;
			if (remind_modal.all_performers_drawn) {
				remind_modal.drawnCard = true;
			}
			// if the user hasn't seen tour yet, start the tour!
			if (!data.is_read_tutorial) {
				startTour();
			}
			else  {
				$('#remindModal').modal('toggle');
			}

			// for notification
			if (!data.vocher_drawn) {
				user_status.remind++;
			}
			if (!data.performer_drawn) {
				user_status.remind++;
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

function not_login_init() {
	user_status.loggedIn = false;
	user_status.remind++;

	$('#remindModal').remove();
	$('#loginModal').modal('toggle');

	$('#help-icon').remove();
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
			user_status.remind--;
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
			user_status.remind--;
		}
	});
}

function navhide(event){
	let clickover = event.target;
	let opened = $(".navbar-collapse").hasClass('show');
	if( opened && !$("nav.navbar").has(clickover).length ){
		$("#navbarResponsive").collapse('hide');
	}
}

$(document).on('click', navhide);

$(document).ready(function(){
	$('.lazy').Lazy({
		effect: 'fadeIn',
		effectTime: 2000,
		threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
	});

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
				not_login_init();
			}
		},
		error: function() {
			// location.href = "maintainence.html";
		}
	});
	// draw card and draw coupon events
	$('#draw-card').on('click', draw_card);
	$('#draw-discount').on('click', draw_coupon);

	// initialize tooltip
	$('[data-toggle="tooltip"]').tooltip({'placement': 'top'});

	loadPage('menuPage');
	$('#help-icon').on('click', startTour);
	$('#bell-icon').on('click', show_remind_modal);

	// for egg found focus
	$('#eggFoundModal').on('hidden.bs.modal', function (e) {
	    $('body').addClass('modal-open');
	});
});