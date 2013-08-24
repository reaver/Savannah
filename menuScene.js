var menuLayer = cc.Layer.extend({
    init:function()
    {
        this._super();

        var s = cc.Director.getInstance().getWinSize();

        var layer1 = cc.LayerColor.create(new cc.Color4B(212, 172, 40, 255), s.width, s.height);
        layer1.setAnchorPoint(new cc.Point(0.5,0.5));

        
        var savannahLabel = cc.LabelTTF.create("Welcome to the Savannah", "Arial", 30);
        savannahLabel.setPosition(new cc.Point(s.width/2,s.height - s.height/5));
        savannahLabel.setColor(new cc.Color3B(0,0,0));

		
		var playButton = new cc.MenuItemFont.create("Start life",this.play,this);
		playButton.setPosition(new cc.Point(0,0));
		
		
		var menu = new cc.Menu.create(playButton);
		menu.setPosition(new cc.Point(s.width/2,s.height/4));
		
        layer1.addChild(savannahLabel);
		layer1.addChild(menu);
        this.addChild(layer1);

        
        return true;
    },
	
	play:function()
	{
		cc.log("Play button pressed")
		var scene = cc.Scene.create();
        scene.addChild(gameLayer.create());
        //scene.addChild(GameControlMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
	}
	

});

var startScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new menuLayer();
        layer.init();
        this.addChild(layer);
    }
})