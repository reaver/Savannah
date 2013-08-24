var backgroundLayer = cc.Layer.extend({
	init:function(){
		this._super();
		var s = cc.Director.getInstance().getWinSize();
		
		var layer = cc.LayerColor.create(new cc.Color4B(212, 172, 40, 255), s.width, s.height);
        layer.setAnchorPoint(new cc.Point(0.5,0.5));
		
		this.addChild(layer);
	
		return true;
	}
});

backgroundLayer.create = function() {
	var sg = new backgroundLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};


var gameLayer = cc.Layer.extend({
	init:function(){
		this._super();
		var s = cc.Director.getInstance().getWinSize();
		var background = backgroundLayer.create();
		
		
		this.addChild(background);
		
		
		return true;
	}
});

gameLayer.create = function() {
	var sg = new gameLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

gameLayer.scene = function() {
	var scene = cc.Scene.create();
    var layer = gameLayer.create();
    scene.addChild(layer, 1);
    return scene;
};

//var savannahScene = cc.Scene.extend({
//   onEnter:function(){
//		cc.log("Game Scene create")
//        this._super();
//        var layer = new gameLayer();
//        layer.init();
//        this.addChild(layer);
//   }
//})