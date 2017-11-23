import ui.View as View;
import src.objects.Gem as Gem;
import math.geom.Vec2D as Vec2D;
import src.common.define as DEF;
import ui.ParticleEngine as ParticleEngine;
import src.sounds.SoundManager as SoundMgr;

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
        
        this.initBoard();
        this.handleInput();
        this.initParticle();    
    };     

    this.initParticle = function()
    {
        this._pEngine = new ParticleEngine({
            superview: this,
            width: this._opts.cellWidth,
            height: this._opts.cellHeight,
            initCount: this._opts.cols * this._opts.rows
          });
        //this._pEngine.emitParticles(this._gems);
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
            mthis._selected_gem = board[row] ? board[row][col] ? board[row][col] : null : null;
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

    this.resetGemType = function(gem)
    {
        gem.setType(Math.floor(Math.random() * 5) + 1  );
        gem.updateNearMatches();
        while(gem.isMatches())
        {
            gem.setType(Math.floor(Math.random() * 5) + 1  );
            gem.updateNearMatches();
        }
    }

    this.resetBoard = function()
    {
        var cols  = this._opts.cols;
        var rows = this._opts.rows;
        var board = this._board;
        for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
                var gem = board[y][x];
                this.resetGemType(gem);    
                gem.resetFired();   
			}
        }
    }

    this.handleSwap = function()
    {
        var selected_gem = this._selected_gem;
        var swap_direction = this._swap_direction;
        if(selected_gem && !selected_gem.isLocked() && swap_direction)
        {
            var swap_gem = selected_gem.getNearItem(swap_direction);
            if(swap_gem && !swap_gem.isLocked())
            {
                var mthis = this;
                SoundMgr.getSound().play("move");
                selected_gem.swap(swap_gem).then(function(){
                    if(!selected_gem.isMatches() && !swap_gem.isMatches())
                    {
                        SoundMgr.getSound().play("lose");
                        selected_gem.swap(swap_gem, true);
                    }
                    selected_gem.isMatches() && mthis.handleMatches(selected_gem);
                    swap_gem.isMatches() && mthis.handleMatches(swap_gem);
                });
            }
            this._selected_gem = null;
            this._swap_direction = null;
        }
    }

    this.handleMatches = function(gem)
    {
        var matches = gem.getNearMatches();
        var fallCols = {};
        for(var i=0; i< matches.length; i++)
        {
            var item = matches[i];
            SoundMgr.getSound().play("star"+(i+1));
            item.fired();
            fallCols[item._col] = (fallCols[item._col] || 0)+1;
        }
        setTimeout(function(mthis){
            for(var col in fallCols)
            {
                mthis.fallColDown(col, fallCols[col]);
            }                
        },DEF.GEM_FIRING_TIME, this);
    }

    this.fallColDown = function(col, depth)
    {
        var cols  = this._opts.cols;
        var rows = this._opts.rows;
        var board = this._board;
        var uprest = false;
        var mthis = this;
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
                this.resetGemType(gem);
            }
            gem.resetFired();
            gem.fallDown(depth);
        }

        //recheck if have the next matches
        setTimeout(function(){
            for(var y=0; y<rows; y++)
            {
                var gem = board[y][col];
                gem.isMatches() && mthis.handleMatches(gem);
            }            
        },DEF.GEM_FALLING_TIME+50);
    }

    this.checkPotentialMatches = function()
    {
        for(var i=0; i<this._gems.length; i++)
        {
            var gem = this._gems[i];
            if(gem.isLocked())
            {
                return true;
            }
        }

        for(var i=0; i<this._gems.length; i++)
        {
            var gem = this._gems[i];
            gem.updatePotentialMatches();
            if(gem.isPotentialMatches())
            {
                return true;
            }            
        }
        //no more matches. Try to reset the board
        for(var i=0; i<this._gems.length; i++)
        {
            var gem = this._gems[i];
            gem.fired();
        }
        setTimeout(function(mthis){
            mthis.resetBoard();             
        },DEF.GEM_FIRING_TIME + 50, this);
    }

    this.autoPlay = function()
    {
        for(var i=0; i<this._gems.length; i++)
        {
            var gem = this._gems[i];
            if(gem.isLocked())
            {
                setTimeout(function(mthis){
                    mthis.autoPlay();             
                },DEF.GEM_FIRING_TIME + DEF.GEM_FALLING_TIME+200 , this);
                return false;
            }
        }
        for(var i=0; i<this._gems.length; i++)
        {
            var gem = this._gems[i];
            if(gem.isPotentialMatches())
            {
                var pMatches = gem.getPotentialMatches();
                this._selected_gem = pMatches[0][0];
                this._swap_direction = pMatches[0][2];
                break;
            }
        }
        setTimeout(function(mthis){
            mthis.autoPlay();             
        },DEF.GEM_FIRING_TIME + DEF.GEM_FALLING_TIME+200 , this);
    }
   
    this.tick = function(dt)
    {
        this.handleSwap();
        this._pEngine.runTick(dt);
        this.checkPotentialMatches();
    }
});
