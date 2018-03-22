var resource = new Vue({
    el: '.main',
    data: {
		courseMorethanFour:false,
        classes: [],	//store class to show
		allClass:[]		//store all classes
    },
    methods: {
        crack: function(k) {
				
            k = String(k);
            $('#egg' + k).addClass('hide');

            $('#eggDown' + k).removeClass('hide');
            $('#eggDown' + k).addClass('downAnimate');

            $('#eggUp' + k).removeClass('hide');
            $('#eggUp' + k).addClass('upAnimate');
		},
		taskFinish: function(k){
			/* need to add 1 point*/
			gainPoints(20);
			
			var label = document.getElementById("task"+k).innerHTML; 
			console.log("label+"+label);
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
					// alert("fail POST task");
				}
			});
			this.crack(k);
        },
		eggStatus: function(taskLabel,courseID){
			$.ajax({
				url: 'https://imnight2018backend.ntu.im/lottery/check/'+taskLabel+'/',
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					console.log(data.is_task_available);
					if(data.is_task_available == false){
						resource.crack(courseID);
					}
				},
				error: function(data) {
					// alert("fail get egg status");
				}
			});
		},
		showCourse: function(label,id) {
			var course = -1;
			$.ajax({
				url: 'https://imnight2018backend.ntu.im/sky/course/'+String(label)+'/',
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					console.log(data);
					document.getElementById("content"+id).innerHTML = String(data[0].content);
					document.getElementById("task"+id).innerHTML = String(data[0].task.label);
					course = data[0].task.label;
					resource.eggStatus(course,Number(id));
				},
				error: function(data) {
					// alert("fail showCourse");
				}
			});
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
			if(data.length > 4){
				resource.courseMorethanFour = true;
				for (var i = 0; i < 4; i++) {
					resource.classes.push(data[i]);
				}
			}else{
				for (var i = 0; i < data.length; i++) {
					resource.classes.push(data[i]);
				}
			}
			
			for(var i = 0; i < data.length; i++){
				resource.allClass.push(data[i]);
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
            // alert("fail" + data);
        }
    });
});

function showMoreCourse(){
	var showCourseSize = resource.classes.length;
	var allClassSize = resource.allClass.length;
	if((allClassSize - showCourseSize) > 4){
		for(var i = showCourseSize; i < showCourseSize + 4; i++){
			resource.classes.push(resource.allClass[i]);
		}
		resource.courseMorethanFour = true;
	}else{
		for(var i = showCourseSize; i < allClassSize; i++){
			resource.classes.push(resource.allClass[i]);
		}
		resource.courseMorethanFour = false;
	}
}