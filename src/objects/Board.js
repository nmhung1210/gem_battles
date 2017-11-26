import ui.View as View;
import src.objects.Gem as Gem;
import math.geom.Vec2D as Vec2D;
import src.common.Define as DEF; 
import ui.ParticleEngine as ParticleEngine;
import src.sounds.SoundManager as SoundMgr;
import animate;
import src.particles.Flame as Flame;
import src.common.Utils as Utils;

exports = Class(View, function(supr) {
    
    this.init = function(opts)
    {
        opts = merge(opts,{
            cellWidth : opts.width / opts.cols,
            cellHeight : opts.height / opts.rows,
        });
        supr(this, 'init', [opts]);

        this._selected_gem = null;
        this._swap_direction = null;
        this._board = [];
        this._gems = [];
        this._showHintTime = 0;
        this._score_step = 0;
        this._changedGems = [];
        this._firedItems = [];
                
        this.initBoard();
        this.handleInput();
        
    };     

    this.addToUpdate = function(gem)
    {
        this._changedGems.push(gem);
        return this;
    }

    this.addToFire = function(gem)
    {
        this._firedItems.push(gem.fire());
        return this;
    }

    this.handleInput = function()
    {
        var mthis = this;
        var board = this._board;
        var startTouchPoint = null;
        var cellWidth = this._opts.cellWidth;
        var cellHeight = this._opts.cellHeight;

        this.on('InputStart', function (event, point) {
            var row = Math.floor(point.y / cellHeight);
            var col = Math.floor(point.x / cellWidth);
             var gem = board[row] ? board[row][col] ? board[row][col] : null : null;
             if(gem && !gem.isLocked())
             {
                 gem.setBelongTo("user");
                 mthis._selected_gem = gem;
             }
            startTouchPoint = point;
        });
        
        this.on('InputMove', function (event, point)  {
            if(startTouchPoint && mthis._selected_gem)
            {
                var delta = new Vec2D({
                    x: point.x - startTouchPoint.x,
                    y: point.y - startTouchPoint.y
                });
                var mag = delta.getMagnitude();
                if(mag > DEF.SWIPE_GEM_MAGNITUDE)
                {
                    if (Math.abs(delta.y) > Math.abs(delta.x))
                    {
                        mthis._swap_direction = delta.y < 0 ? "up" : "down";
                    }
                    else                        
                    {
                        mthis._swap_direction = delta.x < 0 ? "left" : "right";
                    }  
                }
            }
        });
        this.on('InputOut', function (event, point) {
            mthis._selected_gem = null;
            mthis._swap_direction = null;
        });
    }

    this.initBoard = function()
    {
        var width = this._opts.width;
        var height = this._opts.height;
        var cols  = this._opts.cols;
        var rows = this._opts.rows;
        var cellWidth = this._opts.cellWidth;
        var cellHeight = this._opts.cellHeight;
        var board = this._board;

        for (var y = 0; y < rows; y++) {
            board[y] = [];
			for (var x = 0; x < cols; x++) {
				board[y][x] = new Gem({
					superview: this, 
                    width:cellWidth,
                    height:cellHeight,
                    x:cellWidth*x,
                    y:cellHeight*y,
                    col:x,
                    row:y,
                    type: Math.floor(Math.random() * 5) + 1  
                });
                this._gems.push(board[y][x]);
			}
        }
        
        for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
                gem = board[y][x];
                gem.setNearItems({
                    left: x > 0 ? board[y][x-1] : null,
                    right: x < cols-1 ? board[y][x+1] : null,
                    up: y > 0 ? board[y-1][x] : null,
                    down: y < rows-1 ? board[y+1][x] : null,
                });
			}
        }
    }

    this.isNeedResetBoard = function()
    {
        for(var i=0; i<this._gems.length; i++)
        {
            var gem = this._gems[i];
            if(gem.isPotentialMatches())
            {
                return false;
            }            
        }
        return true;
    }

    this.resetBoard = function()
    {
        console.log("resetBoard");
        var cols  = this._opts.cols;
        var rows = this._opts.rows;
        var board = this._board;
        for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
                var gem = board[y][x];
                gem.resetType(true);
                gem.resetFired();   
			}
        }
        this.resetHintTime();
    }

    this.handleSwap = function()
    {
        var selected_gem = this._selected_gem;
        var swap_direction = this._swap_direction;
        var mthis = this;
        if(selected_gem && !selected_gem.isLocked() && swap_direction)
        {
            this.resetHintTime();
            var swap_gem = selected_gem.getNearItem(swap_direction);
            if(swap_gem && !selected_gem.isLocked())
            {
                SoundMgr.getSound().play("move");
                var matches = [];
                selected_gem.swap(swap_gem).then(function(){
                    selected_gem.isMatches() && matches.push(selected_gem);
                    swap_gem.isMatches() && matches.push(swap_gem);
                    if(matches.length)
                    {
                        while(matches.length)
                        {
                            mthis.handleMatches(matches.pop());
                        }
                    }
                    else
                    {
                        selected_gem.swap(swap_gem); //swap back                        
                    }
                });
                
            }
            this._selected_gem = null;
            this._swap_direction = null;
        }
    }
    
    this.handleMatches = function(gem)
    {
        var mthis = this;
        var matches = gem.getNearMatches();
        this._score_step += matches.length+(matches.length-3)*matches.length;
        this._score_belongTo = gem.getBelongTo();
        var fallDepth = {};
        for(var i=0; i< matches.length; i++)
        {
            var item = matches[i];
            SoundMgr.getSound().play("star"+(i+1));
            fallDepth[item._col] = (fallDepth[item._col] || 0)+1;
            item.fire();
        }
        animate(this).wait(DEF.GEM_FIRING_TIME).then(function(){
            for(var col in fallDepth)
            {
                mthis.fallColDown(col, fallDepth[col]);
            }                
        });
    }

    this.fallColDown = function(col, depth)
    {
        var rows = this._opts.rows;
        var board = this._board;
        var gem = null;
        for(var y=rows-1; y >= 0; y--)
        {
            gem = board[y][col];
            if(gem.isFired()) break;
        }

        //swap down all type of fired gems
        var row = gem._row;
        for(var y=row; y>=0; y--)
        {
            gem = board[y][col];
            if(y-depth >= 0)
            {
                var upgem = board[y-depth][col];
                gem.setType(upgem.getType());
            }else
            {
                gem.resetType(gem);
            }
            
        }
        //move gems down
        for(var y=row; y>=0; y--)
        {
            gem = board[y][col];
            gem.fallDown(depth);
        }

        //check for next matches
        setTimeout(function(mthis){
            for(var y=row; y>=0; y--)
            {
                gem = board[y][col];
                if(gem.isMatches() && !gem.isLocked())
                {
                    mthis.handleMatches(gem);
                }
            }            
        },DEF.GEM_FALLING_TIME,this);
        return this;
    }

    this.isPotentialMatches = function()
    {
        for(var i=0; i<this._gems.length; i++)
        {
            var gem = this._gems[i];
            if(gem.isPotentialMatches())
            {
                return true;
            }            
        }
        return false;
    }

    this.updatePotentialMatches = function()
    {
        if(!this.isPotentialMatches())
        {
            for(var i=0; i<this._gems.length; i++)
            {
                var gem = this._gems[i];
                gem.fire();
            }
            setTimeout(function(mthis){
                while(!mthis.isPotentialMatches())
                {
                    mthis.resetBoard();
                }
            },DEF.GEM_FIRING_TIME,this);
        }
    }



    this.autoPlay = function()
    {
        if(Math.random()*100 > 80)
        {
            for(var i=0; i<this._gems.length; i++)
            {
                var gem = this._gems[i];
                if(gem.isPotentialMatches())
                {
                    var pmatches = gem.getPotentialMatches()[0];
                    if(!pmatches[0].isLocked() && !pmatches[1].isLocked())
                    {
                        this._selected_gem = pmatches[0];
                        this._swap_direction = pmatches[2];
                        pmatches[0].setBelongTo("bot");
                        pmatches[1].setBelongTo("bot");
                    }
                }
            }
        }else
        {
            var dirs = ["left","right","up","down"];
            var igem = Utils.randomBetween(0,this._gems.length-1);
            var idir = Utils.randomBetween(0,dirs.lenght-1);
            var gem = this._gems[igem];
            var dir = dirs[idir];
            if(!gem.isLocked())
            {
                this._selected_gem = gem;
                this._swap_direction = dir;
                gem.setBelongTo("bot");
                gem.getNearItem(dir) && gem.getNearItem(dir).setBelongTo("bot");
            }
        }
        return this;
    }

    this.isNeedHint = function()
    {
        return this._showHintTime < Date.now();
    }

    this.resetHintTime = function()
    {
        this._showHintTime = Date.now() + DEF.SHOW_HINT_TIMEOUT;
    }

    this.updateHint = function()
    {
        if(this.isNeedHint())
        {
            for(var i=0; i<this._gems.length; i++)
            {
                var gem = this._gems[i];
                if(gem.isPotentialMatches())
                {
                    this.resetHintTime();
                    var potentials = gem.getPotentialMatches();
                    potentials[0][0].showHint();
                    potentials[0][1].showHint();
                    return true;
                }            
            }
        }
    }

    this.updateScore = function()
    {
        if(this._score_step)
        {
            this.emit(DEF.EVENT_SCORE,this._score_step, this._score_belongTo);
            this._score_step = 0;
        }
    }

    this.updateMatches = function()
    {
        for(var i=0; i<this._gems.length; i++)
        {
            var gem = this._gems[i];
            gem.updateNearMatches();
        }
    }
   
    this.tick = function(dt)
    {
        this.handleSwap();
        this.updateHint();
        this.updateScore();
        this.updateMatches();
        if(!animate.getGroup().isActive())
        {
            this.updatePotentialMatches();
            this.autoPlay();
        }
    }
});
