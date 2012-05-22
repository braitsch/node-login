
var io, clients = {};
var appName = 'bridge';

module.exports = function(sio) { io = sio; io.on('connection', registerSocket); };
module.exports.init = function(){};

// --- events and callbacks unique to this application //

function addEventHandlers(socket)
{
	socket.on('custom-event', function(data) { onCustomEvent(socket, data); });		
}
 
function onCustomEvent(socket, data)
{
// append this socket's id so we know who is talking //
	data.id = socket.id;
	socket.broadcast.emit('custom-event', data);
}


// --- general connection methods used by all applications --- //

function registerSocket(socket)
{
// listen for connections events //
	onSocketConnect(socket);
	socket.on('disconnect', function() { onSocketDisconnect(socket); });
}

function onSocketConnect(socket)
{
	if (socket.handshake.headers.host.indexOf(appName) != -1){
		console.log('connecting ---', socket.handshake.headers.host);
		addEventHandlers(socket);
		// dispatch to clients //		
		clients[socket.id] = {};
		io.sockets.emit(appName + '-status', { connections:clients });
	}
}

function onSocketDisconnect(socket)
{	
	if (socket.handshake.headers.host.indexOf(appName) != -1){
		console.log('disconnecting --- ', socket.handshake.headers.host, socket.id)
		// dispatch to clients //
		delete clients[socket.id];
		io.sockets.emit(appName + '-status', { connections:clients });
	}
}
