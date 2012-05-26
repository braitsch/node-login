
var socket, connections;

$(document).ready(function() {
	initSocket();
});

function initSocket()
{
	console.log('socket-initializing')
	socket = io.connect();
	socket.on('bridge-status', function (data) {
		connections = data.connections;
		var i=0; for (p in connections) i++;
		var s = i > 1 ? ' are '+i+' People ' : ' is '+i+' Person ';
		$('#cnt').html('There '+s+' Currently Connected');
	});
	socket.on('bridge-event', function (data) {
		console.log('bridge-event received');
	});
}
