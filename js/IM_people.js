
var people = new Vue({
	el: "#IM_people",
	data: {
		people:[]
	}
})

$(document).ready( function(){
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/human/performer/list/',
		xhrFields: {
            withCredentials: true
        },
        success: function(data) {
        	people._data.people = data;
        	// console.log(data);
		},
		error: function() {
			alert('get IM_People fail!');
		}
	});
});

$(function(){
	$('.lazy').Lazy({
		effect: 'fadeIn',
		effectTime: 1000,
		threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
	});	
})

//user link function in tmplt.js
function load_chatroom( label, uname ){
	link('chatroom', function(){
		select_performer( label, uname )
	});
}