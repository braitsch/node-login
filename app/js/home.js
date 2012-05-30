$(document).ready(function(){

	$('#btn-logout').click(function(){
        var req = $.ajax({
            url: "/home",
            type: "POST",
            data: {logout : true}
        });

        req.done(function(msg) {
            window.location.href = '/';
        });

        req.fail(function(jqXHR, textStatus) {
            console.log( "request failed: " + textStatus );
        });     
	})
	
})