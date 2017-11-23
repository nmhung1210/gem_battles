import ui.View;
import src.sounds.SoundManager as SoundMgr;
import src.common.define as DEF;
import ui.widget.ButtonView as ButtonView;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.ScoreView as ScoreView;
import src.objects.ProgressBar as ProgressBar;

exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    {
        supr(this, 'init', [opts]);
        var width = opts.width;
        var height = opts.height;             
        var mthis = this;
        this._score = 0;
        this._timeout = DEF.GAME_DURATION;

        new ButtonView({
            superview: this,
            x: width-64-16,
            y: 16,
            width: 64,
            height: 64,
            images: {
                up: "resources/images/ui/reset_up.png",
                down: "resources/images/ui/reset_down.png"
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
                    mthis.emit(DEF.EVENT_MENU_RESET);
                }
            }
        });

        new ButtonView({
            superview: this,
            x: 16,
            y: 16,
            width: 64,
            height: 64,
            images: {
                up: "resources/images/ui/back_up.png",
                down: "resources/images/ui/back_down.png"
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
                    SoundMgr.getSound().stop("background");
                    mthis.emit(DEF.EVENT_MENU_BACK);
                }
            }
        });

        var imageview = new ImageView({
            superview: this,
            image: 'resources/images/ui/header.png',
            width: 249,
            height: 166,
            x: width/2-249/2,
            y: 0
          });

        this._timeoutView = new TextView({
            superview: imageview,
			buffer: false,
			autoFontSize: true,
			x: 25,
			y: 35,
			height: 150,
			width: 200,
			size: 72,
			wrap: true,
			color: "#FAFAFA",
			outlineColor: "#000000",
			verticalPadding: 5,
			horizontalPadding: 20,
			text: Math.floor(this._timeout / 1000).toString()
		});

        this.scoreText = new TextView({
            superview: this
        }); 

        new ProgressBar({
            superview: this,
			x: width/2 - 200,
			y: height-100,
			height: 50,
            width: 400,
            progress:50
        });
        
    }

    this.addScore = function(score)
    {
        this._score += score;
    }

    this.tick = function(dt)
    {
        this._timeout -= dt;
        this._timeout = this._timeout < 0 ? 0 : this._timeout;
        this._timeoutView.setText("00:"+Math.floor(this._timeout / 1000).toString());
    }
});
