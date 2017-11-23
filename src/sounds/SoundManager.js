import AudioManager;

exports.sound = null;

/* Initialize the audio files if they haven't been already.
 */
exports.getSound = function () {
  if (!exports.sound) {
    var sound = new AudioManager({
      path: 'resources/audio',
      files: {
        background: {
          volume: 0.5,
          background: true,
          loop: true
        },
        win: {
          background: false
        }
      }
    });
    sound.addSound('lose', {
      path: 'effects',
      background: false
    });
    sound.addSound('move', {
      path: 'effects',
      background: false
    });
    for(var i=1; i<=8; i++)
    {
      sound.addSound('star'+i, {
        path: 'effects',
        background: false
      });
    }
    exports.sound = sound;
  }
  return exports.sound;
};
