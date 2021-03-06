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
var lionSpriteSheetImageColor;
var antilopeSpriteSheetImageColor;
var objectsSpriteSheetImageColor;
var grassImage;
var logoImage;
var pressanyImage;
var treeImage;

var numberOfImages = 0;
var loaded = 0;

var lionSpriteSheet;
var antilopeSpriteSheet;
var objectsSpriteSheet;
var lionSpriteSheetColor;
var antilopeSpriteSheetColor;
var objectsSpriteSheetColor;

var playerSprite;

var newLionSprite;
var newAntilopeSprite;
var newObjectSprite;

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

var fed;

var players = {};

//Rendering
var backgroundContainer;
var backgroundObjects;
var playerContainer;
var myplayerContainer;
var objectContainer;
var guiContainer;

var ingame = false;
var timeloaded;


//Control
var mouseIsDown = false;

var map;
$.getJSON( "map.json", function( json ) {
	console.log('json done');
   	map = json;
   	loadMap();
});

$(document).ready(function(){
	
	canvas = document.getElementById('gamescreen');
	canvasContext = canvas.getContext("2d");
	canvasStage = new createjs.Stage(document.getElementById("gamescreen"));

	setup();
	
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

	socket.on('setup', function(data) {
	  	console.log(data);
		animalID = data.aid;
		ID = data.id;
		x = data.x;
		y = data.y;
		console.log('Setting start pos ' + x + ' ' + y);
		vx = data.vx;
		vy = data.vy;
		
		selectSpriteSheets();

		resetCamera(x, y);
	}.bind(this));
	
	socket.on('die', function(data) {
	  	//console.log('Data: ' + data);
		die(data);
	}.bind(this));
	
	socket.on('feed', function(data) {
	  	//console.log('Data: ' + data);
		feed(data);
	}.bind(this));
	
	socket.on('mate', function(data) {
	  	//console.log('Data: ' + data);
		mate(data);
	}.bind(this));
	
	socket.on('u', function(data) {
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
	backgroundObjects = new createjs.Container();
	canvasStage.addChild(backgroundObjects);
	playerContainer = new createjs.Container();
	canvasStage.addChild(playerContainer);
	myplayerContainer = new createjs.Container();
	canvasStage.addChild(myplayerContainer);
	objectContainer = new createjs.Container();
	canvasStage.addChild(objectContainer);
 	guiContainer = new createjs.Container();
 	canvasStage.addChild(guiContainer);

	loadImages();
	
	$(document).bind('mousedown', function mouseDown(evt){
		mouseIsDown = true;
		console.log("Mouse down " + evt);
	}, false);
	
	$(document).bind('mouseup', function mouseUp(evt){
		mouseIsDown = false;
		sendDataToServer("v", {vx:0, vy:0});
		console.log("Mouse up " + evt);
	}, false);
	
	$(document).bind('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        if(mouseIsDown) {
			var deltaX = mousePos.x - canvas.width/2;
			var deltaY = mousePos.y - canvas.height/2;
			
			var len = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
			
			deltaX = deltaX/len;
			deltaY = deltaY/len;
			
			var speedVect = {};
			
			speedVect.vx = deltaX;
			speedVect.vy = deltaY;
		
			sendDataToServer("v", speedVect);
		}
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
	//updateLocal();
    // update the stage:
    canvasStage.update();
}

function loadImages(){
	lionSpriteSheetImage = new Image();
	lionSpriteSheetImage.src = 'lion_bw.png';
	numberOfImages++;
	lionSpriteSheetImage.onload = function() {
    	preloadStatus();
  	};
	
	lionSpriteSheetImageColor = new Image();
	lionSpriteSheetImageColor.src = 'lion.png';
	numberOfImages++;
	lionSpriteSheetImageColor.onload = function() {
    	preloadStatus();
  	};

  	antilopeSpriteSheetImage = new Image();
	antilopeSpriteSheetImage.src = 'antilope_bw.png';
	numberOfImages++;
	antilopeSpriteSheetImage.onload = function() {
    	preloadStatus();
  	};

  	antilopeSpriteSheetImageColor = new Image();
	antilopeSpriteSheetImageColor.src = 'antilope.png';
	numberOfImages++;
	antilopeSpriteSheetImageColor.onload = function() {
    	preloadStatus();
  	};
	
  	objectsSpriteSheetImage = new Image();
	objectsSpriteSheetImage.src = 'objects_bw.png';
	numberOfImages++;
	objectsSpriteSheetImage.onload = function() {
    	preloadStatus();
  	};
	
  	objectsSpriteSheetImageColor = new Image();
	objectsSpriteSheetImageColor.src = 'objects.png';
	numberOfImages++;
	objectsSpriteSheetImageColor.onload = function() {
    	preloadStatus();
  	};

  	logoImage = new Image();
	logoImage.src = 'logo.png';
	numberOfImages++;
	logoImage.onload = function() {
    	preloadStatus();
  	};

  	pressanyImage = new Image();
	pressanyImage.src = 'pressanykey.png';
	numberOfImages++;
	pressanyImage.onload = function() {
    	preloadStatus();
  	};
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
	lionSpriteSheet = new createjs.SpriteSheet({
      // image to use
      images: [lionSpriteSheetImage], 
      // width, height & registration point of each sprite
      frames: {width: 128, height: 128, regX: 64, regY: 64}, 
      animations: {    
          left: [0, 3, "left", 3],
          right: [4, 7, "right", 3],
          up: [8, 11, "up", 3],
          down: [12, 15, "down", 3],
		  death: [16, 19, "death", 3]
		}
	});
	lionSpriteSheetColor = new createjs.SpriteSheet({
      // image to use
      images: [lionSpriteSheetImageColor], 
      // width, height & registration point of each sprite
      frames: {width: 128, height: 128, regX: 64, regY: 64}, 
      animations: {    
          left: [0, 3, "left", 3],
          right: [4, 7, "right", 3],
          up: [8, 11, "up", 3],
          down: [12, 15, "down", 3],
		  death: [16, 19, "death", 3]
    }
  });
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
          left: [0, 3, "left", 3],
          right: [4, 7, "right", 3],
          up: [8, 11, "up", 3],
          down: [12, 15, "down", 3],
		  death: [16, 19, "death", 3]
    }
	});
	
	antilopeSpriteSheetColor = new createjs.SpriteSheet({
		// image to use
		images: [antilopeSpriteSheetImageColor], 
		// width, height & registration point of each sprite
		frames: {width: 128, height: 128, regX: 64, regY: 64}, 
		animations: {    
		left: [0, 3, "left", 3],
		right: [4, 7, "right", 3],
		up: [8, 11, "up", 3],
		down: [12, 15, "down", 3],
		  death: [16, 19, "death", 3]
  }
  });
  //antilopeSpriteSheet.img.gotoAndPlay("attack");
}

function createObjectsSpriteSheet(){
	objectsSpriteSheet = new createjs.SpriteSheet({
      images: [objectsSpriteSheetImage], 
      frames: [
      	[0,0,256,256, 0,128,128],
		[384,128, 128, 128, 0, 64, 64],
		[256,128, 128, 128, 0, 64, 64]
      ],
      animations: {
      	tree: [0, 0, "tree", 30],
		blood: [1,1, "blood", 30],
		bush: [2,2, "bush", 30]
      }
	});
	
	objectsSpriteSheetColor = new createjs.SpriteSheet({
      images: [objectsSpriteSheetImageColor], 
      frames: [
      	[0,0,256,256, 0,128,128],
		[384,128, 128, 128, 0, 64, 64],
		[256,128, 128, 128, 0, 64, 64]
      ],
      animations: {
      	tree: [0, 0, "tree", 30],
		blood: [1,1, "blood", 30],
		bush: [2,2, "bush", 30]
      }
  });
}

function createSprite(spriteSheet){
 
  return new createjs.BitmapAnimation(spriteSheet);
 
}

function createBackground(){
	//g.beginFill(createjs.Graphics.getRGB(224,195,29));
	
	var shape = new createjs.Shape();
	shape.graphics.beginFill("#E7E7E7").drawRect(0, 0, canvas.width, canvas.height);
	
	//background = new createjs.Rectangle(0, 0, canvas.width, canvas.height);
	backgroundContainer.addChild(shape);
}

function loadMap(){
	for(var i = 0; i < map.length; i++){
		var def = map[i];
		if(def){
			var tree = new createjs.BitmapAnimation(objectsSpriteSheet);
			tree.gotoAndPlay(def.type);
			tree.x = def.x;
			tree.y = def.y;
			if (def.type !== "bush"){
				objectContainer.addChild(tree);
			}else{
				backgroundObjects.addChild(tree);
				console.log(tree.x + " " + tree.y);
			}	
		}
	}
}

function createLogo(){
	var bitmap = new createjs.Bitmap(logoImage);
	bitmap.x = 400 - 512/2;
	bitmap.y = 240 - 512/2 - 30;
	guiContainer.addChild(bitmap);

	var imgaa = new Image(objectsSpriteSheet.getFrame(0).img);
	var pressany = new createjs.Bitmap(imgaa);
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
		sprite = createSprite(lionSpriteSheetColor);
	}else{
		sprite = createSprite(antilopeSpriteSheetColor);
	}
	
	if (player.id == ID) {
	
		player.posX = player.x;
		player.posY = player.y;
		sprite.x = canvas.width/2;
		sprite.y = canvas.height/2;
		
		sprite.scaleX = scale;
		sprite.scaleY = scale;
		
		sprite.gotoAndPlay("run");
		
		player.sprite = sprite;
	
		playerSprite = sprite;
		myplayerContainer.addChild(sprite);
	}
	else{

		player.posX = player.x;
		player.posY = player.y;

		sprite.x = relativeX(player.posX);
		sprite.y = relativeY(player.posY);
		
		sprite.scaleX = scale;
		sprite.scaleY = scale;
		
		sprite.gotoAndPlay("run");
		
		player.sprite = sprite;
		playerContainer.addChild(sprite);
	
	}
}

function die(data){
	var player = players[data.id];
	if(player){
	
		player.sprite.gotoAndPlay("death");
		player.sprite.gotoAndStop(19);
		player.vx = 0;
		player.vy = 0;

		if(data.id == ID){
			console.log('We died :(');
			
			
			
			
			ingame = false;
			showLogo(true);
		}
		//Create bloodstain.
		var bloodSprite = createSprite(objectsSpriteSheet);
		var x = -backgroundObjects.x + canvas.width/2;
		var y = -backgroundObjects.y + canvas.height/2;
		bloodSprite.x = x;
		bloodSprite.y = y;
		bloodSprite.gotoAndPlay("blood");
		backgroundObjects.addChild(bloodSprite);
		//myplayerContainer.removeChild(player.sprite);
		
	}
}

function feed(data){
	var player = players[data.id];
	if(player){
		player.feed = true;

		if(data.id == ID){
			console.log('We ate! :)');	
		}
	}
}

function mate(data){
	var player = players[data.id];
	if(player){
		player.mated = true;

		if(data.id == ID){
			console.log('We mated! :)');	
		}
	}
}

function updatePlayer(data){
	var id = data.id;
	
	if (!players[id]){
	
		var player = {
			id: data.id,
			animal: data.animal,
			x: data.x,
			y: data.y, 
			vx: 0,
			vy: 0
			
		}
		players[player.id] = player;
		createPlayer(player);
	}
	/*
	var localPosX = players[id].x;
	var localPosY = players[id].y;
	
	var diffX = localPosX - relativeX(data.x);
	var diffY = localPosY - relativeY(data.y);
	
	var catchUpX = diffX/3;
	var catchUpY = diffY/3;
	*/
	//console.log("data.vx " + data.vx + " " + "data.vy" + data.vy + " catchUpX " + catchUpX + " catchUpY " + catchUpY);
	
	players[id].vx = data.vx;
	players[id].vy = data.vy;
	
	
	players[id].x = data.x;
	players[id].y = data.y;
	
	//Update sprite position.
	players[id].sprite.x = relativeX(players[id].x);
	players[id].sprite.y = relativeY(players[id].y);
	
	if(id == ID){
		x = data.x;
		y = data.y;
		resetCamera(x, y);
		//console.log('Updating pos ' + x + ' ' + y);
		players[id].sprite.x = 400;//canvas.width/2;
		players[id].sprite.y = 240;//canvas.heigth/2;
	}
	
	console.log('Updating pos ' + data.x + ' ' + data.y);
	
}

function update(data){
	for(var i = 0; i < data.length;i++){
		var player = data[i];
		if (player) {
			updatePlayer(player);
		}
	}
}

function animate(player){
	var vx = player.vx;
	var vy = player.vy;
	if(Math.abs(vx) > Math.abs(vy)){
			if(vx > 0){
				if(player.sprite.currentAnimation !== 'right'){
					player.sprite.gotoAndPlay('right');
				}
			}else{
				if(player.sprite.currentAnimation !== 'left'){
					player.sprite.gotoAndPlay('left');
				}
			}
		}else{
			if(vy > 0){
				if(player.sprite.currentAnimation !== 'down'){
					player.sprite.gotoAndPlay('down');
				}
				
			}else{
				if(player.sprite.currentAnimation !== 'up'){
					player.sprite.gotoAndPlay('up');
				}
				
			}
		}
}

function selectSpriteSheets(){
	if(animalID == LIONID){
		newLionSprite = function() { return createSprite(lionSpriteSheetColor);};
		newAntilopeSprite = function() { return createSprite(antilopeSpriteSheetColor);};
		newObjectSprite = function() { return createSprite(objectSpriteSheet);};
	}
	else{
		newLionSprite = function() { return createSprite(lionSpriteSheet);};
		newAntilopeSprite = function() { return createSprite(antilopeSpriteSheetColor);};
		newObjectSprite = function() {return createSprite(objectSpriteSheetColor);};
	}
}

function updateLocal(){
	var myplayer = players[ID];
	var vx = 0;
	var vy = 0;

	if (myplayer) {
		vx = myplayer.vx;
		vy = myplayer.vy;
		animate(myplayer);
		x = x + myplayer.vx*10;
		y = y + myplayer.vy*10;
		//console.log('new xy '+ x + ' ' + y);
		//myplayer.sprite.x = 400;//canvas.width/2;
		//myplayer.sprite.y = 240;//canvas.heigth/2;
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
				player.x += (player.vx*10);
				player.y += (player.vy*10);
				animate(player);
				player.sprite.x = player.x;
				player.sprite.y = player.y;
			}
		}
	}
	
	resetCamera(x, y);
}

function relativeX(otherX){
	return canvas.width/2 + (otherX - x);
}

function relativeY(otherY){
	return canvas.height/2 + (otherY - y);
}

function resetCamera(x, y){

	backgroundObjects.x = -x + canvas.width/2;
	backgroundObjects.y = -y + canvas.height/2;
	
	playerContainer.x = -x + canvas.width/2;
	playerContainer.y = -y + canvas.height/2;
	
	objectContainer.x = -x + canvas.width/2;
	objectContainer.y = -y + canvas.height/2;
}