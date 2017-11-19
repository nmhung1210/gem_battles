import ui.View;
import ui.ImageScaleView as ImageScaleView;
import ui.widget.ButtonView as ButtonView;
import ui.ScrollView as ScrollView;
import ui.resource.Image as Image;
import ui.widget.ButtonView as ButtonView;

import event.input.drag as drag;

var LevelPossitions = [
    [86,1600],
    [462,1520],
    [160,1400],
    [350,1157],
    [354,894],
    [52,728],
    [450,532],
    [169,359],
    [334,206]
];
exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    {
        supr(this, 'init', [opts]);                        
        var app = opts.app;
        var screenWidth = app.screenWidth();
        var screenHeight = app.screenHeight();        
        var mthis = this;
       
        var worldMapImage = new Image({url: "resources/images/ui/worldmap.jpg"});
        worldMapImage.doOnLoad(function(){
            var scale = screenWidth / worldMapImage.getWidth();
            var scrollWorldMapView = new ScrollView({
                superview: mthis,
                scrollBounds: {
                    minY: 0,
                    maxY: worldMapImage.getHeight() * scale
                },
                scrollX: false,
                x: 0,
                y: 0,
                width: screenWidth,
                height: screenHeight
            });
            var imageWordMapView = new ImageScaleView({
                superview: scrollWorldMapView,
                image: worldMapImage,
                scale:scale,
                width: worldMapImage.getWidth(),
                height: worldMapImage.getHeight()
            });

            scrollWorldMapView.scrollTo(0,worldMapImage.getHeight() * scale-screenHeight,0);

            for(var i=0; i < LevelPossitions.length; i++)
            {
                var levelButton = new ButtonView({
                    superview: imageWordMapView,
                    x: LevelPossitions[i][0],
                    y: LevelPossitions[i][1],
                    width: 96,
                    height: 96,
                    images: {
                        up: "resources/images/ui/button_0.png",
                        down: "resources/images/ui/button_1.png"
                    },
                    title: i+1,
                    text: {
                        color: "#FAFAFA",
                        size: 64,
                        autoFontSize: false,
                        autoSize: false
                    },
                    on: {
                        up: function() {                    
                            mthis.emit("levelselect:start",i);
                        }
                    }
                });

               
            }
        });
    };     
});
