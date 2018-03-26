$(function(){
    $('#home-word').fadeIn(1000, 'swing', function() {
        $('#start').show("blind", 500);
    });
})

$('#start').on('click', function() {
    setTimeout(function(){
        location.href = "home.html";
    }, 500);
});
