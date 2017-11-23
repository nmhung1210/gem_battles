import ui.View;
import ui.ImageScaleView as ImageScaleView;

import event.input.drag as drag;
import src.objects.Gem as Gem;
import src.objects.Board as Board;
import src.objects.IngameMenu as IngameMenu;

import src.sounds.SoundManager as SoundMgr;

import src.common.define as DEF;

exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    {
        supr(this, 'init', [opts]);                        
        var app = opts.app;
        var screenWidth = app.screenWidth();
        var screenHeight = app.screenHeight();        
		var mthis = this;

		var scale = screenWidth / 576;
		      
        var mainFrame = new ImageScaleView({
            superview: this,
            x: screenWidth/2-576*scale/2,
			y: screenHeight/2-1024*scale/2,
			scale:scale,
            width: 576,
			height: 1024,
			renderCenter:true,
            image: "resources/images/ui/background.png"
		});

		

		var ingameMenu = new IngameMenu({
			superview:mainFrame,
			x:0,
			y:0,
			width: 576,
			height: 1024
		});

		this._board = new Board({
			superview: mainFrame,
            x: 30,
			y: 320,
			width: 520,
			height: 520,
			cols:5,
			rows:5
		});

		

		ingameMenu.on(DEF.EVENT_MENU_BACK,function(){
			mthis.emit(DEF.EVENT_MENU_BACK);
		});

		ingameMenu.on(DEF.EVENT_MENU_RESET,function(){
			mthis._board.resetBoard();
		});
	};     
	
	this.startLevel = function(level)
	{
		this._board.resetBoard();
		SoundMgr.getSound().play("background");
	}
});
