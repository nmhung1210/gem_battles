//sdk imports
import device;
import ui.StackView as StackView;
import ui.TextView as TextView;
import src.screens.LoadingScreen as LoadingScreen;
import src.screens.SplashScreen as SplashScreen;
import src.screens.LevelSelectScreen as LevelSelect;
import src.screens.GameScreen as GameScreen;
import src.common.define as DEF;
/* Your application inherits from GC.Application, which is
 * exported and instantiated when the game is run.
 */
exports = Class(GC.Application, function () {

	/* Run after the engine is created and the scene graph is in
	 * place, but before the resources have been loaded.
	 */
	this.initUI = function () {
		this.view.style.background = '#000000';
		
		// iPhone 4 screen as base
		this.scaleRatio = device.width / 480;      
		this.rootView = new StackView({
			superview: this,
			app:this,
			x: 0,
			y: 0,
			width: 480,
			height: device.screen.height / this.scaleRatio,
			clip: true,
			scale: this.scaleRatio,
		});

		this.screens = {
			loading:new LoadingScreen({app:this}),
			splash:new SplashScreen({app:this}),
			levelSelect:new LevelSelect({app:this}),
			game: new GameScreen({app:this})
		};
		
		this.rootView.push(this.screens.loading);
		this.handleScreenEvents();		
	};

	this.handleScreenEvents = function()
	{
		var mthis = this;
		this.screens.loading.on(DEF.EVENT_LOADING_COMPLETE,function(){
			mthis.rootView.push(mthis.screens.splash,true);
		});

		this.screens.splash.on(DEF.EVENT_GAME_START,function(){
			mthis.rootView.push(mthis.screens.levelSelect);
		});

		this.screens.levelSelect.on(DEF.EVENT_LEVEL_SELECTED,function(level){
			mthis.rootView.push(mthis.screens.game);
			mthis.screens.game.startLevel(level);
		});
	}

	this.screenWidth = function()
	{
		return this.rootView.style.width;
	}

	this.screenHeight = function()
	{
		return this.rootView.style.height;
	}

	/* Executed after the asset resources have been loaded.
	 * If there is a splash screen, it's removed.
	 */
	this.launchUI = function () {};
});
