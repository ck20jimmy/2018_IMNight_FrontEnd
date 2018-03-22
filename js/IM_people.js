
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

//user link function in tmplt.js
function load_chatroom( label, uname ){
	link('chatroom', function(){
		select_performer( label, uname )
	});
}