// Define the tour!
var tour = {
id: "hello-hopscotch",
steps: [
  {
    title: "My content",
    content: "Here is where I put my content.",
    target: "help-icon",
    placement: "bottom",
    arrowOffset: 140,
    xOffset: -150
  },
  {
    title: "My Header",
    content: "This is the header of my page.",
    target: "nav-btn",
    placement: "bottom",
    fixedElement: true,
    xOffset: 20
  },
],
};

var user_status = new Vue({
	el: '#navbarResponsive',
	data: {
		loggedIn: false,
		username: '',
		point: 0
	}
});

let prev_js = "";
let prev_css = "";
function loadPage(page,callback){
	script_name = "../js/"+page+".js";
	css_name = "../css/"+page+".css";

	if( ! (script_name == prev_js && css_name == prev_css) || prev_js == "../js/menuPage.js" ){
		
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
			    alert('Failed to load script');
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
			console.log(result);
			location.reload();
		}
	});
}

function gainPoints(points) {
	user_status.point += points;
}

$(document).click( function (event){
	let clickover = event.target;
	let opened = $(".navbar-collapse").hasClass('show');
	if( opened && !$("nav.navbar").has(clickover).length ){
		$("#navbarResponsive").collapse('hide');
	}
})

$(document).ready(function(){
	$('.lazy').Lazy({
		effect: 'fadeIn',
		effectTime: 2000,
		threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
	});

	loadPage('menuPage');
	$('#logout-btn').on('click', logout);

	// Start the tour!
	hopscotch.startTour(tour);
	// startIntro();
});

// for intro js
function startIntro(){
var intro = introJs();
  intro.setOptions({
    steps: [
      { 
        intro: "Hello world!"
      },
      { 
        intro: "You <b>don't need</b> to define element to focus, this is a floating tooltip."
      },
    ]
  });
  intro.start();
}