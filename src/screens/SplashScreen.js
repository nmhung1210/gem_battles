import ui.View;
import ui.TextView as TextView;
import ui.ImageScaleView as ImageScaleView;
import ui.widget.ButtonView as ButtonView;
import src.common.Define as DEF; 
import src.sounds.SoundManager as SoundMgr; 

exports = Class(ImageScaleView, function(supr) {
    
    this.init = function(opts)
    {
        var app = opts.app;
        var screenWidth = app.screenWidth();
        var screenHeight = app.screenHeight();
        opts = merge(opts, {
            scaleMethod: 'cover',
			layout: 'box',
			layoutWidth: '100%',
			layoutHeight: '100%',
            centerX: true,
            image:"resources/splash/splash.jpg",
            x:0,
            y:0
        });
        supr(this, 'init', [opts]);      
        
        var mthis = this;
        
        new TextView({
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

        new ButtonView({
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
                    SoundMgr.getSound().play("move");    
                    mthis.emit(DEF.EVENT_GAME_START);
                }
            }
        });
    };       
});

