var chatlist = new Vue({
	el:"#list-content",
	data:{
		people: []
	}
});

var current_label = "" ;
var chatsock = null ;

$(document).ready(function(){
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
			alert('get get performer-list fail!');
		}
	});

    $("div#mainContext").on("remove",function(){
        if( chatsock ){
            chatsock.close();
            chatsock = null;
        }
    });
});

function select_performer( label,name, uname ){
    $("#performer-name").empty().text(name);
    $("#chatcontent").empty();

    if( current_label == "" ){
		current_label = label;
        chatsock = new ReconnectingWebSocket("wss://imnight2018backend.ntu.im/human/chat/"+current_label+"/");
    }
	else{
		chatsock.close();
        current_label = label;
        chatsock = new ReconnectingWebSocket("wss://imnight2018backend.ntu.im/human/chat/"+current_label+"/");
	}

	chatsock.onmessage = function(message) {
        var data = JSON.parse(JSON.parse(message.data));
        let r = $("<div></div>");
        r.addClass("row");
        
        let col = $("<div></div>");
        col.addClass("col-sm-12");

        let m = $("<div></div>");

        //user message is on the right side
        if( uname != data.handle ){
        	m.addClass("speech-right-bubble float-right");
        	m.append(data.message);
        }
        else{
        	m.addClass("speech-left-bubble float-left");
        	m.append(data.message);
        }
        col.append(m);
        r.append(col);
        $('#chatcontent').append(r);
	};

    $("#chatform").on("submit", function(event) {
        var text = $("#user_input").val();
        if( text == "" ){
            return false;
        }
        var message = {
            message: text,
        }
        chatsock.send(JSON.stringify(message));
        $("#user_input").val('').focus();
        return false;
    });

    $("#people-list").collapse('hide');
}

$(document).click( function (event){
    let clickover = event.target;
    let opened = $("#people-list").hasClass('show');
    if( opened && !$("#people-list").has(clickover).length ){
        $("#people-list").collapse('hide');
    }
})

$( function(){
	$('.lazy').Lazy({
		effect: 'fadeIn',
		effectTime: 1000,
		threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
	});	
})

$("#people-list").on("show.bs.collapse hide.bs.collapse", function(){
    let angle = $("#show_list").find('svg');
    if( angle.hasClass("angle-up") ){
        angle.removeClass("angle-up");
    }
    else{
        angle.addClass("angle-up")
    }
});

// $(function() {
//     // When we're using HTTPS, use WSS too.
//     // var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    
//     // var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + window.location.pathname);
//     var chatsock = new ReconnectingWebSocket("wss://imnight2018backend.ntu.im/human/chat/92652350205778747810/");

//     chatsock.onmessage = function(message) {
//         var data = JSON.parse(JSON.parse(message.data));

//         console.log(data)

//         let r = $("<div></div>");
//         r.addClass("row");
        
//         let col = $("<div></div>");
//         col.addClass("col-sm-12");

//         let m = $("<div></div>");
//         //check handle == user

//         //user message is on the right side
//         if(true){
//          m.addClass("speech-right-bubble float-right");
//          m.append(data.message);
//         }
//         else{
//          m.addClass("speech-left-bubble float-left");
//          m.append(data.message);
//         }
//         col.append(m);
//         r.append(col);
//         $('#chatcontent').append(r);
//     };

//     $("#chatform").on("submit", function(event) {
//         var text = $("#user_input").val();
//         if( text == "" ){
//          return false;
//         }
//         var message = {
//             message: text,
//         }
//         chatsock.send(JSON.stringify(message));
//         $("#user_input").val('').focus();
//         return false;
//     });
// });