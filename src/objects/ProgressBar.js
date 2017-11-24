import ui.View as View;
import src.common.define as DEF;
import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView;
import ui.TextView as TextView;

exports = Class(View, function(supr) {
    
    this.init = function(opts)
    {
        opts = merge(opts,{
            progress: 20,
            clip:true
        });
        supr(this, 'init', [opts]);
        var width = opts.width;
        var height = opts.height;             

        var frame = new View({
            superview: this,
            width:width-24,
            height:height,
            y: 0,
            x: 12,
            clip:true
        });

        new ImageView({
            superview: frame,
            width:width,
            height:height,
            image: 'resources/images/ui/progress_bar0.png',
            y: 0,
            x: 0
        });

        this._bar = new ImageView({
            superview: frame,
            width:width,
            height:height,
            image: 'resources/images/ui/progress_bar.png',
            y: 0,
            x: width * opts.progress / 100 - width,
        });

        new ImageScaleView({
            superview: this,
            width:width,
            height:height,
            image: 'resources/images/ui/progress_bg.png',
            layout: 'box',
            scaleMethod: 'contain',
            y: 0,
            x: 0
        });

        this._text = new TextView({
            superview: frame,
            buffer: false,
			autoFontSize: true,
			x: 0,
			y: 0,
			width:width,
            height:height,
			size: height*0.8,
			wrap: true,
			color: "#FAFAFA",
            outlineColor: "#000000",
            text:""
        }); 
    }

    this.setProgress = function(progress)
    {
        var width = this._opts.width;
        progress = progress < 0 ? 0 : progress > 100 ? 100 : progress;
        this._bar.updateOpts({
            x: width * progress / 100 - width,
        });
    }

    this.setLabel = function(text)
    {
        this._text.updateOpts({
            text:text
        });
    }
});
