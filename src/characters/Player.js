import ui.View as View;
import ui.resource.loader as Loader;
import ui.SpriteView as SpriteView;
import src.common.Define as DEF;
import animate;

exports = Class(SpriteView, function (supr) {
  this.init = function (opts) {
    opts = merge(opts, {
      frameRate: 10,
      defaultAnimation: opts.defaultAnimation || "idle"
    });
    supr(this, 'init', [opts]);
    this._x = opts.x;
    this._y = opts.y;
    this._dir = opts.dir;
    this.idle(true);
  }

  this.attack = function (enemy) {
    var mthis = this;
    animate(enemy)
      .then(enemy.getOrgPos(), 100)
      .then(function () {
        animate(mthis)
          .then(enemy.getAttackPos(), 300)
          .then(function () {
            mthis.startAnimation('attack');
            enemy.dead();
          })
          .wait(1000)
          .then(mthis.getOrgPos(), 300);
      })

  }
  this.idle = function (loop) {
    this.startAnimation('idle');
  }
  this.dead = function (loop) {

    this.startAnimation('dead');
  }
  this.getPos = function () {
    var pos = this.getPosition(this._opts.superview);
    return {
      x: pos.x,
      y: pos.y
    }
  }
  this.getAttackPos = function () {
    return this._opts.attackPos;
  }
  this.getOrgPos = function () {
    return {
      x: this._x,
      y: this._y
    }
  }
});