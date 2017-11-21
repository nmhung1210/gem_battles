import ui.View;
import ui.ImageScaleView as ImageScaleView;
import animate;
import src.common.define as DEF;

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
        this._nearMatches = [];
        this._horizonalMatches = [];
        this._verticalMatches = [];
        this._matchesDir = {
            V:false,
            H:false
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

    this.setLock = function(lock)
    {
        this._lock = lock;
    }

    this.isLocked = function()
    {
        return this._lock;
    }

    this.swap = function(item, force)
    {
        this.setLock(true);
        item.setLock(true);
        var mthis = this;
        var pos1 = this.getOrgPos();
        var pos2 = item.getOrgPos();
        animate(this).clear()
            .now(pos1)
            .then(
                pos2,
                DEF.GEM_SWAP_TIME,
                animate.linear
            ).then(pos1,0);

        return animate(item).clear()
                .now(pos2)
                .then(
                    pos1,
                    DEF.GEM_SWAP_TIME,
                    animate.linear
                ).then(pos2,0)
                .then(function(){
                    var mtype = mthis.getType();
                    mthis.setType(item.getType());
                    item.setType(mtype);
                    if(!force)
                    {
                        mthis.updateNearMatches();
                        item.updateNearMatches();
                    }else{
                        mthis.resetNearMatches();
                        item.resetNearMatches();
                    }
                    mthis.setLock(false);
                    item.setLock(false);
                }
            );
    }

    this.fired = function()
    {
        var mthis = this;
        this.setLock(true);
        this._fired = true;
        return animate(this).clear()
             .now({opacity:0},DEF.GEM_FIRING_TIME*0.35)
             .then({opacity:0.9},DEF.GEM_FIRING_TIME*0.35)
             .then({opacity:0},DEF.GEM_FIRING_TIME*0.4).then(function(){
                mthis.setLock(false);
             });
    }

    this.reset = function()
    {
        this._fired = false;
        this.style.opacity = 1;
    }

    this.isFired = function()
    {
        return this._fired;
    }

    this.getEdge = function(direction)
    {
        var item = this;
        var next = this.getNearItem(direction);
        while(next)
        {
            item = next;
            next = next.getNearItem(direction);
        }
        return item;
    }

    this.getNearItemAt = function(direction, depth)
    {
        var item = this;
        while(depth-- > 0)
        {
            item = item.getNearItem(direction);
            if(!item) return null;
        }
        return item;
    }
    
    this.resetNearMatches = function()
    {
        this._matchesDir = {
            V:false,
            H:false
        };
        this._nearMatches = [];
        this._horizonalMatches = [];
        this._verticalMatches = [];
    }


    this.updateNearMatches = function()
    {
        this.resetNearMatches();
        var hItems = [].concat(this.findMatches("left"),this.findMatches("right"));
        var vItems = [].concat(this.findMatches("up"), this.findMatches("down"));
        var matches = [];
        
        if(hItems.length >=2 )
        {
            matches = matches.concat(hItems);
            this._matchesDir.H = true;
            this._horizonalMatches = [this].concat(hItems);
        }
        if(vItems.length >=2 )
        {
            matches = matches.concat(vItems);
            this._matchesDir.V = true;
            this._verticalMatches = [this].concat(vItems);
        }
        this._nearMatches = [this].concat(matches);
    }

    this.findMatches = function(direction)
    {
        var result = [];
        var tmp = this.getNearItem(direction);
        while(tmp && tmp.getType() == this.getType())
        {
            result.push(tmp);
            tmp = tmp.getNearItem(direction);
        }
        return result;
    }

    this.getNearMatches = function()
    {
        return this._nearMatches;
    }

    this.isMatches = function()
    {
        return (this._matchesDir.V || this._matchesDir.H);
    }

    this.getVerticalMatches = function()
    {
        return this._verticalMatches;
    }

    this.getHorizonalMatches = function()
    {
        return this._horizonalMatches;
    }

    this.isMatchesVertical = function()
    {
        return this._matchesDir.V;
    }

    this.isMatchesHorizontal = function()
    {
        return this._matchesDir.H;
    }
});
