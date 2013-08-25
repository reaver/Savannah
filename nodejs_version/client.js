var socket;
var g;

var canvas;
var canvasContext;
var canvasStage;

//SpriteSheets
var lionSpriteSheetImage;
var antilopeSpriteSheetImage;
var treeImage;
var grassImage;

var lionSpriteSheet;
var antilopeSpriteSheet;

var playerSprite;

var bmpLionAnimation;
var bmpAntilopeAnimation;

//SpriteSheet controlls.
var imageSize = 128;
var scale = 0.5;

//Game variables.
var animalID;
var x;
var y;
var ID;
var playerSpeed;

var players = {};

//Rendering
var background;
var playerContainer;
var mapContainer;

$(document).ready(function(){
	var connectTo = 'http://'+location.host.substring(0,location.host.indexOf(':'));
	console.log('Connecting to ' + connectTo);
	socket = io.connect(connectTo);

	socket.on("setup", function(data) {
	  	console.log('Data: ' + data);
		animalID = data.aid;
		ID = data.id;
		x = data.x;
		y = data.y;
		createPlayer();
	}.bind(this));
	
	socket.on("die", function(data) {
	  	console.log('Data: ' + data);
	}.bind(this));
	
	socket.on("u", function(data) {
	  	console.log('Data: ' + data);
		update(data);
	}.bind(this));
	
	canvas = document.getElementById('gamescreen');
	canvasContext = canvas.getContext("2d");
	canvasStage = new createjs.Stage(document.getElementById("gamescreen"));

	setup();
	render();
	
});

function sendDataToServer(trigger, data){
	socket.emit(trigger, data);
}

function setup(){
	g = new createjs.Graphics();
	loadImages();
	createBackground();
	createSpriteSheets(animalID);
	setupAnimations();
	
	//createPlayer();
}

function setupAnimations(){

	createjs.Ticker.addListener(window);
	createjs.Ticker.useRAF = true;
	// Best Framerate targeted (60 FPS)
	createjs.Ticker.setFPS(60);
}

function tick() {
	//render();
	//renderPlayer();
	updatePlayer();
    // update the stage:
    canvasStage.update();
}

function loadImages(){
	lionSpriteSheetImage = new Image();
	lionSpriteSheetImage.src = 'lion.png';
	antilopeSpriteSheetImage = new Image();
	antilopeSpriteSheetImage.src = 'antilope.png';
	//lionSpriteSheet.image.onload = function(){
    //	console.log('Loaded lionSpriteSheet');
  	//}
}

function createSpriteSheets(id){
	createLionSpriteSheet();
	createAntilopeSpriteSheet();
	
	if (id == 0) {
		playerSprite = bmpLionAnimation;
	}
	else {
		playerSprite = bmpAntilopeAnimation;
	}
}

function createLionSpriteSheet(){
	//example code:
	lionSpriteSheet = new createjs.SpriteSheet({
      // image to use
      images: [lionSpriteSheetImage], 
      // width, height & registration point of each sprite
      frames: {width: 128, height: 128, regX: 64, regY: 64}, 
      animations: {    
          run: [0, 0, "run", 10]
          //attack: [8, 15, "attack", 5],
          //idle: [16, 17, "idle", 50],
          //die: [24, 31, "die", 10],
          //water: [32, 33, "water", 30]
      }
  });
  
  bmpLionAnimation = new createjs.BitmapAnimation(lionSpriteSheet);
  
  //lionSpriteSheet.img.gotoAndPlay("attack");

}

function createAntilopeSpriteSheet(){
	//example code:
	antilopeSpriteSheet = new createjs.SpriteSheet({
      // image to use
      images: [antilopeSpriteSheetImage], 
      // width, height & registration point of each sprite
      frames: {width: 128, height: 128, regX: 64, regY: 64}, 
      animations: {    
          run: [0, 0, "run", 10]
          //attack: [8, 15, "attack", 5],
          //idle: [16, 17, "idle", 50],
          //die: [24, 31, "die", 10],
          //water: [32, 33, "water", 30]
      }
  });
  
  bmpAntilopeAnimation = new createjs.BitmapAnimation(antilopeSpriteSheet);
  
  //antilopeSpriteSheet.img.gotoAndPlay("attack");

}

function createBackground(){
	//g.beginFill(createjs.Graphics.getRGB(224,195,29));
	
	var shape = new createjs.Shape();
	shape.graphics.beginFill("#E0C31D").drawRect(0, 0, canvas.width, canvas.height);
	
	//background = new createjs.Rectangle(0, 0, canvas.width, canvas.height);
	canvasStage.addChild(shape);
}

function createPlayer(){
	var x = canvas.width/2;
	var y = canvas.height/2;	
	
	playerSprite.x = x;
	playerSprite.y = y;
	playerSprite.scaleX = scale;
	playerSprite.scaleY = scale;
	
	playerSprite.gotoAndPlay("run")
	
	canvasStage.addChild(playerSprite);
}

function updatePlayer(data){
	
	var id = data[0];
	
	if (!players[id]){
	
		var player = {
			id: data[0],
			animal: data[1],
			x = relativeX(data[2]),
			y = relativeY(data[3])
		}
		players[player.id] = player;
		createPlayer(player);
	}
	
	players[id].x = relativeX(data[2]);
	players[id].y = relativeY(data[3]);
	players[id].vx = data[4];
	players[id].vy = data[5];
	
}

function update(data){
	for(int i = 0; i<data.length;i++){
		var player = data[i];
		updatePlayer(player);
	}
}

function render(){
	//renderBackground();
}

function relativeX(otherX){
	return x - otherX;
}

function relativeY(otherY){
	return y - otherY;
}