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

function createSpriteSheet(){
	/*
	//example code:
	spritesheet = new createjs.SpriteSheet({
      // image to use
      images: [image], 
      // width, height & registration point of each sprite
      frames: {width: 40, height: 64, regX: 20, regY: 32}, 
      animations: {    
          walk: [0, 7, "walk", 10],
          attack: [8, 15, "attack", 5],
          idle: [16, 17, "idle", 50],
          die: [24, 31, "die", 10],
          water: [32, 33, "water", 30]
      }
  });

  //example usage:
  spritesheet.img.gotoAndPlay("attack");
  
	*/
}