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