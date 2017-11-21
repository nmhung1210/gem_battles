import ui.View;
import ui.ImageScaleView as ImageScaleView;
import ui.ImageView as ImageView;
import ui.widget.ButtonView as ButtonView;
import ui.ScrollView as ScrollView;
import ui.resource.Image as Image;
import ui.widget.ButtonView as ButtonView;

import event.input.drag as drag;
import src.objects.Gem as Gem;
import src.objects.Board as Board;

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
		

		var board = new Board({
			superview: mainFrame,
            x: 30,
			y: 320,
			width: 520,
			height: 520,
			cols:5,
			rows:5
		});

		

	};     
	
	this.startLevel = function(level)
	{
		console.log(level);
	}
});
