var resource = new Vue({
    el: '.main',
    data: {
		courseMorethanFour:false,
        classes: []
    },
    methods: {
        move: function(k) {
            k = String(k);
            /*initiate others*/
            for (var i = 0; i < this.classes.length; i++) {
                if (this.classes[i].id == Number(k)) {
                    $('#card' + k).toggleClass('lift');
                    $('#back' + k).toggleClass('transform-active');
                    $('#cb' + k).toggleClass('moveRight');
                } else {
                    $('#card' + this.classes[i].id).removeClass('lift');
                    $('#back' + this.classes[i].id).removeClass('transform-active');
                    $('#cb' + this.classes[i].id).removeClass('moveRight');
                }
            }
        },
        crack: function(k) {
            k = String(k);
			var label = $('#task'+k).html();
			//console.log("this is the label: "+label);
            $('#egg' + k).addClass('hide');

            $('#eggDown' + k).removeClass('hide');
            $('#eggDown' + k).addClass('downAnimate');

            $('#eggUp' + k).removeClass('hide');
            $('#eggUp' + k).addClass('upAnimate');
			
            /* need to add 1 point*/
			$.ajax({
				type: 'POST',
				url: 'https://imnight2018backend.ntu.im/lottery/finish/',
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
					console.log("label: "+label);
				},
				error: function(data) {
					alert("fail POST" + data);
				}
			});
        },
		showCourse: function(label,id) {
			$.ajax({
				url: 'https://imnight2018backend.ntu.im/sky/course/'+String(label)+'/',
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					//console.log(data,id);
					document.getElementById("des"+id).innerHTML = String(data[0].more);
					document.getElementById("content"+id).innerHTML = String(data[0].content);
					//$('#des'+id).html(data[0].more);
					//$('#content'+id).html(data[0].content);
					document.getElementById("task"+id).innerHTML = String(data[0].task);
					//console.log(document.getElementById("task"+id).innerHTML);
				},
				error: function(data) {
					alert("fail showCourse" + data);
				}
			});
			
			this.move(id);
		},
		
    }
});


$(function() {
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/sky/list/courses/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            console.log(data);
			if(data.length > 6){
				resource.courseMorethanFour = true;
				for (var i = 0; i < 6; i++) {
					resource.classes.push(data[i]);
				}
			}else{
				for (var i = 0; i < data.length; i++) {
					resource.classes.push(data[i]);
				}
			}

			// lazy load
			$('.lazy').Lazy({
				effect: 'fadeIn',
				effectTime: 1000,
				threshold: 0,
		        onError: function(element) {
		            console.log('error loading ' + element.data('src'));
		        }
			});	
        },
        error: function(data) {
            alert("fail" + data);
        }
    });
});

function showMoreCourse(){
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/sky/list/courses/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
			for (var i = 6; i < data.length; i++) {
				resource.classes.push(data[i]);
			}
        },
        error: function(data) {
            alert("fail" + data);
        }
    });
	resource.courseMorethanFour = false;
}