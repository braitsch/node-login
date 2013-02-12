
function ActivatedController()
{

// redirect to homepage on account activation, add short delay so user can read alert window //
	$('.modal-alert #ok').click(function(){ setTimeout(function(){window.location.href = '/';}, 300)});
}