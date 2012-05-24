
module.exports = function(app) { 

	app.io.set('onConnect', onSocketConnect);
	
};

function onSocketConnect(socket)
{
	socket.on('bridge-event', function(data) { onSocketDrawData(socket, data); });		
}
 
function onSocketDrawData(socket, data)
{
// append this socket's id so we know who is talking //
	data.id = socket.id;
	socket.broadcast.emit('bridge-event', data);
}