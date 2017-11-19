//sdk imports
import device;
import ui.StackView as StackView;
import ui.TextView as TextView;
import src.screens.SplashScreen as SplashScreen;
import src.screens.LevelSelect as LevelSelect;
import src.screens.GameScreen as GameScreen;

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
		var rootView = this.rootView = new StackView({
			superview: this,
			app:this,
			x: 0,
			y: 0,
			width: 480,
			height: device.screen.height / this.scaleRatio,
			clip: true,
			scale: this.scaleRatio,
		});

		var splashScreen = new SplashScreen({
			app:this,
			rootView:rootView
		});

		var levelSelect = new LevelSelect({
			app:this,
			rootView:rootView
		});

		var gameScreen = new GameScreen({
			app:this,
			rootView:rootView
		});

		rootView.push(splashScreen);

		splashScreen.on("splashscreen:start",function(){
			rootView.push(levelSelect);
		});

		levelSelect.on("levelselect:start",function(level){
			rootView.push(gameScreen);
			gameScreen.startLevel(level);
		});
		
	};

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
