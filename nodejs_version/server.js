var express = require('express')
	, app = express()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server, { log: false });	

var port = 8080;

var connections = [];
var numberOfLions = 0;
var numberOfAntilopes = 0;

var LION_ID = 0;
var ANTILOPE_ID = 1;
var id = 1;

var imageScale = 0.5;
var size = 128 * imageScale;

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

	socket.on("spawn", function() {
	  setupAnimal(getClient(socket));
	}.bind(this));

	socket.on("close", function() {
	  	console.log('request closed unexpectedly - NOT IMPLEMENTED');
	}.bind(this));

	socket.on("end", function() {
	  console.log('request ended unexpectedly - NOT IMPLEMENTED');
	}.bind(this));

	socket.on("v", function(data){
		setClientVelocity(socket, data);
	}.bind(this));

	addConnection(socket);
}.bind(this));

function sendDataToSocket(socket, keyword, data){
	socket.emit(keyword, data);
}

function addConnection(connection){
	var client = {
		socket: connection,
		id: 0,
		animal: LION_ID, //Default lion
		alive: true,
		timestamp: new Date().getTime(),
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		feed: false
	}
	connections.push(client);
	return client;
}

function getClient(socket){
	for(var i = 0; i < connections.length; i++){
		var connectionInArray = connections[i];
		if(socket == connectionInArray.socket){
			return connectionInArray;
		}
	}
	return null;
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

setInterval(function () {
  sendUpdateMSG();
}, 1000/3);


function updateGameLogic(){
	//console.log('Updating game loop');
	var currentTime = new Date().getTime();

	for(var i = 0; i < connections.length; i++){
		var client = connections[i];
		if(client){
			if(client.alive){
				var lifeleft = (client.timestamp + 10 * 1000) - currentTime;
				//console.log('Life left ' + lifeleft);
				if(lifeleft <= 0){
					//Die!
					kill(client);
				}else{
					updatePosition(client);
				}
			}
		}else{
			console.log('Client is null');
		}
	}
	var clientOne, clientTwo;
	for(var i = 0; i < connections.length; i++){
		clientOne = connections[i];
		for(var j = 0; j < connections.length; j++){
			clientTwo = connections[j];
			checkCollision(clientOne, clientTwo);
		}
	}
}

function sendUpdateMSG(){
	var updatemsg = [];
	for(var i = 0; i < connections.length; i++){
		var client = connections[i];
		if(client){
			updatemsg.push(createPlayerArray(client));
		}
	}
	for(var i = 0; i < connections.length; i++){
		var client = connections[i];
		if(client){
			sendDataToSocket(client.socket, 'u', updatemsg);
		}
	}
	//console.log('sending update');
	//console.log(updatemsg);
}

function setClientVelocity(socket, data){
	for(var i = 0; i < connections.length; i++){
		var connectionInArray = connections[i];
		if(connectionInArray.alive){
			if(connectionInArray.socket == socket){
				//console.log("Got new speed: " + data.vx + " " + data.vy);
				connectionInArray.vx = data.vx;
				connectionInArray.vy = data.vy;
				break;
			}
		}
	}
}

function createPlayerArray(client){
	var array = {
		id:(client.id),
		animal:(client.animal),
		x:(minimize(client.x)),
		y:(minimize(client.y)),
		vx:(minimize(client.vx)),
		vy:(minimize(client.vy))
	};
	
	return array;
}

function minimize(number){
	return Math.round(number * 100) / 100;
}

function kill(client){
	client.alive = false;
	client.vx = 0;
	client.vy = 0;
	var diemsg = { id: client.id, source:0};
	sendDataToSocket(client.socket, 'die', diemsg);
	if(client.animal == LION_ID){
		numberOfLions--;
	}else if(client.animal == ANTILOPE_ID){
		numberOfAntilopes--;
	}
}

function feed(client){
	client.feed = true;
	sendDataToSocket(client.socket, 'feed', 'yumyum');
}

function mate(clientOne, clientTwo){
	//Setup new animal
	//Kill old one
}

function updatePosition(client){
	//console.log("Before" + client.x + " " + client.y);
	client.x += client.vx*10;
	client.y += client.vy*10;
	//console.log("After" + client.x + " " + client.y);
}

function checkCollision(clientOne, clientTwo){
	if(clientOne.id != clientTwo.id){
		if(clientOne.alive && clientTwo.alive){
			if(clientOne.animal != clientTwo.animal){
				//console.log('Checking collision');
				//Check if colliding
				if(collides(clientOne, clientTwo)){
					console.log('Client[' + clientOne.id + "] " + clientOne.animal + ' eatcollision with Client[' + clientTwo.id + "] " + clientTwo.animal);
		    		if(clientOne.animal == ANTILOPE_ID){
		    			kill(clientOne);
		    			feed(clientTwo);
		    		}else if(clientTwo.animal == ANTILOPE_ID){
		    			kill(clientTwo);
		    			feed(clientOne);
		    		}
				}
			}else{
				if(clientOne.feed && clientTwo.feed){
					if(collides(clientOne, clientTwo)){
						console.log('Client[' + clientOne.id + "] " + clientOne.animal + ' matecollision with Client[' + clientTwo.id + "] " + clientTwo.animal);
			    		mate(clientOne, clientTwo);
					}
				}
			}
		}
	}
}

function collides(clientOne, clientTwo){
	if(clientTwo.x - (size / 2) < clientOne.x + (size / 2) && clientTwo.x + (size / 2) > clientOne.x - (size / 2)){
        if(clientTwo.y - (size / 2) < clientOne.y + (size / 2) && clientTwo.y + (size / 2) > clientOne.y - (size / 2)){
          	return true;
    	}
  	}
  	return false;
}

function getStartPosition(){
	return { x: Math.random()*1000-500, y: Math.random()*1000-500};
}

function setupAnimal(client){
	if(numberOfLions == numberOfAntilopes){
		//Randomize!
		var randomNumber = Math.random();
		if(randomNumber < 0.5){
			//Lion!
			client.animal = LION_ID;
			numberOfLions++;
		}else{
			//Antilope!
			client.animal = ANTILOPE_ID;
			numberOfAntilopes++;
		}
	}else if(numberOfLions < numberOfAntilopes){
		//Lion!
		client.animal = LION_ID;
		numberOfLions++;
	}else if(numberOfLions > numberOfAntilopes){
		//Antilope!
		client.animal = ANTILOPE_ID;
		numberOfAntilopes++;
	}

	var startPosition = getStartPosition();
	console.log('Start position ' + startPosition.x + ' ' + startPosition.y);
	client.x = startPosition.x;
	client.y = startPosition.y;
	client.alive = true;
	client.id = id;
	id++;

	client.timestamp = new Date().getTime();

	var msg = { id: client.id, aid: client.animal, x: client.x, y: client.y }
	sendDataToSocket(client.socket, 'setup', msg);
}