import ui.View as View;
import src.common.define as DEF;
import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView;

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
        this._progress = opts.progress;

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
    }

    this.setProgress = function(progress)
    {
        this._progress = progress;
        this._bar.updateOpts({
            width:width * progress / 100
        });
    }
});
