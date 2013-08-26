var socket;
var g;

var LIONID = 0;
var ANTILOPEID = 1;

var canvas;
var canvasContext;
var canvasStage;

//Images
var lionSpriteSheetImage;
var antilopeSpriteSheetImage;
var objectsSpriteSheetImage;
var grassImage;
var logoImage;
var pressanyImage;
var treeImage;

var numberOfImages = 0;
var loaded = 0;

var lionSpriteSheet;
var antilopeSpriteSheet;
var objectsSpriteSheet;

var playerSprite;

var bmpLionAnimation;
var bmpAntilopeAnimation;

//SpriteSheet controlls.
var imageSize = 128;
var scale = 0.5;

//Game variables.
var animalID;
var x = 0;
var y = 0;
var ID;
var vx;
var vy;

var players = {};

//Rendering
var backgroundContainer;
var playerContainer;
var guiContainer;

var ingame = false;
var timeloaded;

$(document).ready(function(){
	
	canvas = document.getElementById('gamescreen');
	canvasContext = canvas.getContext("2d");
	canvasStage = new createjs.Stage(document.getElementById("gamescreen"));

	setup();
	console.log('setup done');
	
	$(document).bind('keyup',function(e){
        //console.log('Time ' + timeloaded + "/" + (new Date().getTime()) + " = " + ());
        if(!ingame && (new Date().getTime() - timeloaded) > 1000){
        	console.log('sending spawn message');
        	ingame = true;
        	showLogo(false);
        	sendDataToServer('spawn', '');
        }
    })

});

function connect(){
	var connectTo = 'http://'+location.host.substring(0,location.host.indexOf(':'));
	console.log('Connecting to ' + connectTo);

	socket = io.connect(connectTo);

	socket.on("setup", function(data) {
	  	console.log(data);
		animalID = data.aid;
		ID = data.id;
		x = data.x;
		y = data.y;
		vx = data.vx;
		vy = data.vy;
	}.bind(this));
	
	socket.on("die", function(data) {
	  	console.log('Data: ' + data);
		die(data);
	}.bind(this));
	
	socket.on("u", function(data) {
		update(data);
	}.bind(this));
}

function sendDataToServer(trigger, data){
	socket.emit(trigger, data);
}

function setup(){
	g = new createjs.Graphics();

	backgroundContainer = new createjs.Container();
	canvasStage.addChild(backgroundContainer);
	playerContainer = new createjs.Container();
	canvasStage.addChild(playerContainer);
 	guiContainer = new createjs.Container();
 	canvasStage.addChild(guiContainer);

	loadImages();
	
	canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        
		var deltaX = mousePos.x - canvas.width/2;
		var deltaY = mousePos.y - canvas.height/2;
		
		var len = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
		
		deltaX = deltaX/len;
		deltaY = deltaY/len;
		
		var speedVect = {};
		
		speedVect.vx = -deltaX;
		speedVect.vy = -deltaY;
	
		sendDataToServer("v", speedVect);
		
    }, false);
    
	
	//createPlayer();
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}

function setupAnimations(){

	createjs.Ticker.addListener(window);
	createjs.Ticker.useRAF = true;
	// Best Framerate targeted (60 FPS)
	createjs.Ticker.setFPS(30);
}

function tick() {
	//render();
	//renderPlayer();
	updateLocal();
    // update the stage:
    canvasStage.update();
}

function loadImages(){
	lionSpriteSheetImage = new Image();
	lionSpriteSheetImage.src = 'lion.png';
	numberOfImages++;
	lionSpriteSheetImage.onload = function() {
    	console.log(lionSpriteSheetImage);
    	preloadStatus();
  	};

  	antilopeSpriteSheetImage = new Image();
	antilopeSpriteSheetImage.src = 'antilope.png';
	numberOfImages++;
	antilopeSpriteSheetImage.onload = function() {
    	console.log(lionSpriteSheetImage);
    	preloadStatus();
  	};

  	objectsSpriteSheetImage = new Image();
	objectsSpriteSheetImage.src = 'objects.png';
	numberOfImages++;
	objectsSpriteSheetImage.onload = function() {
    	console.log(objectsSpriteSheetImage);
    	preloadStatus();
  	};

  	logoImage = new Image();
	logoImage.src = 'logo.png';
	numberOfImages++;
	logoImage.onload = function() {
    	console.log(logoImage);
    	preloadStatus();
  	};

  	pressanyImage = new Image();
	pressanyImage.src = 'pressanykey.png';
	numberOfImages++;
	pressanyImage.onload = function() {
    	console.log(pressanyImage);
    	preloadStatus();
  	};
}

function loadImage(img, source){
	console.log('loading ' + source);
	img = new Image();
	img.src = source;
	numberOfImages++;
	img.onload = function() {
    	console.log(img);
    	preloadStatus();
  	};
	return img;
}

function preloadStatus(){
	loaded++;
	console.log('done loading image ' + loaded + '/' + numberOfImages);
	if(loaded == numberOfImages){
		console.log('Done loading!');
		createSpriteSheets();
		createBackground();
		createLogo();
		
		setupAnimations();
		timeloaded = new Date().getTime();
		connect();
	}
}

function createSpriteSheets(){
	createLionSpriteSheet();
	createAntilopeSpriteSheet();
	createObjectsSpriteSheet();
}

function createLionSpriteSheet(){
	//example code:
	console.log('lion pre');
	lionSpriteSheet = new createjs.SpriteSheet({
      // image to use
      images: [lionSpriteSheetImage], 
      // width, height & registration point of each sprite
      frames: {width: 128, height: 128, regX: 64, regY: 64}, 
      animations: {    
          left: [0, 3, "left", 3],
          right: [4, 7, "right", 3],
          up: [8, 11, "up", 3],
          down: [12, 15, "down", 3]
          //water: [32, 33, "water", 30]
      }
  });
  console.log('lion post');
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
  //antilopeSpriteSheet.img.gotoAndPlay("attack");
}

function createObjectsSpriteSheet(){
	console.log('Creating objects ss');
	objectsSpriteSheet = new createjs.SpriteSheet({
      images: [objectsSpriteSheetImage], 
      frames: [
      	[0,0,256,256,128,128]
      ],
      animations: {}
  });
}

function createSprite(spriteSheet){
 
  return new createjs.BitmapAnimation(spriteSheet);
 
}

function createBackground(){
	//g.beginFill(createjs.Graphics.getRGB(224,195,29));
	
	var shape = new createjs.Shape();
	shape.graphics.beginFill("#E0C31D").drawRect(0, 0, canvas.width, canvas.height);
	
	//background = new createjs.Rectangle(0, 0, canvas.width, canvas.height);
	backgroundContainer.addChild(shape);

	treeImage = objectsSpriteSheet.getFrame(0);
	//backgroundContainer.addChild(treeImage);
}

function createLogo(){
	var bitmap = new createjs.Bitmap(logoImage);
	bitmap.x = 400 - 512/2;
	bitmap.y = 240 - 512/2 - 30;
	guiContainer.addChild(bitmap);
	var frame = objectsSpriteSheet.getFrame(0);
	console.log(frame);
	var pressany = new createjs.Bitmap(pressanyImage);
	pressany.x = 400 - 256/2;
	pressany.y = 240 - 256/2 + 175;
	pressany.alpha = 0;
	guiContainer.addChild(pressany);

	setTimeout(function() {
    	fade(pressany, 0, true, true);
	}, 25);
}

function showLogo(show){
	guiContainer.visible = show;
}

function fade(image, value, fadeIn, loop){
	image.alpha = value;
	var done = false;
	if(fadeIn){
		value += 1/30;
		if(value >= 1){
			fadeIn = false;
			done = true;
		}
	}else{
		value -= 1/30;
		if(value <= 0){
			fadeIn = true;
			done = true;
		}
	}
	if(!done || loop){
		setTimeout(function() {
	    	fade(image, value, fadeIn, loop);
		}, 25);
	}
}

function createPlayer(player){
	//var x = canvas.width/2;
	//var y = canvas.height/2;
	
	var sprite;
	
	if (player.animal == LIONID) {
		sprite = createSprite(lionSpriteSheet);
	}else{
		sprite = createSprite(antilopeSpriteSheet);
	}
	
	if (player.id == ID) {
	
		var x = canvas.width/2;
		var y = canvas.height/2;
		
		sprite.x = x;
		sprite.y = y;
	
		playerSprite = sprite;
	}
	else{
		sprite.x = player.x;
		sprite.y = player.y;
	}
	sprite.scaleX = scale;
	sprite.scaleY = scale;
	
	sprite.gotoAndPlay("run")
	
	player.sprite = sprite;
	
	playerContainer.addChild(sprite);
}

function die(data){
	var player = players[data.id];
	if(player){
		player.vx = 0;
		player.vy = 0;

		if(data.id == ID){
			console.log('We died :(');
			ingame = false;
			showLogo(true);
		}
	}
}

function updatePlayer(data){
	var id = data.id;
	
	if (!players[id]){
	
		var player = {
			id:data.id,
			animal:data.animal,
			x:relativeX(data.x),
			y:relativeY(data.y)
		}
		players[player.id] = player;
		createPlayer(player);
	}
	
	players[id].sprite.x = relativeX(data.x);
	players[id].sprite.y = relativeY(data.y);
	players[id].vx = data.vx;
	players[id].vy = data.vy;
	
	if(id == ID){
		x = data.x;
		y = data.y;
		players[id].sprite.x = 400;//canvas.width/2;
		players[id].sprite.y = 240;//canvas.heigth/2;
	}
	
}

function update(data){
	for(var i = 0; i < data.length;i++){
		var player = data[i];
		if (player) {
			updatePlayer(player);
		}
	}
}

function updateLocal(){
	var myplayer = players[ID];
	if (myplayer) {
		var vx = myplayer.vx;
		var vy = myplayer.vy;
		if(Math.abs(vx) > Math.abs(vy)){
			if(vx > 0){
				if(myplayer.sprite.currentAnimation !== 'left'){
					myplayer.sprite.gotoAndPlay('left');
				}
			}else{
				if(myplayer.sprite.currentAnimation !== 'right'){
					myplayer.sprite.gotoAndPlay('right');
				}
			}
		}else{
			if(vy > 0){
				if(myplayer.sprite.currentAnimation !== 'up'){
					myplayer.sprite.gotoAndPlay('up');
				}
				
			}else{
				if(myplayer.sprite.currentAnimation !== 'down'){
					myplayer.sprite.gotoAndPlay('down');
				}
				
			}
		}
		//x = x + myplayer.vx*10;
		//y = y + myplayer.vy*10;
		
		//myplayer.sprite.x = 400;//canvas.width/2;
		//myplayer.sprite.y = 240;//canvas.heigth/2;
	}else{
		return;
	}
	//console.log('player speed ' + myplayer.vx + ' ' + myplayer.vy);
	for(var key in players){
		var player = players[key];
		if (player) {
			if(player.id != ID){
				/*
				var absoluteX = (x + player.sprite.x) + player.vx*10;
				var absoluteY = (y + player.sprite.y) + player.vy*10;
				player.sprite.x = relativeX(absoluteX);
				player.sprite.y = relativeY(absoluteY);	
				*/
				player.sprite.x += myplayer.vx*10;
				player.sprite.y += myplayer.vy*10;
			}
		}
	}
}

function relativeX(otherX){
	return canvas.width/2 + (x - otherX);
}

function relativeY(otherY){
	return canvas.height/2 + (y - otherY);
}