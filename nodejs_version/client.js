var socket;

var canvas;
var canvasContext;
var canvasStage;
var lionSpriteSheet;

$(document).ready(function(){
	var connectTo = 'http://'+location.host.substring(0,location.host.indexOf(':'));
	console.log('Connecting to ' + connectTo);
	socket = io.connect(connectTo);

	canvas = document.getElementById('gamescreen');
	canvasContext = canvas.getContext("2d");
	canvasStage = new createjs.Stage(document.getElementById("gamescreen"));

	loadImages();
});

function sendDataToServer(trigger, data){
	socket.emit(trigger, data);
}

function loadImages(){
	lionSpriteSheet = new Image();
	lionSpriteSheet.src = 'lion.png';
	lionSpriteSheet.image.onload = function(){
    	console.log('Loaded lionSpriteSheet');
  	}
}