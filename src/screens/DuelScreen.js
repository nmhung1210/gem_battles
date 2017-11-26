import ui.View as View;
import ui.resource.loader as Loader;
import ui.SpriteView as SpriteView;
import src.common.Define as DEF; 
 
import src.characters.NinjaGirl as NinjaGirl;
import src.characters.FreekNight as FreekNight;

exports = Class(View, function(supr) {
    this.init = function(opts) {
        supr(this, 'init', [opts]);
        var app = opts.app;
        var screenWidth = app.screenWidth();
        var screenHeight = app.screenHeight();
        
        var freekNight = new FreekNight({
            superview: this,
            x:50,
            y:50,
            width:250,
            height:300
        });       
        var ninjaGirl = new NinjaGirl({
            superview: this,
            x:screenWidth-300,
            y:screenHeight-350,
            flipX:true,
            width:250,
            height:300,
        });     
        
        this.on('InputStart', function (event, point) {
            freekNight.attack(ninjaGirl,false);
            //ninjaGirl.attack(freekNight);
        });
    }
});