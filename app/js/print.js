
var deletedItem;

$(document).ready(function(){
	
	$('li').click(function(e){
		deletedItem = $(this);
		deleteItem(deletedItem.attr("id"));
	})
	
})

function deleteItem(id)
{
	$.ajax({ 
		url: '/delete',
		type: 'POST',
		cache: false,
		data: { id: id},
		success: function(data){
			deletedItem.fadeOut(500, function() { $(this).remove(); });
		},
		error: function(jqXHR){
			console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
		}
	});
}