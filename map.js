var map = cc.Layer.extend({
	
	grassTileProb:0.025,
	tiles:[],
	//Load map assets.
	ctor:function(width, height){
		
		for (var w=0;w<width;w++){
			for (var h=0;h<height;h++){
				var tile;
				if (Math.random()<grassTileProb){
					tile = new tile(2);
				}
				else {
					tile = new tile(1);
				}
				
				tile.setPosition(new cc.Point(w*tile.width,h*tile.height));
				
				tiles.push(tile)
				this.addChild(tile);
			}
		}
		
	}
	
});