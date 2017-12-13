import ui.View as View;
import ui.resource.loader as Loader;
import ui.SpriteView as SpriteView;
import src.common.Define as DEF;

exports = Class(View, function (supr) {
  this.init = function (opts) {
    supr(this, 'init', [opts]);
    var app = opts.app;
    this.loadingSprite = new SpriteView({
      superview: this,
      x: app.screenWidth() / 2 - 48,
      y: app.screenHeight() / 2 - 48,
      width: 96,
      height: 96,
      url: "resources/images/ui/loading/loading",
      frameRate: 30
    });
    this.loadingSprite.startAnimation('anim', { loop: true });
    this.startLoader();
  }

  this.startLoader = function () {
    var mthis = this;
    Loader.preload([
      'resources/images/',
      'resources/audio'
    ], function () {
      mthis.emit(DEF.EVENT_LOADING_COMPLETE);
    });
  }
});