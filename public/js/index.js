console.log('hello');

var socket, connections;

$(document).ready(function() {
	initSocket();	
});

function initSocket()
{
	socket = io.connect();
	socket.on('bridge-status', function (data) {
		connections = data.connections;
		var i=0; for (p in connections) i++;
		console.log(i + ' People Currently Connected');
	});
	socket.on('draw-data', function (data) {
		console.log('draw-data received');
	});
}
