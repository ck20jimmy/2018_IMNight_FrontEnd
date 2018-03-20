var resource = new Vue({
    el: '#mainContext',
    data: {
		storyMorethanFour:false,
        stories: [],
		allStories: [],
    },
    methods: {
        crack: function(k) {
            /* need to add 1 point*/
			gainPoints(20);
			
            k = String(k);
            $('#egg' + k).addClass('hide');

            $('#eggDown' + k).removeClass('hide');
            $('#eggDown' + k).addClass('downAnimate');

            $('#eggUp' + k).removeClass('hide');
            $('#eggUp' + k).addClass('upAnimate');
		},
		taskFinish: function(k,label){
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
			this.crack(k);
        },
		eggStatus: function(taskId,storyId){
			$.ajax({
				url: 'https://imnight2018backend.ntu.im/lottery/tasks/',
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					//console.log(data[0]);
					//console.log(data[1].states);
					for(var i = 0;i < data[0].length; i++){
						if(data[0][i].id == taskId){
							if(data[1].states[i] == true){
								resource.crack(storyId);
							}
						}
					}
				},
				error: function(data) {
					alert("fail get egg status");
				}
			});
		},
		showStory: function(label,id){
			var story = -1;
			$.ajax({
				url: 'https://imnight2018backend.ntu.im/sky/article/'+String(label)+'/',
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					console.log(data);
					$('#task'+id).html(data[0].task.label);
					$('#content'+id).html(data[0].content);
					story = data[0].task.id;
					resource.eggStatus(story,id);
				},
				error: function(data) {
					alert("fail showCourse");
				}
			});
		}
    }
})

$(function() {
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/sky/list/articles/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            //console.log(data);
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
			
			for (var i = 0; i < data.length; i++) {
				resource.allStories.push(data[i]);
			}
        },
        error: function(data) {
            alert("fail get article");
        }
    });
});


function showMoreStory(){
    var showStorySize = resource.stories.length;
	var allStorySize = resource.allStories.length;
	if((allStorySize - showStorySize) > 4){
		for(var i = showStorySize; i < showStorySize + 4; i++){
			resource.stories.push(resource.allStories[i]);
		}
		resource.storyMorethanFour = true;
	}else{
		for(var i = showStorySize; i < allStorySize; i++){
			resource.stories.push(resource.allStories[i]);
		}
		resource.storyMorethanFour = false;
	}
}