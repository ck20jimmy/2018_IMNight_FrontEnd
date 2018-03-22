var shows = new Vue({
	el: "#show-list",
	data: {
		shows: []
	}
})

$(function(){
	$('.lazy').Lazy({
		effect: 'fadeIn',
		effectTime: 1000,
		threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
	});
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/human/performer/list/',
		xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            chatlist._data.people = data ;
		},
		error: function() {
			// alert('get get performer-list fail!');
		}
	});	
})