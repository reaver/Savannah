var socket;

var canvas;
var canvasContext;
var canvasStage;

//SpriteSheets
var lionSpriteSheet;
var antilopeSpriteSheet;

//SpriteSheet controlls.
var animalID;

$(document).ready(function(){
	var connectTo = 'http://'+location.host.substring(0,location.host.indexOf(':'));
	console.log('Connecting to ' + connectTo);
	socket = io.connect(connectTo);

	socket.on("animalID", function(data) {
	  	console.log('Data: ' + data);
		animalID = data;
	}.bind(this));
	
	socket.on("die", function(data) {
	  	console.log('Data: ' + data);
	}.bind(this));
	
	canvas = document.getElementById('gamescreen');
	canvasContext = canvas.getContext("2d");
	canvasStage = new createjs.Stage(document.getElementById("gamescreen"));

	renderBackground();
	loadImages();
});

function sendDataToServer(trigger, data){
	socket.emit(trigger, data);
}

function loadImages(){
	lionSpriteSheet = new Image();
	lionSpriteSheet.src = 'lion.png';
	antilopeSpriteSheet = new Image();
	antilopeSpriteSheet.src = 'antilope.png';
	//lionSpriteSheet.image.onload = function(){
    //	console.log('Loaded lionSpriteSheet');
  	//}
}

function renderBackground(){
	var color = "#E0C31D";
	canvasContext.fillStyle=color;
	canvasContext.fillRect(0,0,canvas.width,canvas.height);
}

function renderPlayer(spriteID){
	var x = canvas.width/2 - lionSpriteSheet.width/2;
	var y = canvas.height/2 - lionSpriteSheet.height/2;	
	
}

function render(){
	renderBackground();
	renderPlayer(animalID);
}