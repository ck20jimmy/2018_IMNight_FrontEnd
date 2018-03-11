var resource = new Vue({
    el: '.story',
    data: {
		storyMorethanFour:false,
        stories: []
    },
    methods: {
        crack: function(k) {
            /* need to add 1 point*/
            k = String(k);
			var label = $('#task'+k).html();
            $('#egg' + k).addClass('hide');

            $('#eggDown' + k).removeClass('hide');
            $('#eggDown' + k).addClass('downAnimate');

            $('#eggUp' + k).removeClass('hide');
            $('#eggUp' + k).addClass('upAnimate');

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
		showStory: function(label,id){
			$.ajax({
				url: 'https://imnight2018backend.ntu.im/sky/article/'+String(label)+'/',
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					//console.log(data);
					$('#task'+id).html(data[0].task.label);
					$('#content'+id).html(data[0].content);
					$('#detail'+id).html(data[0].detail);
				},
				error: function(data) {
					alert("fail showCourse" + data);
				}
			});
		}
    }
})

// $(function() {
//     $('.lazy').Lazy({
//         effect: 'fadeIn',
//         effectTime: 1000,
//         threshold: 0,
//         onError: function(element) {
//             console.log('error loading ' + element.data('src'));
//         }
//     });
// })

$(function() {
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/sky/list/articles/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            console.log(data);
            if(data.length > 4){
				resource.storyMorethanFour = true;
				for (var i = 0; i < 4; i++) {
					resource.stories.push(data[i]);
				}
			}else{
				for (var i = 0; i < data.length; i++) {
					resource.stories.push(data[i]);
				}
			}

			// console.log(resource.stories);
			
		    // $('.lazy').Lazy({
		    //     effect: 'fadeIn',
		    //     effectTime: 1000,
		    //     threshold: 0,
		    //     onError: function(element) {
		    //         console.log('error loading ' + element.data('src'));
		    //     }
		    // });
        },
        error: function(data) {
            alert("fail" + data);
        }
    });
});

function showMoreStory(){
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/sky/list/articles/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
			for (var i = 4; i < data.length; i++) {
				resource.stories.push(data[i]);
			}
        },
        error: function(data) {
            alert("fail" + data);
        }
    });
	resource.storyMorethanFour = false;
}