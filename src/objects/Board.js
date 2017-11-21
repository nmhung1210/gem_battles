import ui.View as View;
import src.objects.Gem as Gem;
import math.geom.Vec2D as Vec2D;
import src.common.define as DEF;



exports = Class(View, function(supr) {
    
    this.init = function(opts)
    {
        opts = merge(opts,{
            cellWidth : opts.width / opts.cols,
            cellHeight : opts.height / opts.rows,
        });
        supr(this, 'init', [opts]);

        this.selected_gem = null;
        this.swap_direction = null;
        this.gems = [];
        
        this.initBoard();
        this.handleInput();
       
    };     

    this.handleInput = function()
    {
        var mthis = this;
        var gems = this.gems;
        var startTouchPoint = null;
        var cellWidth = this._opts.cellWidth;
        var cellHeight = this._opts.cellHeight;

        this.on('InputStart', function (event, point) {
            var row = Math.floor(point.y / cellHeight);
            var col = Math.floor(point.x / cellWidth);
            mthis.selected_gem = gems[row] ? gems[row][col] ? gems[row][col] : null : null;
            startTouchPoint = point;
        });
        
        this.on('InputMove', function (event, point)  {
            if(startTouchPoint && mthis.selected_gem)
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
                        mthis.swap_direction = delta.y < 0 ? "up" : "down";
                    }
                    else                        
                    {
                        mthis.swap_direction = delta.x < 0 ? "left" : "right";
                    }  
                }
            }
        });
        this.on('InputOut', function (event, point) {
            mthis.selected_gem = null;
            mthis.swap_direction = null;
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
        var gems = this.gems;

        for (var y = 0; y < rows; y++) {
            gems[y] = [];
			for (var x = 0; x < cols; x++) {
				gems[y][x] = new Gem({
					superview: this, 
                    width:cellWidth,
                    height:cellHeight,
                    x:cellWidth*x,
                    y:cellHeight*y,
                    col:x,
                    row:y,
                    type: Math.floor(Math.random() * 5) + 1  
				});
			}
        }
        
        for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
                gem = gems[y][x];
                gem.setNearItems({
                    left: x > 0 ? gems[y][x-1] : null,
                    right: x < cols-1 ? gems[y][x+1] : null,
                    up: y > 0 ? gems[y-1][x] : null,
                    down: y < rows-1 ? gems[y+1][x] : null,
                });
			}
        }
    }

    this.resetBoard = function()
    {
        var gems = this.gems;
        for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
                gem = gems[y][x];
                gem.setType(Math.floor(Math.random() * 5) + 1  );
                gem.updateMatches();
                while(gem.isMatches())
                {
                    gem.setType(Math.floor(Math.random() * 5) + 1  );
                    gem.updateMatches();
                }
			}
        }
    }

    this.handleSwap = function()
    {
        var selected_gem = this.selected_gem;
        var swap_direction = this.swap_direction;
        if(selected_gem && swap_direction)
        {
            var swap_gem = selected_gem.getNearItem(swap_direction);
            if(swap_gem)
            {
                var mthis = this;
                selected_gem.swap(swap_gem).then(function(){
                    if(!selected_gem.isMatches() && !swap_gem.isMatches())
                    {
                        selected_gem.swap(swap_gem, true);
                    }
                    selected_gem.isMatches() && mthis.handleMatches(selected_gem);
                    swap_gem.isMatches() && mthis.handleMatches(swap_gem);
                });
            }
            this.selected_gem = null;
            this.swap_direction = null;
        }
    }

    this.handleMatches = function(gem)
    {
        
    }
   
    this.tick = function(dt)
    {
        this.handleSwap();
    }
});
