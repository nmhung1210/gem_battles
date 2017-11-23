import ui.View;
import ui.ImageScaleView as ImageScaleView;
import animate;
import src.common.define as DEF;
import ui.ParticleEngine as ParticleEngine;
import src.particles.Flame as Flame;

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
        this._lock = 0;
        this._potentialMatches = [];
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

        this._flame = new Flame({
			superview: opts.superview,
			x: opts.x+opts.width/4,
			y: opts.y,
			width: opts.width/2,
			height: opts.height
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

    this.getOrgPos = function(offsetCols, offsetRows)
    {
        var col = this._col + (offsetCols || 0);
        var row = this._row + (offsetRows || 0);
        return {
            x:col * this.style.width,
            y:row * this.style.height
        }
    }

    this.setLockTime = function(dur)
    {
        this.setLock(true);
        setTimeout(function(mthis){
            mthis.setLock(false);
        },dur,this);
    }

    this.setLock = function(lock, zone)
    {
        this._lock += lock ? 1 : -1;
        console.log("setLock ("+lock+") "+this._row+","+this._col+" => "+this._lock+" zone="+zone);
    }

    this.isLocked = function()
    {
        if(this._lock < 0)
        {
            console.warn("The Gem's lock is negative. Please double check your logic!");
        }
        return this._lock > 0;
    }

    this.swap = function(item, force)
    {
        this.setLockTime(DEF.GEM_SWAP_TIME);
        item.setLockTime(DEF.GEM_SWAP_TIME);
        var mthis = this;
        var pos1 = this.getOrgPos();
        var pos2 = item.getOrgPos();
        animate(this)
            .now(pos1,0)
            .then(
                pos2,
                DEF.GEM_SWAP_TIME,
                animate.linear
            ).then(pos1,0);

        return animate(item)
                .now(pos2,0)
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

    this.fired = function()
    {
        var mthis = this;
        this.setLockTime(DEF.GEM_FIRING_TIME+1);
        this._fired = true;
        return animate(this)
             .now({opacity:0},DEF.GEM_FIRING_TIME*0.35)
             .then({opacity:0.9},DEF.GEM_FIRING_TIME*0.35)
             .then({opacity:0},DEF.GEM_FIRING_TIME*0.3);
    }

    this.tick = function(dt)
    {
        if(this.isFired())
        {
            this._flame.emitFlameParticles();
        }
        this._flame.runTick(dt);
    }

    this.resetFired = function()
    {
        this._fired = false;
        this.style.opacity = 1.0;
    }

    this.fallDown = function(depth)
    {
        var pos1 = this.getOrgPos();
        var pos2 = this.getOrgPos(0,-depth);
        var mthis = this;
        mthis.setLockTime(DEF.GEM_FALLING_TIME);
        return animate(this)
            .now(pos2,0)
            .then(
                pos1,
                DEF.GEM_FALLING_TIME,
                animate.easeOutBounce
            ).then(function(){
                mthis.updateNearMatches();
            }
        );
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

    this.oppositeDirection = function(dir)
    {
        switch(dir)
        {
            case "left":
                return "right";
            case "right":
                return "left";
            case "up":
                return "down";
            case "down":
                return "up";
        }
        return false;
    }

    this.updatePotentialMatches = function()
    {
        this._potentialMatches = [];
        for(var i=0; i < DEF.DIRECTIONS.length; i++)
        {
            var dir = DEF.DIRECTIONS[i];
            if(this.findMatches(dir).length)
            {
                var swapItem = this.getNearItem(this.oppositeDirection(dir));
                if(swapItem)
                {
                    for(var j=0; j < DEF.DIRECTIONS.length; j++)
                    {
                        var sdir = DEF.DIRECTIONS[j];
                        var candidate = swapItem.getNearItem(sdir);
                        if(candidate && candidate !== this && candidate.getType() == this.getType())
                        {
                            this._potentialMatches.push([swapItem,candidate,sdir]);
                        }
                    }
                }
            }
        }
    }

    this.getPotentialMatches = function()
    {
        return this._potentialMatches;
    }

    this.isPotentialMatches = function()
    {
        return this._potentialMatches.length;
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

    this.showHint = function()
    {
        return animate(this)
            .now({opacity:0},100)
            .then({opacity:1},100)
            .then({opacity:0},100)
            .then({opacity:1},100);
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
