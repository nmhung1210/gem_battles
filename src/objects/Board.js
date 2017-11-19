import ui.View as View;
import src.objects.Gem as Gem;
import math.geom.Vec2D as Vec2D;
import src.common.constants as Constants;

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
        
        this.resetBoard();
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
                if(mag > Constants.SWIPE_GEM_MAGNITUDE)
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

    this.resetBoard = function()
    {
        var mthis = this;
        var width = mthis._opts.width;
        var height = mthis._opts.height;
        var cols  = mthis._opts.cols;
        var rows = mthis._opts.rows;
        var cellWidth = mthis._opts.cellWidth;
        var cellHeight = mthis._opts.cellHeight;

        for (var y = 0; y < rows; y++) {
            mthis.gems[y] = [];
			for (var x = 0; x < cols; x++) {
				mthis.gems[y][x] = new Gem({
					superview: mthis, 
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
        var gems = mthis.gems;
        for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
                var gem = gems[y][x];
                gem.setNearItems({
                    left: x > 0 ? gems[y][x-1] : null,
                    right: x < cols-1 ? gems[y][x+1] : null,
                    up: y > 0 ? gems[y-1][x] : null,
                    down: y < rows-1 ? gems[y+1][x] : null,
                });
			}
        }
    }

    this.handleSwap = function()
    {
        if(this.selected_gem && this.swap_direction)
        {
            var swapTo = this.selected_gem.getNearItem(this.swap_direction);
            if(swapTo)
            {
                this.selected_gem.swap(swapTo,this.swap_direction);            
            }
            this.selected_gem = null;
            this.swap_direction = null;
        }
    }

    this.getMatches = function(gem, direction)
    {
        var result = [gem];
        var tmp = gem.getNearItem(direction);
        while(tmp && tmp.getType() == gem.type())
        {
            result.push(tmp);
            tmp = tmp.getNearItem("left");
        }
        return result;
    }

    this.getMatchesAll = function(gem)
    {
        var hItems = this.getMatches(gem,"left").concat(this.getMatches(gem,"right"));
        var vItems = this.getMatches(gem,"up").concat(this.getMatches(gem,"down"));
        if(hItems.length >=3 )
        {
            this.fireItems(hItems);
        }
        if(vItems.length >=3 )
        {
            this.fireItems(vItems);
        }
    }

    this.fireItems = function(items)
    {
        
    }

    this.tick = function(dt)
    {
        this.handleSwap();
    }
});
