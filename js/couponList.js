var resource = new Vue({
    el: '.main',
    data: {
		vocherMorethanFour:false,
        selected: false,
        coupons: []
    },
    methods: {
        delayShow: function(k) {
            $('#back' + k).removeClass('hide');
            $('#front' + k).addClass('shrink');
            $('#modal-content' + k).addClass('changeBg');
        },
        dcheck: function(k) {
            $('#back' + k).addClass('hide');
            $('#front' + k).removeClass('shrink');
            $('#modal-content' + k).removeClass('changeBg');
        },
        submit: function(k,label) {
            this.dcheck(k);
			$.ajax({
				type: 'POST',
				url: 'https://imnight2018backend.ntu.im/earth/use/vocher/',
				xhrFields: {
					withCredentials: true
				},
				data: JSON.stringify({"label":label}),
				contentType: "application/json",
				crossDomain: true,
				beforeSend: function(request) {
					var csrftoken = Cookies.get('csrftoken');
					request.setRequestHeader("X-CSRFTOKEN", csrftoken);
				},
				success: function(data) {
					//console.log("label: "+label);
				},
				error: function(data) {
					alert("fail POST" + data);
				}
			});
        },
        
    }
})

$(function() {
    $('.lazy').Lazy({
        effect: 'fadeIn',
        effectTime: 1000,
        threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
    });
})

function showAllVocher() {
	//console.log("showAllVocher");
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/earth/list/vocher/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            if(data.length > 4){
				resource.vocherMorethanFour = true;
				for (var i = 0; i < 4; i++) {
					resource.coupons.push(data[i]);
				}
			}else{
				for (var i = 0; i < data.length; i++) {
					resource.coupons.push(data[i]);
				}
			}
			console.log(resource.coupons);
        },
        error: function(data) {
            alert("fail showAllVocher" + data);
        }
    });
}


function showUserVocher() {
	//console.log("showUserVocher");
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/earth/vocher/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            //console.log(data.length);
            for (var i = 0; i < data.length; i++) {
				var object = {
					id : data[i].id,
					label : data[i].label,
					title : data[i].vocher.title,
					img : data[i].vocher.img,
					vocher : data[i].vocher,					
					description : data[i].vocher.description,
					due_time : data[i].vocher.due_time,
					useable : data[i].be_used,
					store : data[i].vocher.store
				};
				resource.coupons.push(object);
				//console.log(resource.coupons[i]);
            }
        },
        error: function(data) {
            alert("fail showUserVocher" + data);
        }
    });
}

/* clear array for new page */
function clear() {
    resource.coupons = [];
}

function switchCase() {
	resource.selected = !resource.selected;
    //console.log(resource.selected);
    if (resource.selected == true) {
		$('.switch').addClass('sliderChecked');
		$('.slider').addClass('sliderMove');
        clear();
        showUserVocher();
    } else {
		$('.switch').removeClass('sliderChecked');
		$('.slider').removeClass('sliderMove');
        clear();
        showAllVocher();
    }
}

switchCase();

function showMoreVocher(){
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/earth/list/vocher/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
			for (var i = 4; i < data.length; i++) {
				resource.coupons.push(data[i]);
			}
        },
        error: function(data) {
            alert("fail" + data);
        }
    });
	resource.vocherMorethanFour = false;
}

function goShop() {
    $('.modal').modal('toggle');
    $(".modal-backdrop.fade.show").remove();
    setTimeout(function(){
        loadPage('shop');
    }, 500);
}