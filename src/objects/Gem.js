import ui.View;
import ui.ImageScaleView as ImageScaleView;
import animate;
import src.common.Define as DEF;  
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
        this._swapGem = null;
        this._lockPids = [];
        this._potentialMatches = [];
        this._nearMatches = [];
        this._lock = 0;

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

        this.setType(this._type, true);
    };     

    this.setType = function(type)
    {
        type = type % 5;
        this._type = type;
        clearTimeout(this._setImgPid);
        this._setImgPid = setTimeout(function(mthis){
            mthis._background.setImage("resources/images/gems/gem_0"+(type+1)+".png");
        },1,this);
        return this;
    }

    this.setLockTime = function(time)
    {
        this._lock++;
        var pid = setTimeout(function(mthis){
            mthis._lock--;
        },time,this);
        this._lockPids.push(pid);
        return this;
    }

    this.isLocked = function()
    {
        return this._lock > 0;
    }

    this.resetLock = function()
    {
        while(this._lockPids.length)
        {
            clearTimeout(this._lockPids.shift());
        }
        this._lock = 0;
    }

    this.resetType = function(check)
    {
        this.setType(Math.floor(Math.random() * 5) + 1  );
        this.updateNearMatches();
        while(check && this.isMatches())
        {
            this.setType(Math.floor(Math.random() * 5) + 1  );
            this.updateNearMatches();
        }
        return this;
    }

    this.setNearItems = function(nearItems)
    {
        this._nearItems = nearItems;
        return this;
    }

    this.getNearItem = function(direction, offset)
    {
        offset = offset || 0;
        var nearItem = this._nearItems[direction] || null;
        while(nearItem && offset-- > 0)
        {
            nearItem = nearItem._nearItems[direction] || null;
        }
        return nearItem;
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

    this.swap = function(item, force)
    {
        this.setLockTime(DEF.GEM_SWAP_TIME);
        item.setLockTime(DEF.GEM_SWAP_TIME);
        item.setBelongTo(this.getBelongTo());

        var mthis = this;
        var pos1 = this.getOrgPos();
        var pos2 = item.getOrgPos();

        //swap type
        var mtype = mthis.getType();
        mthis.setType(item.getType());
        item.setType(mtype);

        this.updateNearMatches();
        item.updateNearMatches();

        //do swap animation
        animate(this)
            .then(pos2,0)
            .then(
                pos1,
                DEF.GEM_SWAP_TIME,
                animate.linear
            );

        return animate(item)
            .then(pos1,0)
            .then(
                pos2,
                DEF.GEM_SWAP_TIME,
                animate.linear
            );
    }

    this.setBelongTo = function(userId)
    {
        this._belongTo = userId;
    }

    this.getBelongTo = function()
    {
        return this._belongTo;
    }

    this.resetBelongTo = function()
    {
        this._belongTo = null;
    }
    
    this.fire = function()
    {
        this.setLockTime(DEF.GEM_FIRING_TIME);
        this._fired = true;
        return animate(this)
            .then({opacity:0},DEF.GEM_FIRING_TIME*0.35)
            .then({opacity:0.9},DEF.GEM_FIRING_TIME*0.35)
            .then({opacity:0},DEF.GEM_FIRING_TIME*0.3);
    }

    this.tick = function(dt)
    {
        if(this.isFired())
        {
            if(Math.random() * 100 > 50)
            {
                this._flame.emitFlameParticles();
            }
        }
        this._flame.runTick(dt);
    }

    this.resetFired = function()
    {
        this._fired = false;
        return animate(this)
            .then({opacity:1.0},0);
    }

    this.fallDown = function(depth)
    {
        this.setLockTime(DEF.GEM_FALLING_TIME);
        var pos1 = this.getOrgPos();
        var pos2 = this.getOrgPos(0,-depth);
        this.resetFired();
        return animate(this)
            .then(pos2,0)
            .then(
                pos1,
                DEF.GEM_FALLING_TIME,
                animate.easeOutBounce
            );
    }

    this.isFired = function()
    {
        return this._fired;
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
        return this;
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
        this._nearMatches = [];
        var hItems = [].concat(this.findMatches("left"),this.findMatches("right"));
        var vItems = [].concat(this.findMatches("up"), this.findMatches("down"));
        var matches = [];
        if(hItems.length >=2 )
        {
            matches = matches.concat(hItems);
        }
        if(vItems.length >=2 )
        {
            matches = matches.concat(vItems);
        }
        this._nearMatches = [this].concat(matches);
        for(var i = 0; i < this._nearMatches.length; i++)
        {
            this._nearMatches[i].setBelongTo(this.getBelongTo());
        }
        //update potential matches also
        this.updatePotentialMatches();
        return this;
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
            .then({opacity:0},100)
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
        return this._nearMatches.length >= 3;
    }
});
