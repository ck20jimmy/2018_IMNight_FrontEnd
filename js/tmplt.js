let prev_js = "";
let prev_css = "";
// var tour = new Tour({
//   steps: [
// 	  {
// 	    element: "#nav-btn",
// 	    title: "Title of my step",
// 	    content: "Content of my step"
// 	  }
//   ],

//   backdrop: true
// });

function loadPage(page,callback){
	script_name = "../js/"+page+".js";
	css_name = "../css/"+page+".css";

	if( ! (script_name == prev_js && css_name == prev_css) || prev_js == "../js/menuPage.js" ){
		// console.log(prev_js)
		
		//hide the nav bar
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
			  })
			  .fail(function( jqxhr, settings, exception ) {
			    alert('Failed to load script');
			});

		});

		prev_js = script_name;
		prev_css = css_name;

	}
};


function link(page){
	$(".modal-backdrop.fade.show").remove();
	loadPage(page);
}

function logout() {
	// alert('logged out!!');

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

	// $.post("https://imnight2018backend.ntu.im/rest_auth/logout/", {}, function(result){
	// 	console.log(result);
	// 	location.reload();
	// });	
}

$(document).click( function (event){
	let clickover = event.target;
	let opened = $(".navbar-collapse").hasClass('show');
	if( opened && !$("nav.navbar").has(clickover).length ){
		$("#navbarResponsive").collapse('hide');
	}
})

// function startIntro(){
//   var intro = introJs();
//     intro.setOptions({
//       steps: [
//         { 
//           intro: "Hello world!"
//         },
//         { 
//           intro: "You <b>don't need</b> to define element to focus, this is a floating tooltip."
//         },
//         {
//           element: document.querySelector('#nav-btn'),
//           intro: "This is a tooltip.",
//           position: 'bottom'
//         },
//         { 
//           intro: "You <b>don't need</b> to define element to focus, this is a floating tooltip."
//         },
//         { 
//           intro: "You <b>don't need</b> to define element to focus, this is a floating tooltip."
//         },        
//       ],
//       showProgress: true

//     });
//     intro.start();
// }

$(document).ready(function(){
	$('.lazy').Lazy({
		effect: 'fadeIn',
		effectTime: 2000,
		threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
	});

	// loadPage('remindPage');
	loadPage('menuPage');

	$('#logout-btn').on('click', logout);

	// Initialize the tour
	// tour.init();

	// Start the tour
	// tour.start();
});
