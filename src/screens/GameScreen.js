import ui.View;
import ui.ImageScaleView as ImageScaleView;

import event.input.drag as drag;
import src.objects.Gem as Gem; 
import src.objects.Board as Board;
import src.objects.IngameMenu as IngameMenu;

import src.sounds.SoundManager as SoundMgr;
import src.particles.Flame as Flame;
import src.common.Define as DEF; 
import src.characters.NinjaGirl as NinjaGirl;
import src.characters.FreekNight as FreekNight;

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

		this._ingameMenu = new IngameMenu({
			superview:mainFrame,
			x:0,
			y:0,
			width: 576,
			height: 1024
		});

		this._freekNight = new FreekNight({
            superview: mainFrame,
            x:50,
			y:135,
			attackPos:{
				x:120,
				y:135,
			},
            width:140,
            height:168
        });       
        this._ninjaGirl = new NinjaGirl({
            superview: mainFrame,
            x:576-150,
			y:135,
			attackPos:{
				x:576-220,
				y:135,
			},
            flipX:true,
            width:140,
            height:168
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

		this._ingameMenu.on(DEF.EVENT_MENU_BACK,function(){
			mthis.emit(DEF.EVENT_MENU_BACK);
		});

		this._ingameMenu.on(DEF.EVENT_MENU_RESET,function(){
			mthis._board.resetBoard();
		});
 
		this._ingameMenu.on(DEF.EVENT_GAMEOVER,function(){
			mthis.emit(DEF.EVENT_GAMEOVER);
		});
		this._ingameMenu.on(DEF.EVENT_LEVELUP,function(){
			mthis.emit(DEF.EVENT_LEVELUP);
		});

		this._board.on(DEF.EVENT_SCORE,function(score, player){
			
			console.log(score, player);
			if(player=="user")
			{
				mthis._ingameMenu.addScore(score);
				mthis._freekNight.attack(mthis._ninjaGirl);
			}else{
				mthis._ingameMenu.addTargetScore(score);
				mthis._ninjaGirl.attack(mthis._freekNight);
			}
		});
	};     
	
	this.startLevel = function(level)
	{
		this._board.resetBoard(level);
		this._ingameMenu.setLevel(level);
		SoundMgr.getSound().play("background");
	}
});
