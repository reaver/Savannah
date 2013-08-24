var tile = cc.Sprite.extend({
	width:50,
	height:50,
	//Load tile assets.
	ctor:function(id){
		tileSprite = tile.createTileSprite(id);
	}
	
});

tile.createTileSprite = function(id){
		if(id == 1){
			return new cc.Sprite(planeTile);
		}
		else {
			return new cc.Sprite(grassTile);
		}
}