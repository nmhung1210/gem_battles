import ui.View;
import ui.ImageScaleView as ImageScaleView;
import animate;

exports = Class(ui.View, function(supr) {
    
    this.init = function(opts)
    {
        supr(this, 'init', [opts]);                        
        this._type = opts.type || 1;
        this._col = opts.col;
        this._row = opts.row;
        this._nearItems =opts.nearItems || {
            left:null,
            right:null,
            up:null,
            down:null
        };
        var mthis = this;
        this._background = new ImageScaleView({
            superview: this,
            x: 5,
            y: 5,
            width: opts.width-10,
			height: opts.height-10,
			renderCenter:true,
			scaleMethod:"contain"
        });
        this.setType(this._type);
    };     

    this.setType = function(type)
    {
        type = type % 5;
        this._type = type;
        this._background.setImage("resources/images/gems/gem_0"+(type+1)+".png");
    }

    this.setNearItems = function(nearItems)
    {
        this._nearItems = nearItems;
    }

    this.getNearItem = function(direction)
    {
        return this._nearItems[direction] || null;
    }

    this.getType = function()
    {
        return this._type;
    }

    this.getOrgPos = function()
    {
        return {
            x:this._col * this.style.width,
            y:this._row * this.style.height
        }
    }

    this.swap = function(item,direction)
    {
        var mthis = this;
        var pos1 = this.getOrgPos();
        var pos2 = item.getOrgPos();
        animate(this).clear().now(pos1).then(pos2,200,animate.linear).then(pos1,0);
        animate(item).clear().now(pos2).then(pos1,200,animate.linear).then(pos2,0).then(function(){
            var mtype = mthis.getType();
            mthis.setType(item.getType());
            item.setType(mtype);
        });
    }

});
