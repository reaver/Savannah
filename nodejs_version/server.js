var express = require('express')
	, app = express()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server, { log: false });	

var port = 8080;
var connections = [];

server.listen(port);
console.log('Listening on port ' + port);

app.configure(function() {
  app.use(express.static(__dirname + '/'));
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	console.log('Got conenction!');

	socket.on("close", function() {
	  	console.log('request closed unexpectedly - NOT IMPLEMENTED');
	}.bind(this));

	socket.on("end", function() {
	  console.log('request ended unexpectedly - NOT IMPLEMENTED');
	}.bind(this));

	addConnection(socket);

}.bind(this));

function sendDataToSocket(socket, keyword, data){
	socket.emit(keyword, data);
}

function addConnection(connection){
	connections.push(connection);
}

function removeConnection(connection){
	for(var i = 0; i < connections.length; i++){
		var connectionInArray = connections[i];
		if(connection.id == connectionInArray.id){
			connections.splice(i, 1);
			break;
		}
	}
}

setInterval(function () {
  updateGameLogic();
}, 1000/30);


function updateGameLogic(){
	//console.log('Updating game loop');
}