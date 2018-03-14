$(document).ready(function(){   

    var $window = $(window);

    // Function to handle changes to style classes based on window width
    function checkWidth() {
        if ($window.width() < 600) {
			if($('#detail').hasClass('col-8')){
				$('#detail').removeClass('col-8').addClass('col-9');
			}
        };

        if ($window.width() >= 600){
			if($('#detail').hasClass('col-9')){
				$('#detail').removeClass('col-9').addClass('col-8');
			}
        }
    }

    // Execute on load
    checkWidth();

    // Bind event listener
    $(window).resize(checkWidth);

   	$('.lazy').Lazy({
		effect: 'fadeIn',
		effectTime: 1000,
		threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
	});

    $.ajax({
        url: 'https://imnight2018backend.ntu.im/earth/list/store/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            // console.log(data);
			for (var i = 0; i < data.length; i++) {
				resource.shops.push(data[i]);
			}
        },
        error: function(data) {
            alert("fail" + data);
        }
    });

	// show first shop information
    setTimeout(function(){
		$('.list-group-item').first().addClass('active');
		$('.tab-pane').first().addClass('active');
    }, 300);
});

var resource = new Vue({
	el:'#mainContext',
	data:{
		shops:[]
	},
	methods:{
		swap:function(k){
			$('#img-'+k).toggleClass('hideImg');
			$('#des-'+k).toggleClass('hidescript');
			for(var i = 1;i <= this.shops.length; i++){
				if(i != k){
					if($('#img-'+k).hasClass('hideImg')){
						$('#img-'+i).removeClass('hideImg');
						$('#des-'+i).addClass('hidescript');
					}else{
						$('#img-'+i).addClass('hideImg');
						$('#des-'+i).removeClass('hidescript');
					}
				}
			}
		},
		changeCss:function(k){
			for(var i = 1;i <= this.shops.length; i++){
				if(i == k){
					$("#Img-"+i).toggleClass('movex');
					$("#Des-"+i).toggleClass('moveLeft');
					$("#DesDe-"+i).toggleClass('show');
				}else{
					$("#Img-"+i).removeClass('movex');
					$("#Des-"+i).removeClass('moveLeft');
					$("#DesDe-"+i).removeClass('show');
				}
			}
		}
	}
});

// $(function(){
// 	$('.lazy').Lazy({
// 		effect: 'fadeIn',
// 		effectTime: 1000,
// 		threshold: 0,
//         onError: function(element) {
//             console.log('error loading ' + element.data('src'));
//         }
// 	});	
// })

// $(function() {
//     $.ajax({
//         url: 'https://imnight2018backend.ntu.im/earth/list/store/',
//         type: 'GET',
//         xhrFields: {
//             withCredentials: true
//         },
//         success: function(data) {
//             console.log(data);
// 			for (var i = 0; i < data.length; i++) {
// 				resource.shops.push(data[i]);
// 			}
//         },
//         error: function(data) {
//             alert("fail" + data);
//         }
//     });
// });

function Intial(id){
	$('#list-'+id).addClass('active');
	$('#right'+id).addClass('active');
}

//Intial(resource.shops[0].id);
