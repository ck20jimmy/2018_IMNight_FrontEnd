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
        url: 'https://imnight2018backend.ntu.im/earth/list/store',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            //console.log(data);
			for (var i = 0; i < data.length; i++) {
				if(data[i].info != ""){
					// console.log(data[i]);
					resource.shops.push(data[i]);
				}
			}
        },
        error: function(data) {
            // alert("fail" + data);
        }
    });

	// show first shop information
    setTimeout(function(){
		$('.list-group-item').first().addClass('active');
		$('.tab-pane').first().addClass('active');

		var firstID = resource.shops[0].id;
		resource.lastTab = firstID;
		//$('#img-'+firstID).toggleClass('hideImg');
		//$('#des-'+firstID).toggleClass('hidescript');
		$("#Img-"+firstID).toggleClass('movex');
		$("#Des-"+firstID).toggleClass('moveLeft');
		$("#DesDe-"+firstID).toggleClass('show');
    }, 500);
});

var resource = new Vue({
	el:'#mainContext',
	data:{
		shops:[],
		lastTab: 0
	},
	methods:{
		swap:function(k){
			if (k == this.lastTab) {
				return undefined;
			}
			else {
				this.lastTab = k;
			}
			//$('#img-'+k).toggleClass('hideImg');
			//$('#des-'+k).toggleClass('hidescript');
			for(var i = 0;i < this.shops.length; i++){
				var tabID = this.shops[i].id;
				if(tabID != k){
					if($('#img-'+k).hasClass('hideImg')){
						//$('#img-'+tabID).removeClass('hideImg');
						//$('#des-'+tabID).addClass('hidescript');
					}else{
						//$('#img-'+tabID).addClass('hideImg');
						//$('#des-'+tabID).removeClass('hidescript');
					}
				}
			}

			$("html, body").animate({ scrollTop: 0 }, "slow");
		},
		changeCss:function(k){
			if (k == this.lastTab) {
				return undefined;
			}
			else {
				this.lastTab = k;
			}
			for(var i = 0; i < this.shops.length; i++){
				var tabID = this.shops[i].id;
				if(tabID == k){
					$("#Img-"+tabID).toggleClass('movex');
					$("#Des-"+tabID).toggleClass('moveLeft');
					$("#DesDe-"+tabID).toggleClass('show');
				}else{
					$("#Img-"+tabID).removeClass('movex');
					$("#Des-"+tabID).removeClass('moveLeft');
					$("#DesDe-"+tabID).removeClass('show');
				}
			}
			$("html, body").animate({ scrollTop: 0 }, "slow");
		}
	}
});


