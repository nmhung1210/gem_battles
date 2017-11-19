import ui.View;
import ui.TextView as TextView;
import ui.ImageScaleView as ImageScaleView;
import ui.ImageView;
import ui.resource.loader as loader;
import ui.widget.ButtonView as ButtonView;


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
        
        var loadingView = this.showLoadingAnimation();            
        setTimeout(function() {
            loader.preload(['resources/images/', 'resources/sound'], function() {
                loadingView.hide();
                view.build();
            }); 
        }, 1);
    };       
    
    this.showLoadingAnimation = function()
    {
        var screenWidth = this.app.screenWidth();
        var screenHeight = this.app.screenHeight();
        return new LoadingSheet({
            superview: this,
            x: (screenWidth / 2 - 64),
            y: (screenHeight / 2 - 64),
            width: 128,
            height: 128,            
        });
    }
    
    this.build = function() {
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

var LoadingSheet = Class(ui.ImageView, function(supr) {
    
    this.init = function(opts) {
        opts = merge(opts, {
            image: "resources/images/ui/time_icon_0001.png"
        });
        supr(this, "init", [opts]);
        this._dt = 0;
        this._index = 0;        
    }
    
    this.tick = function(dt) {        
        this._dt += dt;
        if (this._dt > 50) 
        {
            this._dt %= 50;
            this._index = (this._index + 1) % 14;
            this.setImage("resources/images/ui/time_icon_" + (10000+this._index+1).toString().substr(1) +".png");            
        }
    }
});