import ui.View;
import ui.ImageScaleView as ImageScaleView;
import ui.widget.ButtonView as ButtonView;
import ui.ScrollView as ScrollView;
import ui.resource.Image as Image;
import src.common.Define as DEF;
import src.sounds.SoundManager as SoundMgr;

var LevelPossitions = [
  [86, 1600],
  [462, 1520],
  [160, 1400],
  [350, 1157],
  [354, 894],
  [52, 728],
  [450, 532],
  [169, 359],
  [334, 206]
];
exports = Class(ui.View, function (supr) {

  this.init = function (opts) {
    supr(this, 'init', [opts]);
    this._app = opts.app;
    this._worldMapImage = new Image({ url: "resources/images/ui/worldmap.jpg" });
    this._worldMapImage.doOnLoad(initUI.bind(this));
  };

  var initUI = function () {
    var screenWidth = this._app.screenWidth();
    var screenHeight = this._app.screenHeight();
    var imgW = this._worldMapImage.getWidth();
    var imgH = this._worldMapImage.getHeight();

    var scale = screenWidth / imgW;

    var scrollWorldMapView = new ScrollView({
      superview: this,
      scrollBounds: {
        minY: 0,
        maxY: imgH * scale
      },
      scrollX: false,
      x: 0,
      y: 0,
      width: screenWidth,
      height: screenHeight
    });
    var imageWordMapView = new ImageScaleView({
      superview: scrollWorldMapView,
      image: this._worldMapImage,
      scale: scale,
      width: imgW,
      height: imgH
    });

    scrollWorldMapView.scrollTo(0, imgH * scale - screenHeight, 0);

    for (var i = 0; i < LevelPossitions.length; i++) {
      new LevelButton({
        superview: imageWordMapView,
        x: LevelPossitions[i][0],
        y: LevelPossitions[i][1],
        title: i + 1,
        on: {
          up: startLevel.bind(this, i)
        }
      });
    }
  }

  var startLevel = function (level) {
    SoundMgr.getSound().play("move");
    this.emit(DEF.EVENT_LEVEL_SELECTED, level);
  }
});

var LevelButton = Class(ButtonView, function (supr) {
  this.init = function (opts) {
    opts = merge(opts, {
      width: 96,
      height: 96,
      images: {
        up: "resources/images/ui/button_0.png",
        down: "resources/images/ui/button_1.png"
      },
      text: {
        color: "#FAFAFA",
        size: 64,
        autoFontSize: false,
        autoSize: false
      }
    });
    supr(this, 'init', [opts]);
  }
});