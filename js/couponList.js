var resource = new Vue({
    el: '.main',
    data: {
		vocherMorethanFour:false,
        selected: false,
        coupons: [],	//store vochers to display
		allVocher : [],		//store all vochers
		usableVocher : [],	//store usable vochers
    },
    methods: {
        delayShow: function(k) {
            $('#back' + k).removeClass('hide');
            $('#front' + k).addClass('shrink');
        },
        dcheck: function(k) {
            $('#back' + k).addClass('hide');
            $('#front' + k).removeClass('shrink');
        },
        getAllVocher:function(){
			//console.log("getAllVocher");
			resource.allVocher = [];
			$.ajax({
				url: 'https://imnight2018backend.ntu.im/earth/list/vocher/',
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					for(var i = 0; i < data.length; i++){
						var isUsable = false;
						for(var j = 0; j < resource.usableVocher.length; j++){
							//console.log(resource.usableVocher[j].title);
							if(data[i].id == resource.usableVocher[j].vocher.id){
								isUsable = true;
							}
						}
						var object = {
							vocher:data[i],
							usable:isUsable
						}
						resource.allVocher.push(object);
					}
				},
				error: function(data) {
					alert("fail getAllVocher");
				}
			});
		},
		getUserVocher:function() {
			//console.log("getUserVocher");
			resource.usableVocher = [];
			$.ajax({
				url: 'https://imnight2018backend.ntu.im/earth/vocher/',
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					//console.log(data);
					for (var i = 0; i < data.length; i++) {
						if(data[i].be_used == false){
							var object = {
								vocher : data[i].vocher,
								usable : true,
								label : data[i].label
							};
							resource.usableVocher.push(object);
						}
					}
				},
				error: function(data) {
					alert("fail getUserVocher");
				}
			});
		},
		submit: function(k,label) {
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
            this.dcheck(k);
			this.getAllVocher();
			this.getUserVocher();
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

//get start
resource.getUserVocher();
resource.getAllVocher();

/* clear array for new page */
function clear() {
    resource.coupons = [];
}

function showMoreVocher(){
	var vocherSize = resource.coupons.length;
	var allSize = resource.allVocher.length;
	//console.log(vocherSize,allSize,allSize-vocherSize);
	if((allSize - vocherSize) > 4){
		for(var i = vocherSize; i < vocherSize+4; i++){
			resource.coupons.push(resource.allVocher[i]);
		}
		resource.vocherMorethanFour = true;		
	}else{
		for(var i = vocherSize; i < allSize; i++){
			resource.coupons.push(resource.allVocher[i]);
		}
		resource.vocherMorethanFour = false;		
	}
}

function switchCase() {
	resource.selected = !resource.selected;
    if (resource.selected == true) {
		$('.switch').addClass('sliderChecked');
		$('.slider').addClass('sliderMove');
        clear();
		resource.coupons = resource.usableVocher;
    } else {
		$('.switch').removeClass('sliderChecked');
		$('.slider').removeClass('sliderMove');
        clear();
		if(resource.allVocher.length > 4){
			resource.vocherMorethanFour = true;
			for(var i = 0; i < 4; i++){
				resource.coupons.push(resource.allVocher[i]);
			}
		}else{
			resource.coupons = resource.allVocher;
		}
    }
}

switchCase();

function goShop() {
    $('.modal').modal('toggle');
    $(".modal-backdrop.fade.show").remove();
    setTimeout(function(){
        loadPage('shop');
    }, 500);
}