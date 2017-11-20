import ui.View;
import ui.TextView as TextView;
import ui.ImageScaleView as ImageScaleView;
import ui.ImageView;
import ui.resource.loader as Loader;
import ui.widget.ButtonView as ButtonView;
import ui.SpriteView as SpriteView;

exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    {
        opts = merge(opts, {
            scaleMethod: 'cover',
            x: 0,
            y: 0,
                        
        });
        
        supr(this, 'init', [opts]);                
        var view = this;
        this.app = opts.app;
        this.rootView = opts.rootView;
        this.startLoader();
    };       

    this.startLoader = function()
    {
        var mthis = this;
        this.showLoading();
        Loader.preload(['resources/images/', 'resources/sound'], function() {
            mthis.hideLoading();
            mthis.initUI();
        }); 
    }
    
    this.showLoading = function()
    {
        var screenWidth = this.app.screenWidth();
        var screenHeight = this.app.screenHeight();
        this._loadingView = this._loadingView || new LoadingAnimation({
            superview: this,
            x: (screenWidth / 2 - 64),
            y: (screenHeight / 2 - 64),
            width: 128,
            height: 128,            
        });
        this._loadingView.show();
    }

    this.hideLoading = function()
    {
        this._loadingView && this._loadingView.hide();
    }
    
    this.initUI = function() {
        var screenWidth = this.app.screenWidth();
        var screenHeight = this.app.screenHeight();
        var mthis = this;

        var bg = new ImageScaleView({
            superview: this,
			scaleMethod: 'cover',
			layout: 'box',
			layoutWidth: '100%',
			layoutHeight: '100%',
            centerX: true,
            image:"resources/splash/splash.jpg"
        });

        var text = new TextView({
            superview: this,
            x: (screenWidth / 2) - 200,
            y: (screenHeight / 2) - 200,
            width: 400,
            height: 200,
            text: "Gem's Battles",
            size: 100,
            color: "white",
            shadowColor: '#111111',
            shadowWidth: 4
        });

        var startButton = new ButtonView({
            superview: this,
            x: screenWidth / 2 - 86,
            y: screenHeight / 2,
            width: 172,
            height: 172,
            images: {
                up: "resources/images/ui/play_up.png",
                down: "resources/images/ui/play_down.png"
            },
            text: {
                color: "#FFFFFF",
                size: 30,
                autoFontSize: true,
                autoSize: false,
                shadowColor: "#111111",
            },
            on: {
                up: function() {                    
                    mthis.emit("splashscreen:start");
                }
            }
        });
    }
});

var LoadingAnimation = Class(SpriteView, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            url: "resources/images/ui/loading/loading",
            frameRate: 30
        });
        supr(this, 'init', [opts]);
        this.startAnimation('anim', {loop: true});
    }
});