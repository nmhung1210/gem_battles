import ui.View;
import src.sounds.SoundManager as SoundMgr;
import src.common.define as DEF;
import ui.widget.ButtonView as ButtonView;

exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    {
        supr(this, 'init', [opts]);
        var width = opts.width;
        var height = opts.height;             
        var mthis = this;

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
                    mthis.emit(DEF.EVENT_MENU_BACK);
                }
            }
        });
        
    }
});
