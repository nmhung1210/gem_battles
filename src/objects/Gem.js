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

    this.swap = function(item, force)
    {
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
                }
            );
    }

    this.resetNearMatches = function()
    {
        this._matchesDir = {
            V:false,
            H:false
        };
        this._nearMatches = [];
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
        }
        if(vItems.length >=2 )
        {
            matches = matches.concat(vItems);
            this._matchesDir.V = true;
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

    this.isMatchesVertical = function()
    {
        return this._matchesDir.V;
    }

    this.isMatchesHorizontal = function()
    {
        return this._matchesDir.H;
    }
});
